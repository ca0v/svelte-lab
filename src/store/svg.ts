import { writable } from "svelte/store"

export const svgClipPaths = writable<Array<{ id: string, body: string }>>([])

export function injectRect(id: string, x: number, y: number, width: number, height: number) {
    const d = `M${x},${y}h${width}v${height}h-${width}z`
    const body = `<path d="${d}"/>`
    svgClipPaths.update(p => [...p.filter(p => p.id != id), { id, body }]);
    return id;
}

export function injectPath(id: string, d: string) {
    const body = `<path d="${d}"/>`
    svgClipPaths.update(p => [...p, { id, body }]);
    return id;
}
