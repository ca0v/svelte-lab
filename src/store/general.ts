// Welcome to the General Store where we have all your writables
import { writable } from "svelte/store"

export const authenticatedWithGoogle = writable(false)
export const authorizedWithGooglePhotos = writable(false)
