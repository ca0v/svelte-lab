# Svelte Lab

## What is Svelte Lab?

This is a playground for learning [Svelte](https://svelte.dev/).

Updated using `>npm create vite@latest`

See the [live](https://ca0v.github.io/svelte-lab) site

## What does it do?

I am building a Svelte components to facilitate creating an animated scrapbook.

## Technical Notes

The [swagger-typescript-api](https://github.com/acacode/swagger-typescript-api) NPM command generates service proxies from swagger docs and should be run each time the services API changes

## What is next?

* BUG: How to *not* commit "mock" configuration?
* BUG: errors are silent...e.g. run without services running...no warnings
* DGN: drag-drop should be handled by CollageView not SvgImage
* FTR: Can crop and round corners using clip-path: inset() on the svg image (<https://developer.mozilla.org/en-US/docs/Web/CSS/inset>)
* FTR: need to be able to bring-to-front and send-to-back
* DGN: Remove the PhotoWheel from the CollageView, create a higher-level composite control
* BUG: "ENTER" moves photo to top but does not persist the ordering <-- here
* BUG: "Preview" is not rendering any collages
* LRN: Make use of 'use', '#key', '#await', 'click|once|preventDefault', named &lt;slot&gt;, &lt;svelte:fragment&gt;, $$slots, svelte:self
* DGN: Instead of storing the 'known' image list in local storage, save it to the collage server in photos
* DGN: Often exceeding per-minute quota...how to cache better?
* BUG: Updating a note is causing a complete screen update (too fast to notice, but try to fix)
* BUG: Heavily zoomed images should increase the resolution using google photos API (presently using default 512?)
* BUG: Warn if changes were made and not saved..auto save?
* DGN: The signin process is janky..eliminate the Google Popup and try to stay signed in? May not be possible.
* BUG: Set-Cookie has to be set with SameSite=None (session=7de662eb-dca4-434c-95a3-7ec7b21b2e96; Expires=Fri, 23 Dec 2022 01:01:51 GMT; HttpOnly; Path=/), my dev site is http.
* BUG: lost commands for moving from wheel into collage
* DGN: Rethink how I'm dealing with input/button/textarea focus...lots of special keys are applicable (arrow, home, end, etc.)
* BUG: When enough time goes by...

        {
            "code": 401,
            "message": "Request had invalid authentication credentials. Expected OAuth 2 access token, login cookie or other valid authentication credential. See <https://developers.google.com/identity/sign-in/web/devconsole-project>.",
            "status": "UNAUTHENTICATED"
        }
* FTR: Would be nice to multi-select and apply effect to all cells at once (zoom, rotate, border coloring, etc.)
* FTR: Multi-level undo/redo
* BUG: Pulling the entire image collection is a bad idea...track what has been pulled and pull in what is missing and necessary (closed to the photo-wheel date)
* FTR: Multi-select then align-top|bottom|left|right
* FTR: Group multiple items and "frame" them with a border (fuse them into a single cell)
* FTR: Build a dynamic toolbar based on last commands search for to facilitate learning

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

## References

* [svelte cheet sheet](https://sveltesociety.dev/cheatsheet)
