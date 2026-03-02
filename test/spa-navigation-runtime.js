// Initialize abcjs rendering for all ABC notation blocks
// Supports Quartz v4 SPA navigation by listening for "nav" events
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
          if (!mml2abcModule) {
            mml2abcModule = await import('https://cdn.jsdelivr.net/gh/cat2151/mml2abc/dist/mml2abc.mjs');
          }
          abcNotation = mml2abcModule.parse(mmlData);
        }
      } else if (type === 'chord') {
        const chordData = element.getAttribute('data-chord');
        if (chordData) {
          // Load chord2mml as a script (UMD bundle, not ES module)
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
        // Calculate responsive staff width
        const containerWidth = element.offsetWidth || element.clientWidth || 600;
        const availableWidth = containerWidth - 40;
        const staffWidth = Math.min(Math.max(availableWidth, 300), 800);
        
        // Render the ABC notation with abcjs
        const visualObj = ABCJS.renderAbc(element, abcNotation, {
          responsive: 'resize',
          staffwidth: staffWidth,
          scale: 1.0
        });
        
        console.log('Rendered notation successfully');
        
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
            
            // Ensure audio context is running
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
              const playbackPromise = currentSynth.start();
              
              // If start() returns a promise, use it to detect completion
              if (playbackPromise && typeof playbackPromise.then === 'function') {
                playbackPromise.then(function() {
                  cleanup();
                }).catch(function(error) {
                  console.error('Playback ended or error:', error);
                  cleanup();
                });
              }
            } else {
              console.error('ABCJS synth API not available');
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
        
        // Add keyboard handler for accessibility
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

  // Listen for Quartz SPA navigation events
  // This ensures notation renders on every page navigation
  window.addEventListener('nav', () => {
    console.log('[MML-ABC-Transformer] SPA page 遷移を検知しました');
    // Call async initialization and handle any errors
    initializeMusicNotation().catch(err => {
      console.error('[MML-ABC-Transformer] Error initializing music notation after navigation:', err);
    });
  });

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
    });
  }

  // Initial render on page load
  console.log('[MML-ABC-Transformer] 初期ページ読み込み時の処理を開始します');
  initializeMusicNotation().catch(err => {
    console.error('[MML-ABC-Transformer] Error initializing music notation on page load:', err);
  });
})();
