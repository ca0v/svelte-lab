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

## References

* [svelte cheet sheet](https://sveltesociety.dev/cheatsheet)
