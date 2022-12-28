import { log } from "@/lib/globals";
import { getAllCollages, getCollage } from "../data/collageServices"
import { injectPath } from "./svg";

export async function loadAllStories() {
    const additionalStories = await getAllCollages();
    // load each collage
    return Promise.all(additionalStories.map(async (s) => {
        const collage = await getCollage(s);
        // restore clip-paths
        if (collage.clipPaths) {
            Object.entries(collage.clipPaths).forEach(([key, value]) => {
                log(`injecting clip-path ${key}`)
                injectPath(key, value);
            });
        } else {
            log(`no clip-paths found for ${collage.id}: ${collage.title}`)
        }
        return collage;
    }));
}


