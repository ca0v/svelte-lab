import { svgClipPaths } from "../lib/globals"
import { polygonPath, polygonToPath, translatePath } from "../lib/paths"
import { getAllCollages, saveCollage } from "./collageServices"

export type Photo = {
    id: string
    filename: string
    url: string
    created: string
    width: number
    height: number
}

export type CollageCellState = {
    id: string
    target: string
    x: number
    y: number
    width: number
    height: number
    transform: string
    clipPath: string
    background?: {
        fill?: string;
        stroke?: string;
    }
}

export type CollageState = {
    id: string
    title?: string
    note?: string
    data: Array<CollageCellState>
}

function range(size: number) {
    return new Array(size).fill(0).map((_, i) => i);
}

/*
    Inject clip paths into the global SVG clip path registry
    I like generating close to where I am using it
    ...seems unfinished though, maybe injectRect(name,x,y,width,height), etc.
    or maybe just put it back in ClipPaths.svelte
 */
injectRect("box", -25, -25, 50, 50)
injectPath("0", polygonToPath(polygonPath(6, 21, 0)))
injectPath("poly5_0", polygonToPath(polygonPath(5, 51, 0)))
injectPath("poly5_36", polygonToPath(polygonPath(5, 36, 52)))
injectPath("poly5_36_1", polygonToPath(polygonPath(5, 36, 52 + 36 + 0)))
injectPath("30", polygonToPath(polygonPath(6, 21, 30)))
injectPath("2", polygonToPath(translatePath(polygonPath(6, 64, 30), 64, 64)))
injectRect("7x5", -35, -25, 70, 50)

const transforms: Record<string, Array<{
    i: number,
    style: string,
    clipPath?: string,
    bbox?: {
        x: number, y: number, width: number, height: number
    }
}>> = {
    "flower-6": [
        { "i": 0, "style": "", clipPath: "poly5_36" },
        ...[1, 2, 3, 4, 5].map((i) => ({
            "i": i,
            "style": `rotate(${16 + i * 72}deg) translate(${65}px, 0) rotate(${-16 + -i * 72}deg)`,
            clipPath: "poly5_36_1"
        }))],
    "spiral-19": [
        { "i": 0, "style": "", clipPath: "30" },
        ...range(6).map(i => ({ "i": i + 1, "style": `rotate(${60 * i}deg) translate(40px, 0) rotate(-${60 * i}deg)`, clipPath: "30" })),
        ...range(6).map(i => ({ "i": i + 7, "style": `rotate(${60 * i}deg) translate(80px, 0) rotate(-${60 * i}deg)`, clipPath: "30" })),
        ...range(6).map(i => ({ "i": i + 13, "style": `rotate(${30 + 60 * i}deg) translate(69.5px, 0) rotate(-${30 + 60 * i}deg)`, clipPath: "30" })),
    ],
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

const templates: Array<CollageState> = [{
    id: "7x5-3",
    title: "7x5-3",
    data: transforms["7x5-3"].map((t) => {
        return {
            target: `i${t.i}`,
            id: `AIk5ERFrV7YxvPBqVg3prtWxO1iGmqxFd0or1PI65r6t69FZGQWHC2Z0so4NT0XQhaOJnOKu3ihhEtEMR4wRt_Frw0ookSwA9g`,
            x: t.bbox.x,
            y: t.bbox.y,
            width: t.bbox.width,
            height: t.bbox.height,
            transform: t.style,
            clipPath: t.clipPath,
        }
    })
},
{
    id: "square-16",
    title: "square-16",
    data: transforms["square-16"].map((t) => {
        return {
            target: `i${t.i}`,
            id: `AIk5ERHkVze4l_coT8puVELK7N6oo1IL2Ejp3VSbhZfpYHgMS-AJcs8MFO4w1b1zhu-vQnY_JbVRMQXdmDmJHP0qKcsrqKagMw`,
            x: t.bbox.x,
            y: t.bbox.y,
            width: t.bbox.width,
            height: t.bbox.height,
            transform: t.style,
            clipPath: t.clipPath,
        }
    })
},
{
    id: "spiral-19",
    title: "spiral-19",
    data: transforms["spiral-19"].map((t) => {
        return {
            target: `i${t.i}`,
            id: `AIk5ERHkVze4l_coT8puVELK7N6oo1IL2Ejp3VSbhZfpYHgMS-AJcs8MFO4w1b1zhu-vQnY_JbVRMQXdmDmJHP0qKcsrqKagMw`,
            x: -50,
            y: -50,
            width: 100,
            height: 100,
            transform: t.style,
            clipPath: t.clipPath,
        }
    })
},
{
    id: "flower-6",
    title: "flower-6",
    data: transforms["flower-6"].map((t) => {
        return {
            target: `i${t.i}`,
            id: `AIk5ERHkVze4l_coT8puVELK7N6oo1IL2Ejp3VSbhZfpYHgMS-AJcs8MFO4w1b1zhu-vQnY_JbVRMQXdmDmJHP0qKcsrqKagMw`,
            x: -140,
            y: -140,
            width: 280,
            height: 280,
            transform: t.style,
            clipPath: t.clipPath,
        }
    })
},
]

const collages: Array<CollageState> = []

function injectRect(id: string, x: number, y: number, width: number, height: number) {
    const body = `<rect x="${x}" y="${y}" width="${width}" height="${height}"/>`
    svgClipPaths.update(p => [...p, { id, body }]);
    return id;
}

function injectPath(id: string, d: string) {
    const body = `<path d="${d}"/>`
    svgClipPaths.update(p => [...p, { id, body }]);
    return id;
}

const dummy = document.createElement("div")
document.body.appendChild(dummy)

function getEffectiveTransform(data: CollageCellState) {
    dummy.style.transform = data.transform
    const { transform } = getComputedStyle(dummy)
    return transform === "none" ? "" : transform
}

const stories = await getAllCollages();

await Promise.all(collages.filter(c => !stories.find(s => s.id === c.id)).map(async collage => {
    return saveCollage(collage)
}))


const both = [...templates.sort((a, b) => a.id.localeCompare(b.id)), ...stories.sort((a, b) => a.id.localeCompare(b.id))]

export { transforms, both as collages, getEffectiveTransform }

