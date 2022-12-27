export type BBox = {
    x?: number,
    y?: number,
    width?: number,
    height?: number
}

export type CollageCellTemplate = {
    i: number,
    style: string,
    clipPath?: string,
    bbox?: BBox
}

export type CollageTemplate = Array<CollageCellTemplate>

export interface CollageCellState {
    baseurl?: string
}

/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface CollageCellBackground {
    fill?: string | null;
    stroke?: string | null;
}

export interface CollageCellState {
    id?: string | null;
    target?: string | null;
    /** @format int32 */
    x?: number;
    /** @format int32 */
    y?: number;
    /** @format int32 */
    width?: number;
    /** @format int32 */
    height?: number;
    transform?: string | null;
    clipPath?: string | null;
    background?: CollageCellBackground | null;
}

export type ClipPaths = Record<string, string>

export interface CollageData {
    id?: string | null;
    title?: string | null;
    note?: string | null;
    data?: CollageCellState[] | null;
    clipPaths?: ClipPaths | null;
}

export interface Photo {
    id?: string | null;
    filename?: string | null;
    created?: string | null;
    /** @format int64 */
    width?: number | null;
    /** @format int64 */
    height?: number | null;
    baseurl?: string | null;
}

export interface Recording {
    id?: string | null;
    title?: string | null;
}
