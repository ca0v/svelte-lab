import { proxy } from "@/data/collageServices";
import { log } from "@/lib/globals";
import { writable } from "svelte/store"

export const svgClipPaths = writable<Array<{ id: string, body: string }>>([])

class SvgHelper {
    static svgToImageData(svg: SVGSVGElement) {
        // does not work with images?
        const svgString = new XMLSerializer().serializeToString(svg)
        const svg64 = btoa(svgString)
        const b64Start = 'data:image/svg+xml;base64,'
        const image64 = b64Start + svg64
        const img = new Image()
        img.src = image64
        const canvas = document.createElement("canvas")
        document.body.appendChild(canvas)
        canvas.width = svg.width.baseVal.value
        canvas.height = svg.height.baseVal.value
        const ctx = canvas.getContext("2d") as CanvasRenderingContext2D
        ctx.drawImage(img, 0, 0)
        // create a image url
        return canvas.toDataURL("image/png")
    }

    static getImageScale(svgImage: SVGImageElement, image: HTMLImageElement) {
        const { width: w1, height: h1 } = svgImage.getBBox()
        const { naturalWidth: w2, naturalHeight: h2 } = image
        return Math.min(w1 / w2, h1 / h2)
    }

    static computePadding(svgImage: SVGImageElement, image: HTMLImageElement) {
        const { width: w1, height: h1 } = svgImage.getBBox()
        const { naturalWidth: w2, naturalHeight: h2 } = image
        const sx = w1 / w2
        const sy = h1 / h2
        const scale = Math.min(sx, sy)
        console.log({ w1, h1, w2, h2, sx, sy, scale })
        return [(1 - w2 / w1 * scale), (1 - h2 / h1 * scale)]
    }

    static getCanvasScale(svg: SVGSVGElement, canvas: HTMLCanvasElement) {
        const { width, height } = svg.viewBox.baseVal
        return Math.min(canvas.width / width, canvas.height / height)
    }

    static getSvgImageScale(svg: SVGSVGElement, image: SVGImageElement) {
        const { width, height } = svg.viewBox.baseVal
        const { width: imageWidth, height: imageHeight } = image.getBBox()
        return Math.min(imageWidth / width, imageHeight / height)
    }

    static transform(node: HTMLElement | SVGElement, transform: string) {
        let current = getComputedStyle(node).transform
        if (current == "none") {
            current = ""
        }
        node.style.transform = `${transform} ${current}`
    }

    static translate(x: number, y: number) {
        return `translate(${x}px,${y}px)`
    }

    static rotate(degrees: number) {
        return `rotate(${degrees}deg)`
    }

    static scale(scale: number) {
        return `scale(${scale})`
    }

    static rotateAboutCenter(target: SVGElement, degrees: number) {
        // get the transformation offset from center
        const t = getComputedStyle(target).transform
        let m = new DOMMatrix(t)
        const t1 = SvgHelper.translate(-m.e, -m.f);
        const r = SvgHelper.rotate(degrees)
        const t2 = SvgHelper.translate(m.e, m.f)
        SvgHelper.transform(target, `${t2} ${r} ${t1}`)
    }

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

export async function svgToCanvas(svg: SVGSVGElement, canvas: HTMLCanvasElement) {
    const image = document.getElementById("image") as HTMLImageElement
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D

    const svgToCanvasScale = SvgHelper.getCanvasScale(svg, canvas)

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

            image.onload = function () {
                const clipPathId = getClipPathId(svgImage)
                const clipPath = clipPathId && getClipPath(clipPathId)?.querySelector("path")?.getAttribute("d")!

                if (image) {
                    // 1st center image on (0,0)
                    let transform = ""
                    transform = SvgHelper.translate(-image.naturalWidth / 2, -image.naturalHeight / 2) + transform

                    // 2nd scale the image to the svgImage
                    transform = SvgHelper.scale(SvgHelper.getImageScale(svgImage, image)) + transform

                    // move to svgImage center
                    transform = SvgHelper.translate(svgImageBox.x + svgImageBox.width / 2, svgImageBox.y + svgImageBox.height / 2) + transform

                    // apply everything that happened to the svgImage
                    transform = transforms.join(" ") + transform

                    // scale to canvas
                    transform = SvgHelper.scale(svgToCanvasScale) + transform

                    // move to center of canvas
                    transform = SvgHelper.translate(canvas.width / 2, canvas.height / 2) + transform

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
    const images = svg.querySelectorAll("image");
    for (let i = 0; i < images.length; i++) {
        await injectImage(images[i] as SVGImageElement)
    }
}

export function canvasToClipboard(canvas: HTMLCanvasElement) {
    console.log(canvas.toDataURL('image/png'))
    return new Promise<void>((resolve, reject) => {
        // copy the canvas to the clipboard
        canvas.toBlob(blob => {
            try {
                if (!blob) throw "no blob";
                navigator.clipboard.write([
                    new ClipboardItem({ "image/png": blob })])
                resolve();
            } catch (e) {
                reject(e);
            }
        })
    });
}

