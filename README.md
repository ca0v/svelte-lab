# Svelte + TS + Vite

This is a playground for ideas that I code using Svelte.

Updated using `>npm create vite@latest`

See the [live](https://ca0v.github.io/svelte-lab) site.

## What does it do?

I am building a Svelte components to facilitate creating an animated scrapbook.
The "HexagonSpiral" is both an editor and a display component.  
It accepts a list of images and allows for editing the layout.
It can also accept an initial state.

### Commands

| Command | Description |
| -       | -            |
| " "     | Toggle the image picker |
| Arrow Keys | Move the image |
| + and - | Zoom the image |
| [A..Z]    | Swap with current cell |
| Alt+S   | Save edits to local storage|
|Alt+C    |Copy state to clipboard|
|Shift+[A..Z]| Focus names cell|

### Other Commands

* From the picker, [A..Z] will copy into that cell

## What is next?

* FTR: allow audio to be recorded and saved to local storage or service
* DGN: cell transforms belong in configuration
* DGN: drag-drop should be handled by HexagonSpiral not SvgImage
* DGN: inject svg clipPath programatically
* FIX: when 'transform' changes it should not have artifacts from prior transform
