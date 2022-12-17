import { writable } from "svelte/store"

type ToastLevel = "err" | "info";
export const toasts = writable<Array<{ message: string, showUntil: number, level: ToastLevel }>>([]);

export function toast(message: string, duration = 5, level: ToastLevel = "info") {
    toasts.update((t) => t.filter((t) => t.showUntil > Date.now()))

    const showUntil = Date.now() + 1000 * duration;
    toasts.update(v => [{ message, showUntil, level }, ...v]);
    setTimeout(() => toasts.update((t) => t.filter((t) => t.showUntil > Date.now())), 1000 * duration + 200)
}

export const svgClipPaths = writable<Array<{ id: string, body: string }>>([])

// read data from localstorage
const getLocalStorage = (key: string) => {
    const data = localStorage.getItem(`svelte_lab.${key}`)
    if (data) {
        return JSON.parse(data)
    }
    return null
}

// write data to localstorage
const setLocalStorage = (key: string, data: any) => {
    localStorage.setItem(`svelte_lab.${key}`, JSON.stringify(data));
}

// prompt user for value
const promptUser = (message: string) => {
    return prompt(message)
}

// get the photo url or prompt user for it
const getPhotoUrl = () => {
    const photoUrl = getLocalStorage('photoServerUrl')
    if (photoUrl) {
        return photoUrl
    }
    const newPhotoUrl = promptUser('Please enter your photo url')
    newPhotoUrl && setLocalStorage('photoServerUrl', newPhotoUrl)
    return newPhotoUrl
}

export { setLocalStorage, getLocalStorage, getPhotoUrl }