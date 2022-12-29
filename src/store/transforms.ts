import { writable } from "svelte/store"
import type { CollageTemplate } from "../d.ts";
import { log, range } from "../lib/globals";
import { polygonPath, polygonToPath, translatePath } from "../lib/paths";
import { injectPath, injectRect } from "./svg";

export const collageTemplates = writable<Record<string, CollageTemplate>>({});

function gridMaker2(cols: number, rows: number, width: number, height: number, clipPath: string, gap: { x: number, y: number }) {
    return gridMaker(cols, rows, width, height, injectRect(clipPath, -Math.floor(width / 2), -Math.floor(height / 2), width, height), gap)
}

function gridMaker(cols: number, rows: number, width: number, height: number, clipPath: string, gap: { x: number, y: number }) {
    return range(rows).map(row => {
        const x = -Math.ceil(width / 2)
        const y = -Math.ceil(height / 2)
        const bbox = { x, y, width, height }
        bbox.x += gap.x / 2
        bbox.y += gap.y / 2
        bbox.width -= gap.x
        bbox.height -= gap.y
        return range(cols).map(col => {
            const dx = Math.round(col * (width + gap.x) - 100 - x);
            const dy = Math.round(row * (height + gap.y) - 100 - y);
            return {
                "i": col + row * cols,
                bbox,
                "style": `translate(${dx}px, ${dy}px)`,
                clipPath,
            }
        })
    }).flat()
}

const FLOWER_DY = (r = 36, sides = 5) => r * Math.cos(Math.PI / sides) * 2

const transforms: Record<string, CollageTemplate> = {
    "flower-6": [
        { "i": 0, "style": "translate(0,0)", clipPath: "poly5_36" },
        ...[1, 2, 3, 4, 5].map((i) => ({
            "i": i,
            "style": `rotate(${i * 72}deg) translate(${0}px, ${FLOWER_DY(36, 5)}px) rotate(-${i * 72}deg) `,
            clipPath: "poly5_36_1"
        }))],
    "spiral-19": [
        { "i": 0, "style": "", clipPath: "30" },
        ...range(6).map(i => ({ "i": i + 1, "style": `rotate(${60 * i}deg) translate(40px, 0) rotate(-${60 * i}deg)`, clipPath: "30" })),
        ...range(6).map(i => ({ "i": i + 7, "style": `rotate(${60 * i}deg) translate(80px, 0) rotate(-${60 * i}deg)`, clipPath: "30" })),
        ...range(6).map(i => ({ "i": i + 13, "style": `rotate(${30 + 60 * i}deg) translate(69.5px, 0) rotate(-${30 + 60 * i}deg)`, clipPath: "30" })),
    ],
    "grid-3x3": gridMaker2(3, 3, 65, 65, "grid-3x3", { x: 1, y: 1 }),
    "grid-6x6": gridMaker2(6, 6, 30, 30, "grid-6x6", { x: 3, y: 3 }),
    "grid-4x5": gridMaker2(4, 5, 49, 39, "grid-4x5", { x: 1, y: 1 }),
    "square-16": gridMaker2(4, 4, 50, 50, "square-16", { x: 1, y: 1 }),
    "7x5-9": gridMaker2(3, 4, 70, 50, "7x5-9", { x: -5, y: -5 }),
    "7x5-3": range(3).map(i => ({
        "i": i,
        "style": `translate(${-50 + i * 35}px, ${-50 + i * 55}px)`,
        clipPath: injectRect("box_7x5", -35, -25, 70, 50),
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
    injectPath("box", polygonToPath(polygonPath(4, 50, 45)))
    injectPath("0", polygonToPath(polygonPath(6, 21, 0)))
    injectPath("poly5_0", polygonToPath(polygonPath(5, 51, 0)))
    injectPath("poly5_36", polygonToPath(polygonPath(5, 36, 18 * 3)))
    injectPath("poly5_36_1", polygonToPath(polygonPath(5, 36, 18 * 5)))
    injectPath("30", polygonToPath(polygonPath(6, 21, 30)))
    injectPath("2", polygonToPath(translatePath(polygonPath(6, 64, 30), 64, 64)))
    collageTemplates.update(t => ({ ...t, ...transforms }))

    injectCss(`hexagon_spiral_init`, () => createInitialCss(`hexagon_spiral`, 0.1, 36))
    injectCss(`hexagon_spiral_transitions`, () => createCssTransforms(`hexagon_spiral`, 36))

}

initialize()