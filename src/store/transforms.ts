import { writable } from "svelte/store"
import type { CollageTemplate } from "../d.ts";
import { range } from "../lib/globals";
import { polygonPath, polygonToPath, translatePath } from "../lib/paths";
import { injectPath, injectRect } from "./svg";

export const collageTemplates = writable<Record<string, CollageTemplate>>({});

const transforms: Record<string, CollageTemplate> = {
    "flower-6": [
        { "i": 0, "style": "translate(0,0)", clipPath: "poly5_36" },
        ...[1, 2, 3, 4, 5].map((i) => ({
            "i": i,
            "style": `rotate(${36 + i * 72}deg) translate(${55}px, ${-20}px) rotate(-${36 + i * 72}deg) `,
            clipPath: "poly5_36_1"
        }))],
    "spiral-19": [
        { "i": 0, "style": "", clipPath: "30" },
        ...range(6).map(i => ({ "i": i + 1, "style": `rotate(${60 * i}deg) translate(40px, 0) rotate(-${60 * i}deg)`, clipPath: "30" })),
        ...range(6).map(i => ({ "i": i + 7, "style": `rotate(${60 * i}deg) translate(80px, 0) rotate(-${60 * i}deg)`, clipPath: "30" })),
        ...range(6).map(i => ({ "i": i + 13, "style": `rotate(${30 + 60 * i}deg) translate(69.5px, 0) rotate(-${30 + 60 * i}deg)`, clipPath: "30" })),
    ],
    "grid-4x5": range(5).map(row => {
        const scale = 0.7;
        const width = Math.round(70 * scale);
        const height = Math.round(50 * scale);
        const x = Math.round(-width / 2)
        const y = Math.round(-height / 2)
        const gap = 0.05;
        const bbox = { x, y, width, height }
        return range(4).map(col => {
            const dx = Math.round(-100 + width / 2 + col * width + gap * width);
            const dy = Math.round(-100 + height / 2 + row * height + gap * height);
            return {
                "i": col + row * 4,
                bbox,
                "style": `translate(${dx}px, ${dy}px)`,
                clipPath: "box_7x5",
            }
        })
    }
    ).flat(),
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

function injectCss() {
    injectRect("box", -25, -25, 50, 50)
    injectRect("box_7x5", -35, -25, 70, 50)
    injectPath("0", polygonToPath(polygonPath(6, 21, 0)))
    injectPath("poly5_0", polygonToPath(polygonPath(5, 51, 0)))
    injectPath("poly5_36", polygonToPath(polygonPath(5, 36, 52)))
    injectPath("poly5_36_1", polygonToPath(polygonPath(5, 36, 52 + 36 + 0)))
    injectPath("30", polygonToPath(polygonPath(6, 21, 30)))
    injectPath("2", polygonToPath(translatePath(polygonPath(6, 64, 30), 64, 64)))
    injectRect("7x5", -35, -25, 70, 50)
    collageTemplates.update(t => ({ ...t, ...transforms }))
}

injectCss()