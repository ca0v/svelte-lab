import { log } from "./globals"

type Direction = { top?: number, left?: number, bottom?: number, right?: number }

type ImagePosition = {
    target: string
    href: string
    x: number
    y: number
    width: number
    height: number
}

// function for producing a polygon path
function polygonPath(
    sides: number,
    radius: number = 0.5,
    rotation: number = 0
) {
    const points: Array<[number, number]> = []

    rotation *= Math.PI / 180
    for (let i = 0; i < sides; i++) {
        const angle = (i / sides) * 2 * Math.PI + rotation
        points.push([radius * Math.cos(angle), radius * Math.sin(angle)])
    }
    return points
}

// translate the path
function translatePath(points: Array<[number, number]>, x: number, y: number) {
    return points.map(([px, py]) => [px + x, py + y] as [number, number])
}

// function to convert a polygon path to an svg path "d"
function polygonToPath(points: Array<[number, number]>) {
    return (
        points
            .map(([x, y], i) => (i === 0 ? `M${x},${y}` : `L${x},${y}`))
            .join(" ") + "Z"
    )
}

async function sleep(delay: number) {
    return new Promise((resolve) => setTimeout(resolve, delay))
}

function cloneClipPath(sourceId: string, cloneId: string) {
    const clipPath = document.getElementById(sourceId)
    if (!clipPath?.parentElement) return;
    if (!(clipPath instanceof SVGClipPathElement)) return;

    if (clipPath.id == cloneId) return clipPath;

    const clone = document.createElementNS("http://www.w3.org/2000/svg", "clipPath")
    clone.innerHTML = clipPath.innerHTML
    clone.id = cloneId
    log(`clone clip path ${sourceId} to ${cloneId}`)
    clipPath.parentElement.appendChild(clone)
    return clone
}

function duplicateImageClipPath(clipPathOwner: SVGImageElement, cloneId: string) {
    if (!clipPathOwner) return;

    const clipPath = clipPathOwner?.getAttribute("clip-path")
    const clipPathId = clipPath?.slice(5, -1)
    if (!clipPathId) return;

    const clone = cloneClipPath(clipPathId, `clip_${cloneId}`)
    if (!clone) return;

    clipPathOwner.setAttribute("clip-path", `url(#${clone.id})`)
    return clone;
}

function* readPoints(path: string) {
    const tokens = path.split("");
    let result = "";
    while (true) {
        const token = tokens.shift();
        if (!token) break;
        // if token is a number, add to result
        if (token.match(/[-0-9\.e]/)) {
            result += token;
        } else {
            if (result) {
                yield Math.round(100 * parseFloat(result)) / 100;
                result = "";
            }
        }
    }
}

function getClipPathPoints(clipPathId: string) {
    const clipPath = document.getElementById(clipPathId)
    const path = clipPath?.querySelector("path")
    const points = path?.getAttribute("d")
    return points;

}

function _getClipPathPoints(clipPathId: string) {
    const clipPath = document.getElementById(clipPathId)
    if (!clipPath) return;

    const path = clipPath.querySelector("path")
    if (!path) return;

    const points = path.getAttribute("d")
    if (!points) return;

    // convert svg path to polygon
    const iterator = readPoints(points);

    const polygon = [] as Array<[number, number]>
    while (true) {
        const x = iterator.next()
        const y = iterator.next()
        if (x.done || y.done) {
            break;
        }

        let x_val = x.value || 0
        let y_val = y.value || 0
        polygon.push([x_val, y_val])
    }
    return polygon;
}


function moveClipPath(clipPath: SVGClipPathElement, direction: Direction) {
    const path = clipPath.querySelector("path")
    if (!path) return;

    const points = path.getAttribute("d")
    if (!points) return;

    // convert svg path to polygon
    const iterator = readPoints(points);
    const { x, y, width, height } = path.getBBox()

    const left = x;
    const top = y;
    const right = x + width
    const bottom = y + height

    const err = 1;

    log({ left, top, right, bottom, err })

    // read all the points
    const polygon = [] as Array<[number, number]>
    while (true) {
        const x = iterator.next()
        const y = iterator.next()
        if (x.done || y.done) {
            break;
        }

        let x_val = x.value || 0
        let y_val = y.value || 0


        if (x_val <= left + err && direction.left) {
            x_val = x_val + direction.left
        }
        else if (x_val >= right - err && direction.right) {
            x_val = x_val + direction.right
        }

        if (y_val <= top + err && direction.top) {
            y_val = y_val + direction.top
        }
        else if (y_val >= bottom - err && direction.bottom) {
            y_val = y_val + direction.bottom
        }
        polygon.push([x_val, y_val])
    }
    const new_path = polygonToPath(polygon)
    path.setAttribute("d", new_path)
}

export { getClipPathPoints, polygonPath, polygonToPath, translatePath, sleep, moveClipPath, duplicateImageClipPath, type ImagePosition, type Direction }