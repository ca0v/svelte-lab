import { writable } from "svelte/store"
import type { CollageData } from "../d.ts/index";
import { getAllCollages, getCollage } from "../data/collageServices"
export const stories = writable<Array<CollageData>>([]);

export async function loadAllStories() {
    const additionalStories = await getAllCollages();
    // load each collage
    additionalStories.forEach(async (s) => {
        const collage = await getCollage(s);
        stories.update(v => [...v, collage]);
    });
    return stories;
}


