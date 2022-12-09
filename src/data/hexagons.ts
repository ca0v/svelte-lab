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

const hexagons =
    { "id": "phase-1", "positions": [{ "target": "center", "url": "http://localhost:5000/Photo/get?id=PXL_20220628_022815898.jpg", "x": -60, "y": -56, "width": 124, "height": 124 }, { "target": "i1", "url": "http://localhost:5000/Photo/get?id=PXL_20220628_231009770.jpg", "x": -25, "y": -25, "width": 50, "height": 50 }, { "target": "i2", "url": "http://localhost:5000/Photo/get?id=PXL_20220629_012743963.jpg", "x": -33, "y": -47, "width": 78, "height": 78 }, { "target": "i3", "url": "http://localhost:5000/Photo/get?id=DSC_7367.JPG", "x": -25, "y": -25, "width": 50, "height": 50 }, { "target": "i4", "url": "http://localhost:5000/Photo/get?id=DSC_7365.JPG", "x": -113, "y": -69, "width": 186, "height": 186 }, { "target": "i5", "url": "http://localhost:5000/Photo/get?id=DSC_7331.JPG", "x": -81, "y": -41, "width": 122, "height": 122 }, { "target": "i6", "url": "http://localhost:5000/Photo/get?id=PXL_20220628_190953569.jpg", "x": -25, "y": -25, "width": 50, "height": 50 }, { "target": "i7", "url": "http://localhost:5000/Photo/get?id=PXL_20220626_011400211.jpg", "x": -25, "y": -25, "width": 50, "height": 50 }, { "target": "i8", "url": "http://localhost:5000/Photo/get?id=PXL_20220630_160124614.jpg", "x": -25, "y": -25, "width": 50, "height": 50 }, { "target": "i9", "url": "http://localhost:5000/Photo/get?id=IMG_1611.HEIC", "x": -25, "y": -25, "width": 50, "height": 50 }, { "target": "i10", "url": "http://localhost:5000/Photo/get?id=DSC_7356.JPG", "x": -71, "y": -48, "width": 128, "height": 128 }, { "target": "i11", "url": "http://localhost:5000/Photo/get?id=PXL_20220626_160110554.jpg", "x": -76, "y": -73, "width": 152, "height": 152 }, { "target": "i12", "url": "http://localhost:5000/Photo/get?id=PXL_20220625_101343190.jpg", "x": -25, "y": -25, "width": 50, "height": 50 }, { "target": "i13", "url": "http://localhost:5000/Photo/get?id=DSC_7369.JPG", "x": -81, "y": -44, "width": 156, "height": 156 }, { "target": "i14", "url": "http://localhost:5000/Photo/get?id=IMG_1506.HEIC", "x": -25, "y": -25, "width": 50, "height": 50 }, { "target": "i15", "url": "http://localhost:5000/Photo/get?id=PXL_20220626_193024587.jpg", "x": -34, "y": -43, "width": 110, "height": 110 }, { "target": "i16", "url": "http://localhost:5000/Photo/get?id=PXL_20220627_165129391.jpg", "x": -64, "y": -60, "width": 144, "height": 144 }, { "target": "i17", "url": "http://localhost:5000/Photo/get?id=PXL_20220624_151818573.jpg", "x": -82, "y": -93, "width": 170, "height": 170 }, { "target": "i18", "url": "http://localhost:5000/Photo/get?id=PXL_20220626_160809779.jpg", "x": -81, "y": -54, "width": 126, "height": 126 }] }


export { hexagons, polygonPath, polygonToPath, translatePath }