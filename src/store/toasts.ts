import { writable } from "svelte/store"

type ToastLevel = "err" | "info";
export const toasts = writable<Array<{ message: string, showUntil: number, level: ToastLevel }>>([]);

export function toss(message: string) {
    toast(message, 1, "err")
    return message
}

export function toast(message: string, duration = 1, level: ToastLevel = "info") {
    toasts.update((t) => t.filter((t) => t.showUntil > Date.now()))

    const showUntil = Date.now() + 1000 * duration;
    toasts.update(v => [{ message, showUntil, level }, ...v]);
    setTimeout(() => toasts.update((t) => t.filter((t) => t.showUntil > Date.now())), 1000 * duration + 200)
}

export function reportExceptions<T>(f: (a?: T) => void | Promise<void>) {
    return async (a?: T) => {
        try {
            await f(a)
        } catch (e: any) {
            console.error(e)
            toast(e?.message || JSON.stringify(e), 5, "err")
        }
    }
}

