import { writable } from "svelte/store"
import type { CollageTemplate } from "../d.ts";
import { log, range } from "../lib/globals";
import { polygonPath, polygonToPath, translatePath } from "../lib/paths";
import { injectPath, injectRect } from "./svg";

export const collageTemplates = writable<Record<string, CollageTemplate>>({});

function gridMaker2(cols: number, rows: number, width: number, height: number, clipPath: string, gap: number = 0) {
    return gridMaker(cols, rows, width, height, injectRect(clipPath, -Math.floor(width / 2), -Math.floor(height / 2), width, height), gap)
}

function gridMaker(cols: number, rows: number, width: number, height: number, clipPath: string, gap: number = 0) {
    return range(rows).map(row => {
        const x = -Math.ceil(width / 2)
        const y = -Math.ceil(height / 2)
        const bbox = { x, y, width, height }
        return range(cols).map(col => {
            const dx = Math.round(col * width + gap * col - 100 - x);
            const dy = Math.round(row * height + gap * row - 100 - y);
            return {
                "i": col + row * cols,
                bbox,
                "style": `translate(${dx}px, ${dy}px)`,
                clipPath,
            }
        })
    }).flat()
}

const transforms: Record<string, CollageTemplate> = {
    "flower-6": [
        { "i": 0, "style": "translate(0,0)", clipPath: "poly5_36" },
        ...[1, 2, 3, 4, 5].map((i) => ({
            "i": i,
            "style": `rotate(${i * 72}deg) translate(${0}px, ${59}px) rotate(-${i * 72}deg) `,
            clipPath: "poly5_36_1"
        }))],
    "spiral-19": [
        { "i": 0, "style": "", clipPath: "30" },
        ...range(6).map(i => ({ "i": i + 1, "style": `rotate(${60 * i}deg) translate(40px, 0) rotate(-${60 * i}deg)`, clipPath: "30" })),
        ...range(6).map(i => ({ "i": i + 7, "style": `rotate(${60 * i}deg) translate(80px, 0) rotate(-${60 * i}deg)`, clipPath: "30" })),
        ...range(6).map(i => ({ "i": i + 13, "style": `rotate(${30 + 60 * i}deg) translate(69.5px, 0) rotate(-${30 + 60 * i}deg)`, clipPath: "30" })),
    ],
    "grid-3x3": gridMaker(3, 3, 65, 65, injectRect("grid-3x3", -33, -33, 65, 65), 1),
    "grid-6x6": gridMaker(6, 6, 30, 30, "grid-6x6", 3),
    "grid-4x5": gridMaker2(4, 5, 49, 39, "grid-4x5", 1),
    "square-16": range(4).map(row =>
        range(4).map(col => ({
            "i": col + row * 4,
            "style": `translate(${-74 + col * 49}px, ${-74 + row * 49}px)`,
            clipPath: "box", bbox: { x: -40, y: -40, width: 80, height: 80 }
        }))
    ).flat(),
    "7x5-3": range(3).map(i => ({
        "i": i,
        "style": `translate(${-50 + i * 35}px, ${-50 + i * 55}px)`,
        clipPath: "7x5",
        bbox: { x: -35, y: -25, width: 70, height: 50 }
    }))

}

function createCssTransforms(scope: string, size = 20) {
    return Array(size)
        .fill(0)
        .map((_, i) => {
            const t = `translate(${size / 2 - i}em,-12vh)`
            return `transform: ${t} !important;opacity(0);`
        })
        .map((t, i) => `.${scope}.play .i${i} { ${t} }`)
        .join("\n")
}

function createInitialCss(scope: string, duration = 0, size = 20) {
    return Array(size)
        .fill(0)
        .map((_, i) => {
            return `transition-delay: ${i * duration}ms; transition-duration: ${(5 + i) * duration
                }s; opacity:1;`
        })
        .map((t, i) => `.${scope} .i${i} { ${t} }`)
        .join("\n")
}

// inject css into style tag
export function injectCss(id: string, generator: () => string) {
    let style = document.querySelector(`#${id}`)
    if (style) {
        log("removing existing style")
        style.remove()
        style = null
    }
    if (!style) {
        style = document.createElement("style")
        style.id = id
        document.head.appendChild(style)
    }
    style.innerHTML = generator()
}


function initialize() {
    injectPath("grid-6x6", polygonToPath(polygonPath(4, 30, 45)))
    injectPath("box", polygonToPath(polygonPath(4, 50, 45)))
    injectPath("0", polygonToPath(polygonPath(6, 21, 0)))
    injectPath("poly5_0", polygonToPath(polygonPath(5, 51, 0)))
    injectPath("poly5_36", polygonToPath(polygonPath(5, 36, 18 * 3)))
    injectPath("poly5_36_1", polygonToPath(polygonPath(5, 36, 18 * 5)))
    injectPath("30", polygonToPath(polygonPath(6, 21, 30)))
    injectPath("2", polygonToPath(translatePath(polygonPath(6, 64, 30), 64, 64)))
    injectRect("box_7x5", -35, -25, 70, 50)
    collageTemplates.update(t => ({ ...t, ...transforms }))

    injectCss(`hexagon_spiral_init`, () => createInitialCss(`hexagon_spiral`, 0.1, 36))
    injectCss(`hexagon_spiral_transitions`, () => createCssTransforms(`hexagon_spiral`, 36))

}

initialize()