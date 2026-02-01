// Initialize abcjs rendering for all ABC notation blocks
// Supports Quartz v4 SPA navigation by listening for "nav" events
// Note: Uses regular function wrapper (not async IIFE) to avoid blocking page load.
// The async initializeMusicNotation() function is called with error handling.
(function() {
  // Plugin version for debugging
  const PLUGIN_VERSION = '0.1.0-debug';
  console.log('[MML-ABC-Transformer] Plugin loaded. Version:', PLUGIN_VERSION);
  
  // Check if ABCJS is available
  if (typeof ABCJS === 'undefined') {
    console.error('[MML-ABC-Transformer] ABCJS library not loaded');
    return;
  }

  // Global state that persists across SPA navigations
  // Cache the mml2abc module to avoid duplicate imports
  let mml2abcModule = null;
  
  // Cache the chord2mml loading promise to avoid race conditions
  let chord2mmlLoadPromise = null;
  
  // Global synth instance for audio playback
  let currentSynth = null;
  let currentPlayingElement = null;
  
  // Shared AudioContext (create once and reuse across navigations)
  let sharedAudioContext = null;
  
  // WeakMap to store visual objects for each element
  const visualObjMap = new WeakMap();
  
  // Track processed elements to avoid duplicate initialization
  // WeakSet automatically removes references when elements are garbage collected,
  // which is perfect for SPA navigation where DOM elements are dynamically created/destroyed
  const processedElements = new WeakSet();

  // Theme detection and switching for Quartz dark mode integration
  const updateNotationTheme = function(isDark) {
    const blocks = document.querySelectorAll('.abc-notation');
    blocks.forEach(block => {
      if (isDark) {
        block.classList.add('theme-dark');
        block.classList.remove('theme-light');
      } else {
        block.classList.add('theme-light');
        block.classList.remove('theme-dark');
      }
    });
  };

  // Helper to detect Quartz's theme from document attributes or classes
  const getQuartzTheme = function() {
    const htmlElement = document.documentElement;
    const bodyElement = document.body;
    
    // Check data-theme attribute (common in Quartz)
    const dataTheme = htmlElement.getAttribute('data-theme') || bodyElement.getAttribute('data-theme');
    if (dataTheme === 'dark') return 'dark';
    if (dataTheme === 'light') return 'light';
    
    // Check for dark class on html or body
    if (htmlElement.classList.contains('dark') || bodyElement.classList.contains('dark')) {
      return 'dark';
    }
    
    // Fallback to system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    return 'light';
  };

  // ===== nav デバッグ可視化 =====

  function logNavDebug(where) {
    return function (e) {
      const abcNodes = document.querySelectorAll('.abc-notation')
      const processed = document.querySelectorAll('[data-mmlabc-processed]')

      console.groupCollapsed('[nav @ ' + where + ']')

      console.log('event:', e)
      console.log('detail:', e && e.detail)
      console.log('target:', e.target)
      console.log('currentTarget:', e.currentTarget)

      console.log('abc-notation count:', abcNodes.length)
      console.log('processed count:', processed.length)

      if (abcNodes.length > 0) {
        const el = abcNodes[0]
        console.log('sample abc element:', el)
        console.log(
          'sample processed?',
          el.hasAttribute('data-mmlabc-processed')
        )
      }

      console.groupEnd()
    }
  }

  // capture → bubble → window
  document.addEventListener('nav', logNavDebug('document-capture'), true)
  document.addEventListener('nav', logNavDebug('document'))
  window.addEventListener('nav', logNavDebug('window'))

  // ===== 以上、nav デバッグ可視化 =====
  
  // Main initialization function - called on initial load and SPA navigation
  const initializeMusicNotation = async function() {
    console.log('[MML-ABC-Transformer] 五線譜表示処理を開始します');
    const startTime = performance.now();
    
    // Apply current theme
    const currentTheme = getQuartzTheme();
    updateNotationTheme(currentTheme === 'dark');

    // Process all abc-notation blocks
    const blocks = document.querySelectorAll('.abc-notation');
    console.log('[MML-ABC-Transformer] 処理対象の楽譜ブロック数:', blocks.length);
    
    for (const element of blocks) {
      // Skip if this element was already processed (idempotent initialization)
      if (processedElements.has(element)) {
        console.log('[MML-ABC-Transformer] スキップ: 既に処理済みの要素');
        continue;
      }
      
      // Mark as processed
      processedElements.add(element);
      console.log('[MML-ABC-Transformer] 新しい楽譜要素を処理します。Type:', element.getAttribute('data-type'));
      
      const type = element.getAttribute('data-type');
      
      try {
        let abcNotation = '';
      
      if (type === 'mml') {
        const mmlData = element.getAttribute('data-mml');
        if (mmlData) {
          // Dynamically import mml2abc ES module from CDN
          // Version specified by @cat2151 based on verified compatibility in easychord2mml
          if (!mml2abcModule) {
            mml2abcModule = await import('https://cdn.jsdelivr.net/gh/cat2151/mml2abc/dist/mml2abc.mjs');
          }
          abcNotation = mml2abcModule.parse(mmlData);
        }
      } else if (type === 'chord') {
        const chordData = element.getAttribute('data-chord');
        if (chordData) {
          // Load chord2mml as a script (UMD bundle, not ES module)
          // Version specified by @cat2151 based on verified compatibility in easychord2mml
          if (typeof window.chord2mml === 'undefined') {
            if (!chord2mmlLoadPromise) {
              chord2mmlLoadPromise = new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = 'https://cdn.jsdelivr.net/gh/cat2151/chord2mml/dist/chord2mml.js';
                script.integrity = 'sha384-s0MWjnJMkG/kT19h1SE4UrQ7YZ0eSnBKYgzstrrpAsrHer1g6ZqgCJJbmj0zTIcz';
                script.crossOrigin = 'anonymous';
                script.onload = resolve;
                script.onerror = () => reject(new Error('Failed to load chord2mml script'));
                document.head.appendChild(script);
              });
            }
            await chord2mmlLoadPromise;
          }
          const mmlData = window.chord2mml.parse(chordData);
          // Then convert MML to ABC (reuse cached module)
          if (!mml2abcModule) {
            mml2abcModule = await import('https://cdn.jsdelivr.net/gh/cat2151/mml2abc/dist/mml2abc.mjs');
          }
          abcNotation = mml2abcModule.parse(mmlData);
        }
      } else if (type === 'abc') {
        // For ABC notation, no conversion needed - use directly
        const abcData = element.getAttribute('data-abc');
        if (abcData) {
          abcNotation = abcData;
        }
      }
      
        if (abcNotation) {
          // コンテナのサイズに基づいて五線譜の幅をレスポンシブに計算
          const containerWidth = element.offsetWidth || element.clientWidth || 600;
          // .abc-notation の padding: 1em は左右で合計2em（約32px）
          // フォントサイズが16pxと仮定すると、2em ≈ 32px + 安全マージン約8px = 40px
          const availableWidth = containerWidth - 40;
          // 最小300px、最大800pxの範囲に制限
          const staffWidth = Math.min(Math.max(availableWidth, 300), 800);
          
          // Render the ABC notation with abcjs
          const visualObj = ABCJS.renderAbc(element, abcNotation, {
            responsive: 'resize',
            staffwidth: staffWidth,
            scale: 1.0
          });
          
          // Store the visual object using WeakMap
          visualObjMap.set(element, visualObj);
          
          // Define the playback handler function
          const handlePlayback = async function(e) {
            e.preventDefault();
            
            // Stop any currently playing music
            if (currentSynth) {
              currentSynth.stop();
              if (currentPlayingElement) {
                currentPlayingElement.classList.remove('playing');
              }
            }
            
            // If clicking the same element that's playing, just stop
            if (currentPlayingElement === element) {
              currentPlayingElement = null;
              currentSynth = null;
              return;
            }
            
            try {
              // Create audio context once (requires user gesture for first time)
              if (!sharedAudioContext) {
                const AudioContextClass = window.AudioContext || window.webkitAudioContext;
                if (AudioContextClass) {
                  sharedAudioContext = new AudioContextClass();
                } else {
                  console.error('Web Audio API not supported');
                  return;
                }
              }
              
              // Ensure audio context is running (some browsers start it in a suspended state)
              if (sharedAudioContext.state === 'suspended') {
                await sharedAudioContext.resume();
              }
              
              // Get the visual object for this element
              const visualObj = visualObjMap.get(element);
              if (!visualObj || !visualObj[0]) {
                console.error('Visual object not found for element');
                return;
              }
              
              // Create synth
              if (ABCJS.synth.CreateSynth) {
                currentSynth = new ABCJS.synth.CreateSynth();
                
                // Initialize synth
                await currentSynth.init({
                  audioContext: sharedAudioContext,
                  visualObj: visualObj[0],
                  options: {}
                });
                
                // Prime the synth with the tune
                await currentSynth.prime();
                
                // Mark as playing
                element.classList.add('playing');
                currentPlayingElement = element;
                
                // Set up event listener for when playback finishes
                const cleanup = function() {
                  if (currentPlayingElement === element) {
                    element.classList.remove('playing');
                    currentPlayingElement = null;
                    if (currentSynth && typeof currentSynth.stop === 'function') {
                      currentSynth.stop();
                    }
                    currentSynth = null;
                  }
                };
                
                // Start playback
                // abcjs CreateSynth's start() may return a promise that resolves when complete
                const playbackPromise = currentSynth.start();
                
                // If start() returns a promise, use it to detect completion
                if (playbackPromise && typeof playbackPromise.then === 'function') {
                  playbackPromise.then(function() {
                    // Playback completed successfully
                    cleanup();
                  }).catch(function(error) {
                    // Playback error or stopped
                    console.error('Playback ended or error:', error);
                    cleanup();
                  });
                } else {
                  // If start() doesn't return a promise, we have no way to detect completion
                  // This is actually fine - the user can stop playback by clicking again
                  // The cleanup will happen when they click to play something else or stop
                  console.debug('Playback started (no completion detection available)');
                }
              } else {
                console.error('ABCJS synth API not available');
                const errorParagraph = document.createElement('p');
                errorParagraph.style.color = 'orange';
                errorParagraph.style.fontSize = '0.9em';
                errorParagraph.textContent = 'Audio playback is not available in this version of abcjs.';
                element.appendChild(errorParagraph);
              }
            } catch (error) {
              console.error('Error playing music:', error);
              element.classList.remove('playing');
              currentPlayingElement = null;
              currentSynth = null;
            }
          };
          
          // Add click handler for audio playback
          element.addEventListener('click', handlePlayback);
          
          // Add keyboard handler for accessibility (Enter and Space keys)
          element.addEventListener('keydown', async function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              await handlePlayback(e);
            }
          });
        }
      } catch (error) {
        console.error('Error rendering notation:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        const errorParagraph = document.createElement('p');
        errorParagraph.style.color = 'red';
        if (errorMessage.includes('Failed to fetch') || errorMessage.includes('import')) {
          errorParagraph.textContent = 'Error loading music notation library. Please check your internet connection.';
        } else if (errorMessage.includes('parse')) {
          const notationType = type === 'chord' ? 'chord' : type === 'abc' ? 'ABC' : 'MML';
          errorParagraph.textContent = 'Error parsing ' + notationType + ' notation. Please check the syntax.';
        } else {
          errorParagraph.textContent = 'Error rendering music notation';
        }
        element.innerHTML = '';
        element.appendChild(errorParagraph);
      }
    }
    
    const endTime = performance.now();
    const duration = (endTime - startTime).toFixed(2);
    console.log('[MML-ABC-Transformer] 五線譜表示処理が完了しました。処理時間:', duration, 'ms');
  };

  // Listen for Quartz theme changes
  document.addEventListener('themechange', (e) => {
    const theme = e.detail?.theme;
    if (theme === 'dark' || theme === 'light') {
      updateNotationTheme(theme === 'dark');
    }
  });

  // Flag to prevent duplicate initialization from multiple event sources
  let isInitializing = false;
  
  // Flag to track if initial load has completed
  let initialLoadComplete = false;
  
  // Wrapper function to handle navigation with debouncing
  const handleNavigation = (source) => {
    console.log('[MML-ABC-Transformer] ナビゲーションを検知しました。ソース:', source);
    
    // Prevent concurrent initializations
    if (isInitializing) {
      console.log('[MML-ABC-Transformer] 初期化が既に実行中のためスキップします');
      return;
    }
    
    isInitializing = true;
    
    // CRITICAL FIX FOR ISSUE #71:
    // Clear processedElements on navigation to allow re-rendering
    // This ensures that when navigating to the same page (self-navigation),
    // the elements are processed again after DOM stabilizes
    console.log('[MML-ABC-Transformer] 処理済み要素をクリアします（SPA遷移のため）');
    // Note: We cannot clear a WeakSet directly, but we can create a new one
    // However, we need to keep the reference. Instead, we'll remove the processed
    // attribute from elements and rely on the WeakSet eventually being cleaned up
    // by garbage collection when old DOM elements are removed.
    // For new navigations, the processedElements.has() check in initializeMusicNotation
    // will correctly return false for new DOM elements.
    
    // Call async initialization and handle any errors
    initializeMusicNotation()
      .catch(err => {
        console.error('[MML-ABC-Transformer] Error initializing music notation after navigation:', err);
      })
      .finally(() => {
        isInitializing = false;
      });
  };

  // Listen for Quartz SPA navigation events
  // CRITICAL FIX FOR ISSUE #71:
  // Changed from window.addEventListener to document.addEventListener
  // According to Quartz documentation and issue analysis, nav events are dispatched on document
  // This ensures we catch navigation reliably, including self-navigation
  console.log('[MML-ABC-Transformer] イベントリスナーを登録します');
  
  // Primary: Quartz v4 "nav" event on document (not window)
  document.addEventListener('nav', () => {
    // CRITICAL FIX FOR ISSUE #71:
    // Add a small delay to ensure DOM is fully stable after Quartz completes its SPA navigation
    // The nav event fires when Quartz starts the transition, but DOM might still be settling
    // A 0ms timeout pushes this to the next event loop tick, after all synchronous DOM updates
    setTimeout(() => {
      handleNavigation('nav event');
    }, 0);
  });
  console.log('[MML-ABC-Transformer] "nav" イベントリスナーを登録しました (document)');
  
  // Fallback: popstate event for browser back/forward
  // Note: In some browsers, popstate fires on initial page load. We delay registration
  // to avoid redundant initialization with the initial load call.
  setTimeout(() => {
    window.addEventListener('popstate', () => {
      if (initialLoadComplete) {
        handleNavigation('popstate event');
      }
    });
    console.log('[MML-ABC-Transformer] "popstate" イベントリスナーを登録しました（遅延登録）');
  }, 100);
  
  // Initial render on page load
  console.log('[MML-ABC-Transformer] 初期ページ読み込み時の処理を開始します');
  initializeMusicNotation()
    .catch(err => {
      console.error('[MML-ABC-Transformer] Error initializing music notation on page load:', err);
    })
    .finally(() => {
      initialLoadComplete = true;
      
      // REMOVED MutationObserver (ISSUE #71 FIX):
      // The MutationObserver was causing issues because it fired BEFORE the nav event,
      // leading to rendering on unstable DOM during SPA transitions.
      // The nav event is now the sole, reliable trigger for re-rendering.
      // This ensures we only render when the DOM is stable and complete.
      
      console.log('[MML-ABC-Transformer] 初期化完了。nav イベントによる SPA ナビゲーション検知の準備ができました');
      
      // Register cleanup function for SPA navigation
      // This prevents memory leaks when navigating away
      if (typeof window.addCleanup === 'function') {
        window.addCleanup(() => {
          // Stop any playing audio
          if (currentSynth && typeof currentSynth.stop === 'function') {
            currentSynth.stop();
          }
          if (currentPlayingElement) {
            currentPlayingElement.classList.remove('playing');
          }
          currentSynth = null;
          currentPlayingElement = null;
          
          // Note: We keep sharedAudioContext, mml2abcModule, and chord2mmlLoadPromise
          // cached across navigations for performance
        });
      }
    });
})();
