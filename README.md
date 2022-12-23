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

* BUG: errors are silent...e.g. run without services running...no warnings
* DGN: drag-drop should be handled by CollageView not SvgImage
* FTR: Can crop and round corners using clip-path: inset() on the svg image (<https://developer.mozilla.org/en-US/docs/Web/CSS/inset>)
* FTR: need to be able to bring-to-front and send-to-back
* DGN: Remove the PhotoWheel from the CollageView, create a higher-level composite control
* BUG: "ENTER" moves photo to top but does not persist the ordering
* BUG: "Preview" is not rendering any collages
* LRN: Make use of 'use', '#key', '#await', 'click|once|preventDefault', named &lt;slot&gt;, &lt;svelte:fragment&gt;, $$slots, svelte:self
* DGN: Instead of storing the 'known' image list in local storage, save it to the collage server in photos
* DGN: Often exceeding per-minute quota...how to cache better?
* BUG: "Enter" not executing from command search
* BUG: Hamburger in 'highlight' mode looks disabled
* BUG: Pressing "Enter" does not toggle the command menu (collage or search input focused)
* BUG: Stories are not loading pics until interaction
* BUG: Updating a note is causing a complete screen update (too fast to notice, but try to fix)
* BUG: Heavily zoomed images should increase the resolution using google photos API (presently using default 512?)
* BUG: Warn if changes were made and not saved..auto save?
* BUG: No way to clone from one cell into another using kbd (shift-drag)
* BUG: The drag-template is out-of-position (just rotated my screen)
* BUG: "Enter" was a bad choice for open/close menu..."Esc" maybe?
* FTR: Hide commands that do not match filter
* FTR: Need to be able to adjust width/height independently (change top (ctrl+up), bottom, left, right)
* ^^^: But 1st, consolidate remaining commands that are presently baked into the CollageView
* BUG: Set-Cookie has to be set with SameSite=None (session=7de662eb-dca4-434c-95a3-7ec7b21b2e96; Expires=Fri, 23 Dec 2022 01:01:51 GMT; HttpOnly; Path=/), my dev site is http.

## Authentication and Authorization

I store the CLIENT_ID and API_KEY on the server, but the client needs them to for authentication and to access Photos.

The `CLIENT_ID` is used to authenticate the user.

The `API_KEY` is used to obtain an access token to the Google Photos service.

Once authenticated, the user identity is validated on the `stories/collage` server and the `API_KEY` is returned.

Once the client has the `API_KEY` the user provides consent to access their photos.

Identifying the user on the server was a necessary step to ensure no users share storage.  Although this app is intended for me alone, it is going to be on a public IP address and I don't want to lose my work.

## References

* [svelte cheet sheet](https://sveltesociety.dev/cheatsheet)
