import { writable } from "svelte/store"
import type { CollageData } from "../data/Api";
import { getAllCollages } from "../data/collageServices"
export const stories = writable<Array<CollageData>>([]);

export const additionalStories = await getAllCollages();
additionalStories && stories.update(v => [...v, ...additionalStories]);

