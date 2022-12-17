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

## Technical Notes

The 'swagger-typescript-api' NPM command will generate the service proxies from swagger docs and should be run each time the services API changes

## What is next?

* BUG: the "Transform" is really a "Template" and should not be bound..copy the template and disengage
* BUG: errors are silent...e.g. run without services running...no warnings
* BUG: remove 2nd "Save" button in editor, drop "Focus", "Edit"
* BUG: dates are treating Zulu as local time...very confusing
* FTR: allow audio to be recorded and saved to local storage or service
* DGN: cell transforms belong in configuration
* DGN: drag-drop should be handled by CollageView not SvgImage
* FTR: Can crop and round corners using clip-path: inset() on the svg image (<https://developer.mozilla.org/en-US/docs/Web/CSS/inset>)
* FTR: need to be able to bring-to-front and send-to-back
* DGN: use svelte writable for global stores
