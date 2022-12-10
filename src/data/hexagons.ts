type ImagePosition = {
    target: string
    href: string
    x: number
    y: number
    width: number
    height: number
}

const hexagons =
    [{ "id": "phase-1", "positions": [{ "href": "http://localhost:5000/Photo/get?id=PXL_20220629_140431696.jpg", "target": "i0", "x": -38, "y": -39, "width": 82, "height": 82 }, { "href": "http://localhost:5000/Photo/get?id=PXL_20220628_190953569.jpg", "target": "i1", "x": -25, "y": -25, "width": 50, "height": 50 }, { "href": "http://localhost:5000/Photo/get?id=PXL_20220628_022815898.jpg", "target": "i2", "x": -84, "y": -57, "width": 122, "height": 122 }, { "href": "http://localhost:5000/Photo/get?id=PXL_20220628_022815898.jpg", "target": "i3", "x": -45, "y": -59, "width": 122, "height": 122 }, { "href": "http://localhost:5000/Photo/get?id=PXL_20220626_201607540.jpg", "target": "i4", "x": -55, "y": -75, "width": 120, "height": 120 }, { "href": "http://localhost:5000/Photo/get?id=DSC_7331.JPG", "target": "i5", "x": -25, "y": -25, "width": 50, "height": 50 }, { "href": "http://localhost:5000/Photo/get?id=PXL_20220626_193024587.jpg", "target": "i6", "x": -25, "y": -25, "width": 50, "height": 50 }, { "href": "http://localhost:5000/Photo/get?id=PXL_20220626_011400211.jpg", "target": "i7", "x": -32, "y": -24, "width": 50, "height": 50 }, { "href": "http://localhost:5000/Photo/get?id=PXL_20220626_160809779.jpg", "target": "i8", "x": -48, "y": -36, "width": 78, "height": 78 }, { "href": "http://localhost:5000/Photo/get?id=PXL_20220627_201908273.jpg", "target": "i9", "x": -48, "y": -55, "width": 76, "height": 76 }, { "href": "http://localhost:5000/Photo/get?id=DSC_7369.JPG", "target": "i10", "x": -46, "y": -35, "width": 98, "height": 98 }, { "href": "http://localhost:5000/Photo/get?id=DSC_7365.JPG", "target": "i11", "x": -50, "y": -56, "width": 140, "height": 140 }, { "href": "http://localhost:5000/Photo/get?id=DSC_7365.JPG", "target": "i12", "x": -77, "y": -52, "width": 126, "height": 126 }, { "href": "http://localhost:5000/Photo/get?id=DSC_7313.JPG", "target": "i13", "x": -32, "y": -36, "width": 68, "height": 68 }, { "href": "http://localhost:5000/Photo/get?id=PXL_20220624_151818573.jpg", "target": "i14", "x": -29, "y": -29, "width": 58, "height": 58 }, { "href": "http://localhost:5000/Photo/get?id=PXL_20220627_201908273.jpg", "target": "i15", "x": -31, "y": -21, "width": 76, "height": 76 }, { "href": "http://localhost:5000/Photo/get?id=PXL_20220627_165129391.jpg", "target": "i16", "x": -25, "y": -25, "width": 50, "height": 50 }, { "href": "http://localhost:5000/Photo/get?id=DSC_7367.JPG", "target": "i17", "x": -34, "y": -33, "width": 64, "height": 64 }, { "href": "http://localhost:5000/Photo/get?id=PXL_20220628_231009770.jpg", "target": "i18", "x": -37, "y": -54, "width": 120, "height": 120 }] }]


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