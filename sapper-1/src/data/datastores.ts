import { writable } from "svelte/store";
export const likes = writable(0);
export const like = (segment: string) => likes.update((v) => v + 1);
export const dislike = (segment: string) => likes.update((v) => v - 1);
