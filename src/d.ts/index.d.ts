export type CollageCellTemplate = {
    i: number,
    style: string,
    clipPath?: string,
    bbox?: {
        x: number, y: number, width: number, height: number
    }
}

export type CollageTemplate = Array<CollageCellTemplate>