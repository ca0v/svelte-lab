# Svelte Lab

## What is Svelte Lab?

This is a playground for learning [Svelte](https://svelte.dev/).

Updated using `>npm create vite@latest`

See the [live](https://ca0v.github.io/svelte-lab) site

## What does it do?

I am building Svelte components to facilitate creating an animated scrapbook.

## Technical Notes

The [swagger-typescript-api](https://github.com/acacode/swagger-typescript-api) NPM command generates service proxies from swagger docs and should be run each time the services API changes

## What is next?

* BUG: errors are silent...e.g. run without services running...no warnings
* BUG: Heavily zoomed images should increase the resolution using google photos API (presently using default 512?)
* BUG: How to *not* commit "mock" configuration?
* BUG: Set-Cookie has to be set with *SameSite=None*
* BUG: Warn if changes were made and not saved..auto save?
* BUG: When enough time goes by authentication fails, need to re-authenticate
* DGN: drag-drop should be handled by CollageView not SvgImage
* DGN: Remove the PhotoWheel from the CollageView, create a higher-level composite control
* DGN: The signin process is janky..eliminate the Google Popup and try to stay signed in? May not be possible.
* DGN: The "store" files have become arbitrary, refactor
* FTR: Can crop and round corners using clip-path: inset() on the svg image (<https://developer.mozilla.org/en-US/docs/Web/CSS/inset>)
* FTR: Group multiple items and "frame" them with a border (fuse them into a single cell)
* FTR: Multi-level undo/redo
* FTR: Multi-select then align-top|bottom|left|right
* FTR: Would be nice to multi-select and apply effect to all cells at once (zoom, rotate, border coloring, etc.)
* FTR: Make preview-mode into a slide show or at least hide workarea in preview mode
* LRN: Make use of 'use', '#key', '#await', 'click|once|preventDefault', named &lt;slot&gt;, &lt;svelte:fragment&gt;, $$slots, svelte:self

## Authentication and Authorization

I store the CLIENT_ID and API_KEY on the server, but the client needs them to for authentication and to access Photos.

The `CLIENT_ID` is used to authenticate the user.

The `API_KEY` is used to obtain an access token to the Google Photos service.

Once authenticated, the user identity is validated on the `stories/collage` server and the `API_KEY` is returned.

Once the client has the `API_KEY` the user provides consent to access their photos.

Identifying the user on the server was a necessary step to ensure no users share storage.  Although this app is intended for me alone, it is going to be on a public IP address and I don't want to lose my work.

## Command Console

I am not happy with the command interface.  Instead of meaningless keyboard shortcuts that do not work well on smaller keyboards it should be a fluent syntax.  Examples:

| key   | Commmand |
| ----- | -------- |
| A ←   | Rotate active cell CCW |
| A →   | Rotate active cell CW |
| C *k* | Copy the active cell into cell *k*|
| E← ←  | Move left edge of active cell left |
| E← →  | Move left edge of active cell right |
| E→ ←  | Move right edge of active cell left |
| E→ →  | Move right edge of active cell right |
| E↑ ↑  | Move top edge of active cell up |
| E↑ ↓  | Move top edge of active cell down|
| E↓ ↑  | Move bottom edge of active cell up |
| E↓ ↓  | Move bottom edge of active cell down |
| G *k* | Goto/Focus/Select cell *k*|
| S *k* | swap the active cell with cell *k*|
| S ↑   | scale-up background of active cell |
| S ↓   | scale-down background of active cell |
| T *k* | toggle selection of cell *k* |

These "prelude" keys put the processor in a context, making it convenient to repeat commands:

    A←←← # rotate active cell CCW 3x
    R←←← # move left-edge of active cell 3x
    SaSsSdSf # Swap active cell with cell 'a' then 's' then 'd' then 'f'
    S↑↑↑ # scale-up active cell 3x

The `Escape` exits current context.

This will scale better and be easier to remember.  Example of future expansion:

| key  | Commmand |
| ---- | -------- |
| BGC *color* | Set the background-color of the active cell to *color* |
| BC *color* | Set the border-color of the active cell to *color* |
| BW 3 | Sets the border width of the active cell to 3|
| BS . | Sets the border style of the active cell to to dots|

## Terms

`Story` is a collection of collages
`Collage` is a collection of cells
`Cell` is an image container with transition and styling attributes

## References

* [svelte cheet sheet](https://sveltesociety.dev/cheatsheet)
* [google photo api](https://developers.google.com/photos/library/guides/get-started)
* [google auth api](https://developers.google.com/identity/protocols/oauth2#clientside)
