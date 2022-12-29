import { writable } from "svelte/store"

export const svgClipPaths = writable<Array<{ id: string, body: string }>>([])

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
    const bbox = svg.getBBox()

    async function injectImage(img: SVGImageElement) {
        const x = parseInt(img.getAttribute("x") || "0")
        const y = parseInt(img.getAttribute("y") || "0")

        return new Promise<void>((resolve) => {
            // get the position if img relative to the svg container
            const imgRect = img.getBoundingClientRect()

            // get all the transforms applied to the image between the svg container and the image
            const transforms: Array<string> = []

            let current = img as SVGElement
            while (current !== svg) {
                const transform = getComputedStyle(current).transform;
                if (transform && transform != "none") transforms.unshift(transform)
                current = current.parentNode as SVGElement
            }
            console.log(transforms)

            image.style.transform = transforms.join(" ")
            let transform = getComputedStyle(image).transform
            if (transform == "none") transform = ""

            image.onload = function () {
                const clipPathId = getClipPathId(img)
                const clipPath = clipPathId && getClipPath(clipPathId)?.querySelector("path")?.getAttribute("d")!

                // the svg image scales the image to fit...so if the image is 3x wider than the
                // svg container, we need to scale the image down by 3x
                const scale = Math.max(imgRect.width / image.width, imgRect.height / image.height)
                let matrix1 = new DOMMatrix(`translate(${-bbox.x}px,${-bbox.y}px) ${transform} translate(${0}px,${0}px)`)
                let matrix2 = new DOMMatrix(`translate(${x}px,${y}px) ${transform} scale(${scale})`)

                const path = clipPath && new Path2D(clipPath)
                ctx.save();
                ctx.beginPath();
                ctx.setTransform(matrix1)
                path && ctx.clip(path);
                path && ctx.fill(path);
                ctx.setTransform(matrix2)
                console.log({ x, y })
                ctx.drawImage(image, 0, 0)
                ctx.restore();
                resolve()
            }
            image.src = img.href.baseVal
        });
    }

    // has clippath, href, x, y, width, height and is within a series of transforms
    const images = svg.querySelectorAll("image");
    for (let i = 0; i < images.length; i++) {
        await injectImage(images[i] as SVGImageElement)
    }
}

