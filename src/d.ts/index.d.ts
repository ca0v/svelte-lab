export type Photo = {
    id: string
    filename: string
    url: string
    created: string
    width: number
    height: number
}

export type CollageCellTemplate = {
    i: number,
    style: string,
    clipPath?: string,
    bbox?: {
        x: number, y: number, width: number, height: number
    }
}

export type CollageTemplate = Array<CollageCellTemplate>