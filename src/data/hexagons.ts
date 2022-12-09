type ImagePosition = {
    target: string
    href: string
    x: number
    y: number
    width: number
    height: number
}

const hexagons =
{
    "id": "phase-1", "positions": []
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


export { hexagons, polygonPath, polygonToPath, translatePath, sleep, type ImagePosition }