import { writable } from "svelte/store"

type ToastLevel = "err" | "info";
export const toasts = writable<Array<{ message: string, showUntil: number, level: ToastLevel }>>([]);

export function toast(message: string, duration = 5, level: ToastLevel = "info") {
    toasts.update((t) => t.filter((t) => t.showUntil > Date.now()))

    const showUntil = Date.now() + 1000 * duration;
    toasts.update(v => [{ message, showUntil, level }, ...v]);
    setTimeout(() => toasts.update((t) => t.filter((t) => t.showUntil > Date.now())), 1000 * duration + 200)
}

export function reportExceptions<T>(f: (a: T) => void) {
    return (a: T) => {
        try {
            f(a)
        } catch (e) {
            console.error(e)
            toast(e.message, 5, "err")
        }
    }
}

