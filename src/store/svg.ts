import { proxy } from "@/data/collageServices";
import { log } from "@/lib/globals";
import { writable } from "svelte/store"
import { toss } from "./toasts";

export const svgClipPaths = writable<Array<{ id: string, body: string }>>([])

function getScaleToFitSvgImage(svgImage: SVGImageElement, image: HTMLImageElement) {
    const { width: w1, height: h1 } = svgImage.getBBox()
    const { naturalWidth: w2, naturalHeight: h2 } = image
    return Math.min(w1 / w2, h1 / h2)
}

function getScaleToFitCanvas(svg: SVGSVGElement, canvas: HTMLCanvasElement) {
    const { width, height } = svg.viewBox.baseVal
    return Math.min(canvas.width / width, canvas.height / height)
}

function translate(x: number, y: number) {
    return `translate(${x}px,${y}px)`
}

function scale(scale: number) {
    return `scale(${scale})`
}

export function injectRect(id: string, x: number, y: number, width: number, height: number) {
    const left = x;
    const top = y;
    const right = x + width;
    const bottom = y + height;
    const d = `M${left},${top}L${right},${top}L${right},${bottom}L${left},${bottom}L${left},${top}z`
    const body = `<path d="${d}"/>`
    svgClipPaths.update(p => [...p.filter(p => p.id != id), { id, body }]);
    return id;
}

export function injectPath(id: string, d: string) {
    const body = `<path d="${d}"/>`
    svgClipPaths.update(p => [...p, { id, body }]);
    return id;
}

function getClipPath(id: string) {
    return document.getElementById(id) as SVGClipPathElement | null
}

function getClipPathId(image: SVGImageElement) {
    const clipPath = image.getAttribute("clip-path")
    const clipPathId = clipPath?.slice(5, -1)
    return clipPathId
}

/*
    The purpose of this method is to copy images within the svg container into the canvas.
    Getting this working was difficult so here are the discrete steps to achieve a solution:
    1. accumulate the effective transforms applied to the svgImage (svg -> g* -> svgImage)
    2. load the actual image using a <img>
    3. translate image so that it is centered at the origin
    4. scale image so that it will fit within the svgImage
    5. translate image to the center of the svgImage
    6. scale image to the canvas
    7. draw the image onto the canvas at (0, 0)
*/
export async function svgToCanvas(svg: SVGSVGElement, canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D

    const svgToCanvasScale = getScaleToFitCanvas(svg, canvas)

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    async function injectImage(svgImage: SVGImageElement) {
        // get the position of image relative to the svg container
        const svgImageBox = svgImage.getBBox()

        return new Promise<void>((resolve) => {

            // get all the transforms applied to the image between the svg container and the image
            const transforms: Array<string> = []

            let current = svgImage as SVGElement
            while (current !== svg) {
                const transform = getComputedStyle(current).transform;
                if (transform && transform != "none") transforms.unshift(transform)
                current = current.parentNode as SVGElement
            }

            const image = document.createElement("img")
            image.setAttribute("crossorigin", "anonymous")
            image.onload = function () {
                const clipPathId = getClipPathId(svgImage)
                const clipPath = clipPathId && getClipPath(clipPathId)?.querySelector("path")?.getAttribute("d")!

                if (image) {
                    // 1st center image on (0,0)
                    let transform = ""
                    transform = translate(-image.naturalWidth / 2, -image.naturalHeight / 2) + transform

                    // 2nd scale the image to the svgImage
                    transform = scale(getScaleToFitSvgImage(svgImage, image)) + transform

                    // move to svgImage center
                    transform = translate(svgImageBox.x + svgImageBox.width / 2, svgImageBox.y + svgImageBox.height / 2) + transform

                    // apply everything that happened to the svgImage
                    transform = transforms.join(" ") + transform

                    // scale to canvas
                    transform = scale(svgToCanvasScale) + transform

                    // move to center of canvas
                    transform = translate(canvas.width / 2, canvas.height / 2) + transform

                    ctx.save();
                    ctx.beginPath();
                    if (clipPath) {
                        const path = new Path2D(clipPath)
                        let transform = transforms.join(" ")
                        const { x: dx, y: dy, width, height } = svg.viewBox.baseVal
                        const scaleX = canvas.width / width
                        const scaleY = canvas.height / height
                        let matrix1 = new DOMMatrix(`translate(${-dx * scaleX}px,${-dy * scaleY}px) scale(${scaleX},${scaleY}) ${transform}`)
                        ctx.setTransform(matrix1)
                        ctx.clip(path);
                    }
                    ctx.setTransform(new DOMMatrix(transform))
                    ctx.drawImage(image, 0, 0)
                    ctx.restore();
                }
                resolve()
            }
            image.src = proxy(svgImage.href.baseVal)
        });
    }

    // has clippath, href, x, y, width, height and is within a series of transforms
    [...svg.querySelectorAll("image")]
        .filter(image => !!image.href.baseVal)
        .map(image => {
            return injectImage(image as SVGImageElement)
        })
}

export function canvasToClipboard(canvas: HTMLCanvasElement) {
    return new Promise<void>((resolve, reject) => {
        // copy the canvas to the clipboard
        canvas.toBlob(blob => {
            try {
                if (!blob) throw toss("no blob")
                navigator.clipboard.write([
                    new ClipboardItem({ "image/png": blob })])
                resolve();
            } catch (e) {
                reject(e);
            }
        })
    });
}

