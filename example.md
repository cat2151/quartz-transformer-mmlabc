# MML and Chord Notation Examples

This document demonstrates the usage of the quartz-transformer-mmlabc plugin.

## MML Example

Here's a simple melody in MML notation:

```mml
t120 l4 cdefgab>c
```

This will be rendered as interactive music notation.

## Chord Progression Example

Here's a chord progression:

```chord
C Am F G
```

This will be converted to MML, then to ABC notation, and rendered as music notation.

## Complex MML Example

A more complex melody:

```mml
t140 l8 o4 c d e f g4 g4 a g f e d4 d4 c2
```

## Jazz Chord Progression

```chord
Cmaj7 Am7 Dm7 G7
```

## ABC Notation Example

Here's a direct ABC notation (useful for troubleshooting):

```abc
X:1
T:Twinkle Twinkle Little Star
M:4/4
L:1/4
K:C
C C G G|A A G2|F F E E|D D C2|
```

## Notes

- The plugin automatically detects `mml`, `chord`, and `abc` code blocks
- Music notation is rendered using abcjs
- The rendering is responsive and interactive
- ABC notation blocks are useful for troubleshooting and direct ABC input
