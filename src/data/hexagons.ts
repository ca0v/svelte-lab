type ImagePosition = {
    target: string
    url: string
    x: number
    y: number
    width: number
    height: number
}

const hexagons =
{
    "id": "phase-1", "positions": [{ "target": "center", "url": "http://localhost:5000/Photo/get?id=PXL_20220628_022815898.jpg", "x": -82, "y": -61, "width": 140, "height": 140 }, { "target": "i1", "url": "http://localhost:5000/Photo/get?id=PXL_20220626_011400211.jpg", "x": -25, "y": -25, "width": 50, "height": 50 },
    { "target": "i2", "url": "http://localhost:5000/Photo/get?id=DSC_7365.JPG", "x": -131, "y": -79, "width": 214, "height": 214 },
    { "target": "i3", "url": "http://localhost:5000/Photo/get?id=DSC_7365.JPG", "x": -77, "y": -79, "width": 214, "height": 214 }, { "target": "i4", "url": "http://localhost:5000/Photo/get?id=DSC_7367.JPG", "x": -51, "y": -56, "width": 100, "height": 100 }, { "target": "i5", "url": "http://localhost:5000/Photo/get?id=IMG_1506.HEIC", "x": -29, "y": -92, "width": 150, "height": 150 }, { "target": "i6", "url": "http://localhost:5000/Photo/get?id=PXL_20220629_140431696.jpg", "x": -34, "y": -39, "width": 74, "height": 74 }, { "target": "i7", "url": "http://localhost:5000/Photo/get?id=PXL_20220628_231009770.jpg", "x": -26, "y": -61, "width": 128, "height": 128 }, { "target": "i8", "url": "http://localhost:5000/Photo/get?id=PXL_20220626_160809779.jpg", "x": -39, "y": -28, "width": 60, "height": 60 }, { "target": "i9", "url": "http://localhost:5000/Photo/get?id=DSC_7313.JPG", "x": -28, "y": -31, "width": 64, "height": 64 }, { "target": "i10", "url": "http://localhost:5000/Photo/get?id=PXL_20220626_201607540.jpg", "x": -77, "y": -95, "width": 150, "height": 150 }, { "target": "i11", "url": "http://localhost:5000/Photo/get?id=DSC_7434.JPG", "x": -41, "y": -39, "width": 78, "height": 78 }, { "target": "i12", "url": "http://localhost:5000/Photo/get?id=DSC_7369.JPG", "x": -69, "y": -42, "width": 136, "height": 136 }, { "target": "i13", "url": "http://localhost:5000/Photo/get?id=PXL_20220626_193024587.jpg", "x": -25, "y": -25, "width": 50, "height": 50 }, { "target": "i14", "url": "http://localhost:5000/Photo/get?id=PXL_20220626_160110554.jpg", "x": -92, "y": -89, "width": 184, "height": 184 }, { "target": "i15", "url": "http://localhost:5000/Photo/get?id=PXL_20220624_151818573.jpg", "x": -70, "y": -86, "width": 144, "height": 144 }, { "target": "i16", "url": "http://localhost:5000/Photo/get?id=PXL_20220627_165129391.jpg", "x": -46, "y": -49, "width": 102, "height": 102 }, { "target": "i17", "url": "http://localhost:5000/Photo/get?id=IMG_1493.HEIC", "x": -40, "y": -43, "width": 76, "height": 76 }, { "target": "i18", "url": "http://localhost:5000/Photo/get?id=PXL_20220627_201908273.jpg", "x": -75, "y": -97, "width": 118, "height": 118 }]
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