import { log } from "@/lib/globals";
import { writable } from "svelte/store"
import type { CollageData } from "../d.ts/index";
import { getAllCollages, getCollage } from "../data/collageServices"
import { injectPath } from "./svg";
export const stories = writable<Array<CollageData>>([]);

export async function loadAllStories() {
    const additionalStories = await getAllCollages();
    // load each collage
    additionalStories.forEach(async (s) => {
        const collage = await getCollage(s);
        // restore clip-paths
        if (collage.clipPaths) {
            Object.entries(collage.clipPaths).forEach(([key, value]) => {
                log(`injecting clip-path ${key}`)
                injectPath(key, value);
            });
        }
        stories.update(v => [...v, collage]);
    });
    return stories;
}


