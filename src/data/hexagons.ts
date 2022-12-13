import { svgClipPaths } from "../lib/globals"
import { polygonPath, polygonToPath, translatePath } from "../lib/paths"

export type Photo = {
    id: string
    filename: string
    url: string
    created: string
    width: number
    height: number
}

export type HexagonData = {
    id: string
    target: string
    x: number
    y: number
    width: number
    height: number
    transform: string
    clipPath: string
    background?: {
        fill?: string;
        stroke?: string;
    }
}

export type Hexagon = {
    id: string
    title: string
    data: Array<HexagonData>
}

function range(size: number) {
    return new Array(size).fill(0).map((_, i) => i);
}

/*
    Inject clip paths into the global SVG clip path registry
    I like generating close to where I am using it
    ...seems unfinished though, maybe injectRect(name,x,y,width,height), etc.
    or maybe just put it back in ClipPaths.svelte
 */
injectRect("box", -25, -25, 50, 50)
injectPath("0", polygonToPath(polygonPath(6, 21, 0)))
injectPath("poly5_0", polygonToPath(polygonPath(5, 51, 0)))
injectPath("poly5_36", polygonToPath(polygonPath(5, 36, 52)))
injectPath("poly5_36_1", polygonToPath(polygonPath(5, 36, 52 + 36 + 0)))
injectPath("30", polygonToPath(polygonPath(6, 21, 30)))
injectPath("2", polygonToPath(translatePath(polygonPath(6, 64, 30), 64, 64)))
injectRect("7x5", -35, -25, 70, 50)

const transforms: Record<string, Array<{
    i: number,
    style: string,
    clipPath?: string,
    bbox?: {
        x: number, y: number, width: number, height: number
    }
}>> = {
    "flower-6": [
        { "i": 0, "style": "", clipPath: "poly5_36" },
        ...[1, 2, 3, 4, 5].map((i) => ({
            "i": i,
            "style": `rotate(${16 + i * 72}deg) translate(${65}px, 0) rotate(${-16 + -i * 72}deg)`,
            clipPath: "poly5_36_1"
        }))],
    "spiral-19": [
        { "i": 0, "style": "", clipPath: "30" },
        ...range(6).map(i => ({ "i": i + 1, "style": `rotate(${60 * i}deg) translate(40px, 0) rotate(-${60 * i}deg)`, clipPath: "30" })),
        ...range(6).map(i => ({ "i": i + 7, "style": `rotate(${60 * i}deg) translate(80px, 0) rotate(-${60 * i}deg)`, clipPath: "30" })),
        ...range(6).map(i => ({ "i": i + 13, "style": `rotate(${30 + 60 * i}deg) translate(69.5px, 0) rotate(-${30 + 60 * i}deg)`, clipPath: "30" })),
    ],
    "square-16": range(4).map(row =>
        range(4).map(col => ({
            "i": col + row * 4,
            "style": `translate(${-74 + col * 49}px, ${-74 + row * 49}px)`,
            clipPath: "box", bbox: { x: -40, y: -40, width: 80, height: 80 }
        }))
    ).flat(),
    "7x5-3": range(3).map(i => ({
        "i": i,
        "style": `translate(${-50 + i * 35}px, ${-50 + i * 55}px)`,
        clipPath: "7x5",
        bbox: { x: -35, y: -25, width: 70, height: 50 }
    }))

}

const collages: Array<Hexagon> =
    [
        {
            id: "7x5-3",
            title: "7x5-3",
            data: transforms["7x5-3"].map((t, i) => {
                return {
                    target: `i${t.i}`,
                    id: `AIk5ERFrV7YxvPBqVg3prtWxO1iGmqxFd0or1PI65r6t69FZGQWHC2Z0so4NT0XQhaOJnOKu3ihhEtEMR4wRt_Frw0ookSwA9g`,
                    x: t.bbox.x,
                    y: t.bbox.y,
                    width: t.bbox.width,
                    height: t.bbox.height,
                    transform: t.style,
                    clipPath: t.clipPath,
                }
            })
        },
        {
            id: "square-16",
            title: "square-16",
            data: transforms["square-16"].map((t, i) => {
                return {
                    target: `i${t.i}`,
                    id: `AIk5ERHkVze4l_coT8puVELK7N6oo1IL2Ejp3VSbhZfpYHgMS-AJcs8MFO4w1b1zhu-vQnY_JbVRMQXdmDmJHP0qKcsrqKagMw`,
                    x: t.bbox.x,
                    y: t.bbox.y,
                    width: t.bbox.width,
                    height: t.bbox.height,
                    transform: t.style,
                    clipPath: t.clipPath,
                }
            })
        },
        {
            id: "spiral-19",
            title: "spiral-19",
            data: transforms["spiral-19"].map((t, i) => {
                return {
                    target: `i${t.i}`,
                    id: `AIk5ERHkVze4l_coT8puVELK7N6oo1IL2Ejp3VSbhZfpYHgMS-AJcs8MFO4w1b1zhu-vQnY_JbVRMQXdmDmJHP0qKcsrqKagMw`,
                    x: -50,
                    y: -50,
                    width: 100,
                    height: 100,
                    transform: t.style,
                    clipPath: t.clipPath,
                }
            })
        },
        {
            id: "flower-6",
            title: "flower-6",
            data: transforms["flower-6"].map((t, i) => {
                return {
                    target: `i${t.i}`,
                    id: `AIk5ERHkVze4l_coT8puVELK7N6oo1IL2Ejp3VSbhZfpYHgMS-AJcs8MFO4w1b1zhu-vQnY_JbVRMQXdmDmJHP0qKcsrqKagMw`,
                    x: -140,
                    y: -140,
                    width: 280,
                    height: 280,
                    transform: t.style,
                    clipPath: t.clipPath,
                }
            })
        },
        {
            "id": "2022-07-17-18",
            "title": "Lake Itasca",
            "data": [
                {
                    "target": "i0",
                    "id": "AIk5ERFrV7YxvPBqVg3prtWxO1iGmqxFd0or1PI65r6t69FZGQWHC2Z0so4NT0XQhaOJnOKu3ihhEtEMR4wRt_Frw0ookSwA9g",
                    "x": -50,
                    "y": -50,
                    "width": 100,
                    "height": 100,
                    "transform": "matrix(4.65418, 0, 0, 4.65418, -2.30926e-14, -13.9626)",
                    "clipPath": "30"
                },
                {
                    "target": "i1",
                    "id": "AIk5EREUeBm4g7nFvXmqBC3Dn8N-4xYImZ6z7WovvSFco-C1KCL7B88OgOW2J8PQAkODNRhap7pD5Y834T7aeaaqigIg7i6YzQ",
                    "x": -52,
                    "y": -63,
                    "width": 96,
                    "height": 96,
                    "transform": "matrix(0.866026, 0.5, -0.5, 0.866026, 40.4019, -13.0359)",
                    "clipPath": "30"
                },
                {
                    "target": "i2",
                    "id": "AIk5EREWJd3syq4t-ZFWCy0rqHqjlHHDq2GmmuzGIbWbYNrM6sEfAOXzIPJlm2Md5h-tz5gj5K_zprX_YE7kqfMGocwIW3z9Mg",
                    "x": -43,
                    "y": -35,
                    "width": 72,
                    "height": 72,
                    "transform": "matrix(1.24507, 0, 0, 1.24507, 14.9408, 49.3558)",
                    "clipPath": "30"
                },
                {
                    "target": "i3",
                    "id": "AIk5ERFGF-RITXG_Jc9FXEK81yR2WA9_TZFRgslNCTFC7HKo-Ut_uE69W5W0uQJ2ZJrixtPMHtjshJyCywJJxryCLX4joik68A",
                    "x": -16,
                    "y": -25,
                    "width": 32,
                    "height": 32,
                    "transform": "matrix(1, 0, 0, 1, 1, -90.359)",
                    "clipPath": "30"
                },
                {
                    "target": "i4",
                    "id": "",
                    "x": -50,
                    "y": -50,
                    "width": 100,
                    "height": 100,
                    "transform": "matrix(1, 0, 0, 1, -48, -14)",
                    "clipPath": "30"
                },
                {
                    "target": "i5",
                    "id": "",
                    "x": -50,
                    "y": -50,
                    "width": 100,
                    "height": 100,
                    "transform": "matrix(1, 0, 0, 1, -20, -34.641)",
                    "clipPath": "30"
                },
                {
                    "target": "i6",
                    "id": "",
                    "x": -50,
                    "y": -50,
                    "width": 100,
                    "height": 100,
                    "transform": "matrix(1, 0, 0, 1, 20, -34.641)",
                    "clipPath": "30"
                },
                {
                    "target": "i7",
                    "id": "",
                    "x": -50,
                    "y": -50,
                    "width": 100,
                    "height": 100,
                    "transform": "matrix(1, 0, 0, 1, 80, 0)",
                    "clipPath": "30"
                },
                {
                    "target": "i8",
                    "id": "",
                    "x": -50,
                    "y": -50,
                    "width": 100,
                    "height": 100,
                    "transform": "matrix(1, 0, 0, 1, 40, 69.282)",
                    "clipPath": "30"
                },
                {
                    "target": "i9",
                    "id": "AIk5ERFwp5KcYTUlETXWTVaD2yd7yh63D9B03ZGgt_-JCy1F-7H7tNqtMrK3vM0zzxWq-2-FdNdIoAQQMjdmFQldzZFgdMilpg",
                    "x": -50,
                    "y": -50,
                    "width": 100,
                    "height": 100,
                    "transform": "matrix(1, 0, 0, 1, 68, -17.718)",
                    "clipPath": "30"
                },
                {
                    "target": "i10",
                    "id": "",
                    "x": -50,
                    "y": -50,
                    "width": 100,
                    "height": 100,
                    "transform": "matrix(1, 0, 0, 1, -80, 9.79717e-15)",
                    "clipPath": "30"
                },
                {
                    "target": "i11",
                    "id": "",
                    "x": -50,
                    "y": -50,
                    "width": 100,
                    "height": 100,
                    "transform": "matrix(1, 0, 0, 1, -40, -69.282)",
                    "clipPath": "30"
                },
                {
                    "target": "i12",
                    "id": "",
                    "x": -50,
                    "y": -50,
                    "width": 100,
                    "height": 100,
                    "transform": "matrix(1, 0, 0, 1, 40, -69.282)",
                    "clipPath": "30"
                },
                {
                    "target": "i13",
                    "id": "AIk5ERFdl3X9x1hfoKK_5TKnrrAvtf0K2rad9Nc_NG7rIKDYPm1bGC38Rxyafm0bszLChEBtG-GzYlUk2co1rvWDgvK46hn6Rg",
                    "x": -50,
                    "y": -50,
                    "width": 100,
                    "height": 100,
                    "transform": "matrix(1.17166, 0, 0, 1.17166, 63.4908, 23.1403)",
                    "clipPath": "30"
                },
                {
                    "target": "i14",
                    "id": "",
                    "x": -22,
                    "y": -24,
                    "width": 46,
                    "height": 46,
                    "transform": "matrix(1, 0, 0, 1, 4.25565e-15, 61.5)",
                    "clipPath": "30"
                },
                {
                    "target": "i15",
                    "id": "AIk5ERFylCAin2c3AHP2OBLy0yky5bggBGgZt5HCtp1Bg9kBJ1GJ6fsPrOFD_g1H9q6SEKEcoivbUrSqef4RrVNSbK0iOOSwFA",
                    "x": -27,
                    "y": -29,
                    "width": 56,
                    "height": 56,
                    "transform": "matrix(1.52363, 0, 0, 1.52363, -56.662, 19.4263)",
                    "clipPath": "30"
                },
                {
                    "target": "i16",
                    "id": "AIk5ERHdbkiegpIrtiiy7S09USeJDnw1YIFz15rkvJwitEaKhn-I6DelNxfDBuBEXzD7rO1ycK_VsWsmjq8nJ5IVwc2-BwSGHQ",
                    "x": -41,
                    "y": -40,
                    "width": 100,
                    "height": 100,
                    "transform": "matrix(1.10408, 0, 0, 1.10408, -64.2451, -50.5117)",
                    "clipPath": "30"
                },
                {
                    "target": "i17",
                    "id": "",
                    "x": -50,
                    "y": -50,
                    "width": 100,
                    "height": 100,
                    "transform": "matrix(1, 0, 0, 1, -1.27669e-14, -88.5)",
                    "clipPath": "30"
                },
                {
                    "target": "i18",
                    "id": "AIk5ERFZ8Ppra10Cg3jLZWwbKHRQ2zw6PKIbwhLUFBO2BTBGYgpvESLs_Wi92gE28fVPBdE3nLfUpvEGBEw7yOe-thChAzo76Q",
                    "x": -28,
                    "y": -28,
                    "width": 56,
                    "height": 56,
                    "transform": "matrix(0.989822, 0, 0, 0.989822, 66.5049, -52.2131)",
                    "clipPath": "30"
                }
            ]
        }
        ,
        {
            "id": "2022-07-12-14",
            "title": "Heading West",
            "data": [
                {
                    "target": "i0",
                    "id": "AIk5EREB4p70YC16cqSexclF43uoHp9I3Ggr2vXF4xnmG521_hhlnLLwGnSWEUO2FoFASC6_DNOI6SYvdPwvdvH55WhB6LThJQ",
                    "x": -50,
                    "y": -50,
                    "width": 100,
                    "height": 100,
                    "transform": "",
                    "clipPath": "30"
                },
                {
                    "target": "i1",
                    "id": "AIk5ERFVCrbctTKjDiv2cZPHiB6GNLMP2l_xadovUadWWpS-SuyDd3cJ7uOphhlfhRTJDeTMUKH2-AsGF7RsfKo788mdqUEeMg",
                    "x": -92,
                    "y": -92,
                    "width": 170,
                    "height": 170,
                    "transform": "matrix(1, 0, 0, 1, 40, 0)",
                    "clipPath": "30"
                },
                {
                    "target": "i2",
                    "id": "AIk5ERHWBtZ8QQaxs5R8SkH6XVzQcaJSLEXEg45VDAn93Ff3GK-rN_JF3S1SxSa5jMd2bFU077_DMGjmNWi8UTqf-jyMtLW0sA",
                    "x": -74,
                    "y": -32,
                    "width": 94,
                    "height": 94,
                    "transform": "matrix(1, 0, 0, 1, 20, 34.641)",
                    "clipPath": "30"
                },
                {
                    "target": "i3",
                    "id": "AIk5ERECFkGe298WxejutA3uaC2TQWwYqF8YT6fELrgEfKFKHLXIdMY7qnYvdL3D_H7eBn19XhN_ofq_LC26-Ieo4A5f_z3tNQ",
                    "x": -30,
                    "y": -30,
                    "width": 58,
                    "height": 58,
                    "transform": "matrix(1, 0, 0, 1, -20, 34.641)",
                    "clipPath": "30"
                },
                {
                    "target": "i4",
                    "id": "AIk5ERHxssucMfteNlq5I32MmgVanX3HuZwNbeia1dVHgNyR3MHMnrMkDSs_PiZLhLYi0XiWh8UM1QQ96w7OEOIq2jQ83XdgLw",
                    "x": -34,
                    "y": -29,
                    "width": 60,
                    "height": 60,
                    "transform": "matrix(1, 0, 0, 1, -40, 4.89859e-15)",
                    "clipPath": "30"
                },
                {
                    "target": "i5",
                    "id": "AIk5ERGDBYw3CdnxDLDktgr-IX-i7lNFl6s97DE5YszQu_uwt0B4zbZZSqrf3ZIDU8TUMgcmmkCFxR_IR5x1jSwn0NrcJlNp_A",
                    "x": -32,
                    "y": -28,
                    "width": 60,
                    "height": 60,
                    "transform": "matrix(1, 0, 0, 1, -20, -34.641)",
                    "clipPath": "30"
                },
                {
                    "target": "i6",
                    "id": "AIk5ERGvcLDfvP3lGRXEY-aVUsz2hvK2_D_xrZsdOAHI1J2V7pNu5QRE9cvywXbDMZYb6ExXP0BOdsBh5TYkQ2hjHZm25PuGFA",
                    "x": -49,
                    "y": -39,
                    "width": 76,
                    "height": 76,
                    "transform": "matrix(1, 0, 0, 1, 20, -34.641)",
                    "clipPath": "30"
                },
                {
                    "target": "i7",
                    "id": "AIk5EREtuz-i1aTKVpKNSNKhtggLUfv7BvUJKF4RZps1CM7qK4dli2QwQ6JibT0H7z62DVBH7fbtICaowhfgIz9FTPDz29w_4g",
                    "x": -27,
                    "y": -20,
                    "width": 54,
                    "height": 54,
                    "transform": "matrix(1, 0, 0, 1, 80, 0)",
                    "clipPath": "30"
                },
                {
                    "target": "i8",
                    "id": "AIk5ERG7w0KEpVYe4d3VnbrbONbRtjPyMh7eZ2KjNvXbtFYCGf-IKR1p7iUo4adTw-9_UWQe8wP1QRwXeslYvcZp0ntB_Vp8_w",
                    "x": -74,
                    "y": -46,
                    "width": 112,
                    "height": 112,
                    "transform": "matrix(1, 0, 0, 1, 40, 69.282)",
                    "clipPath": "30"
                },
                {
                    "target": "i9",
                    "id": "AIk5ERHNBe6AbqUvGVHWx6uPWgzEOu7csFaCkKSybS7pch_TRK6RG7Y-pJ9Qu0jFUPOmax49y8ulICuZnPkIr3Qjx6OF5MOVNQ",
                    "x": -25,
                    "y": -25,
                    "width": 50,
                    "height": 50,
                    "transform": "matrix(1, 0, 0, 1, -40, 69.282)",
                    "clipPath": "30"
                },
                {
                    "target": "i10",
                    "id": "AIk5ERETNcEaRGXiP4SlvQtSdr4snf2uPy7pcP3bibAfWPN4xOB4GQlRdtQooxBJgnGEXRF0LqmIcQefFrlQDKuOoaxJuflFjA",
                    "x": -50,
                    "y": -50,
                    "width": 100,
                    "height": 100,
                    "transform": "matrix(1, 0, 0, 1, -80, 9.79717e-15)",
                    "clipPath": "30"
                },
                {
                    "target": "i11",
                    "id": "AIk5ERF90c2uxQ_6HJ1cU1t_UUI2bmmA9Uynq-yhcHj3bmjHwqAgaFHiYI-WWkmfXO6IMxKfbzoKB11hFrPuxskLUMRPK-pRxA",
                    "x": -50,
                    "y": -50,
                    "width": 100,
                    "height": 100,
                    "transform": "matrix(1, 0, 0, 1, -40, -69.282)",
                    "clipPath": "30"
                },
                {
                    "target": "i12",
                    "id": "AIk5ERE3H251ifs5B334DQCJyPKvL-yl7oyx_zwxd24C4yVrEMcExqL1GxDIb0zeaCCnCSdHulaX0kCQhFVMzg7bld0mhL3l9A",
                    "x": -50,
                    "y": -50,
                    "width": 100,
                    "height": 100,
                    "transform": "matrix(1, 0, 0, 1, 40, -69.282)",
                    "clipPath": "30"
                },
                {
                    "target": "i13",
                    "id": "AIk5ERGVL0nvvTFN_jHsUjyGh9UZWNSioBZjd_Bj76_n97E-hSVpnaR8O66ZznC796YZaaSxxRyvLWA7a2-Rrn_MeRNXXsjrHQ",
                    "x": -50,
                    "y": -50,
                    "width": 100,
                    "height": 100,
                    "transform": "matrix(1, 0, 0, 1, 60.1888, 34.75)",
                    "clipPath": "30"
                },
                {
                    "target": "i14",
                    "id": "AIk5ERHMDzANucrsEWKugLbFhA32d5-JY0mcuMF2lXGc61FN0qGNqT1iOkFOPiGfFVyp-CoGdgMn8WjtJnDA-W9c-CLOSPDMAA",
                    "x": -50,
                    "y": -53,
                    "width": 106,
                    "height": 106,
                    "transform": "matrix(1, 0, 0, 1, 4.25565e-15, 69.5)",
                    "clipPath": "30"
                },
                {
                    "target": "i15",
                    "id": "AIk5ERHdTvY96vLAPrAlQBAQQqskzaD5TM7qCiQASaESiUbxm8UXQf3glcAkjBc96hwXS_rggFtC860b2nr-fYHzCwd1HHZkVw",
                    "x": -50,
                    "y": -50,
                    "width": 100,
                    "height": 100,
                    "transform": "matrix(1, 0, 0, 1, -60.1888, 34.75)",
                    "clipPath": "30"
                },
                {
                    "target": "i16",
                    "id": "AIk5ERFqU5Aof5uJrLs9uyN3xtvUsqgC_rZYyclMEliNhUQ0Mo4Q923vi3r_1G9TGGMpT-_jyPdewVNM2iu3xSH8rKVmeY_CgA",
                    "x": -25,
                    "y": -25,
                    "width": 50,
                    "height": 50,
                    "transform": "matrix(1, 0, 0, 1, -60.1888, -34.75)",
                    "clipPath": "30"
                },
                {
                    "target": "i17",
                    "id": "AIk5ERE7oeyUCjfc4rmFB92sSPND6lEA7goKennYbegjQZLgkcuRiKIpRsNdTp2KpPb2F0hls634fxsNY7GqSbeURweQZW0jgw",
                    "x": -31,
                    "y": -28,
                    "width": 60,
                    "height": 60,
                    "transform": "matrix(1, 0, 0, 1, -1.27669e-14, -69.5)",
                    "clipPath": "30"
                },
                {
                    "target": "i18",
                    "id": "AIk5ERF4Z1wcaUmA8yKPznCjTUzFOcEDsSKbJprjtHhuERjdf_Np-viLeg15HKy_tMpq8bCwXIOz07I9Dw9g4Do1KYisxBeHBg",
                    "x": -29,
                    "y": -28,
                    "width": 54,
                    "height": 54,
                    "transform": "matrix(1, 0, 0, 1, 60.1888, -34.75)",
                    "clipPath": "30"
                }
            ]
        }
        ,
        {
            "id": "2022-07-10",
            "title": "Baybeach Was Really Fun!",
            "data": [
                {
                    "target": "i0",
                    "id": "AIk5ERFErl7AepzDmfkTv5YuKj-tYPiY86lxv-FkR2wRyK_nGNRgZg4v_ixJMN64Kdwu08fR36VtWa8tq0a5dhj90XNCyZ5MvA",
                    "x": -65,
                    "y": -55,
                    "width": 112,
                    "height": 112,
                    "transform": "",
                    "clipPath": "poly5_36"
                },
                {
                    "target": "i1",
                    "id": "AIk5ERFAapXwJBiC6_aMW0ae4LB_FWe6EG0HaR_rJ0BTdobh1RTQ8yw_zOgUGnFWCz1dhOSrN3OvRu37lUQVzXT3h47CjNOIcQ",
                    "x": -39,
                    "y": -40,
                    "width": 86,
                    "height": 86,
                    "transform": "matrix(1, 0, 0, 1, 2.26847, 64.9604)",
                    "clipPath": "poly5_36_1"
                },
                {
                    "target": "i2",
                    "id": "AIk5ERGQ_Jyrc7kib0pT3WQ8lvtdsQ-L1uIwW3QQC04YU91HM5IPPKRsrawRonaVO1Ean2XGsmC-8qYdUOuN0Oj1TmKCMBpLTA",
                    "x": -33,
                    "y": -44,
                    "width": 110,
                    "height": 110,
                    "transform": "matrix(1, 0, 0, 1, -61.08, 22.2313)",
                    "clipPath": "poly5_36_1"
                },
                {
                    "target": "i3",
                    "id": "AIk5ERG_hrkbq61lmhGQcUv06uDMuPHPM3ZhwPLeWr6_ks0OXaONOGnzrKFbcxa86CJgAZPZORdXliyXUQVSVBJPXfMskrjczg",
                    "x": -55,
                    "y": -53,
                    "width": 102,
                    "height": 102,
                    "transform": "matrix(1, 0, 0, 1, -40.018, -51.2207)",
                    "clipPath": "poly5_36_1"
                },
                {
                    "target": "i4",
                    "id": "AIk5EREtand-5zfHuLAJyKCsReKztoz6_V7ziaRYgjCpz3VPwpnkBGgwp0kGSzr9g-q2yiNgE_IyBeGDbDrY1CzRWw4XP1elGg",
                    "x": -41,
                    "y": -73,
                    "width": 142,
                    "height": 142,
                    "transform": "matrix(1, 0, 0, 1, 36.3475, -53.8874)",
                    "clipPath": "poly5_36_1"
                },
                {
                    "target": "i5",
                    "id": "AIk5ERFiE4k44tDytB82SdkdMEmL-40yYpBj9FcwqMq9Myhqhu9bRJrYnIDLQWP1GRN9-dN3sOg2rXmlOdPue9fqOv5DXRDCUg",
                    "x": -43,
                    "y": -41,
                    "width": 88,
                    "height": 88,
                    "transform": "matrix(1, 0, 0, 1, 62.482, 17.9164)",
                    "clipPath": "poly5_36_1"
                }
            ]
        },
        {
            "id": "2022-07-07-10",
            "title": "Lifest Oshkosh 2022",
            "data": [
                {
                    "target": "i0",
                    "id": "AIk5EREPzD3KNY6K7wZfkHfLYWfxnnezwaa3WxH8SscuofB-dfsUbU2HHcLxcBUd7Xqsk7Xa-qLni0zreQFaFtGQ-SMRrrY5pw",
                    "x": -42,
                    "y": -33,
                    "width": 82,
                    "height": 82,
                    "transform": "matrix(1, 8.85254e-08, -8.85254e-08, 1, 0, 0)",
                    "clipPath": "30"
                },
                {
                    "target": "i1",
                    "id": "AIk5ERGt7kUEnuc1l-tH2ogZNQWcxCmhFOxjT4sNHw7jHBC2yur_hAB0O6G9A1UgCGn93um7J55S0IIHL2Lem5Pu01Dw_QqrRw",
                    "x": -48,
                    "y": -29,
                    "width": 92,
                    "height": 92,
                    "transform": "matrix(1, 0, 0, 1, 40, 0)",
                    "clipPath": "30"
                },
                {
                    "target": "i2",
                    "id": "AIk5EREfLm774m9zzsx3iIty_PwMwwX2yPcc5V9-ZFRaaCBBdi7RpLlTSn02fUcg-rUPZ6ROj0aF_ztLLe6gHm3Wp5vUJ74oRg",
                    "x": -36,
                    "y": -29,
                    "width": 58,
                    "height": 58,
                    "transform": "matrix(1, 0, 0, 1, 20, 34.641)",
                    "clipPath": "30"
                },
                {
                    "target": "i3",
                    "id": "AIk5ERHkVze4l_coT8puVELK7N6oo1IL2Ejp3VSbhZfpYHgMS-AJcs8MFO4w1b1zhu-vQnY_JbVRMQXdmDmJHP0qKcsrqKagMw",
                    "x": -100,
                    "y": -81,
                    "width": 134,
                    "height": 134,
                    "transform": "matrix(1, 0, 0, 1, -20, 34.641)",
                    "clipPath": "30"
                },
                {
                    "target": "i4",
                    "id": "AIk5ERHS1dE15ynZlhxTsn8t9Z8WPlcJpm4DgwhxUwhkVpgL54w1B6JajP0WnAc6nbTqU_LQsW_djH5e_F2KQm2tNlwCvEhmPg",
                    "x": -81,
                    "y": -69,
                    "width": 116,
                    "height": 116,
                    "transform": "matrix(1, 0, 0, 1, -40, 4.89859e-15)",
                    "clipPath": "30"
                },
                {
                    "target": "i5",
                    "id": "AIk5ERES7G_qYbTewK-TyJGHU9KF4h15_hJNJLsEuzmJ18fwjI97Ntyz7iDNTmPoBgbtLG7MB7lG5pvtpjvy7qE8BtZuzpAd3g",
                    "x": -24,
                    "y": -17,
                    "width": 46,
                    "height": 46,
                    "transform": "matrix(1, 0, 0, 1, -20, -34.641)",
                    "clipPath": "30"
                },
                {
                    "target": "i6",
                    "id": "AIk5ERHYcKQHiYPCr_fN2Fx9pgyBeALfIcAoSFBchfx1Wy317Ls4DrY74UczcZacvPOy4HaiLanOHe3uIxeP3DwcSYgYXMEmbg",
                    "x": -35,
                    "y": -36,
                    "width": 68,
                    "height": 68,
                    "transform": "matrix(1, -8.85254e-08, 8.85254e-08, 1, 20, -34.641)",
                    "clipPath": "30"
                },
                {
                    "target": "i7",
                    "id": "AIk5ERHS4AY3tLlhKPt8KvWaMBAbbA9QjP6f5BTrulFvKhzWT4jG3nmDCkE_U3_y44mpH0N2SOppPcug4_tMqBfF0zbri8xCHA",
                    "x": -51,
                    "y": -45,
                    "width": 94,
                    "height": 94,
                    "transform": "matrix(1, 0, 0, 1, 80, 0)",
                    "clipPath": "30"
                },
                {
                    "target": "i8",
                    "id": "AIk5EREfLm774m9zzsx3iIty_PwMwwX2yPcc5V9-ZFRaaCBBdi7RpLlTSn02fUcg-rUPZ6ROj0aF_ztLLe6gHm3Wp5vUJ74oRg",
                    "x": -83,
                    "y": -65,
                    "width": 132,
                    "height": 132,
                    "transform": "matrix(1, 0, 0, 1, 40, 69.282)",
                    "clipPath": "30"
                },
                {
                    "target": "i9",
                    "id": "AIk5ERFKUL6XQhKZtTKCutRWGEE65uTV5iOH5mK3uA5KkhHqR2YOZ6RsqYyGuUcx9yKboBIcDkpxpxuDE7Q0T8Xz-shXwcqRgA",
                    "x": -47,
                    "y": -64,
                    "width": 122,
                    "height": 122,
                    "transform": "matrix(1, 0, 0, 1, -40, 69.282)",
                    "clipPath": "30"
                },
                {
                    "target": "i10",
                    "id": "AIk5ERHs6BjJThDO88YUkTccolhXIUpu_4bP2AbWFpzzhL7ZNlkOnNSntcS40Wc868R_1Ib5AxwoiJneFwXW-rvEi5sSEteInQ",
                    "x": -37,
                    "y": -35,
                    "width": 72,
                    "height": 72,
                    "transform": "matrix(1, 0, 0, 1, -80, 9.79717e-15)",
                    "clipPath": "30"
                },
                {
                    "target": "i11",
                    "id": "AIk5EREXhCzmU23mfrSPRsZHln4y5diREiYhDlUCxnLfOwi1Vzshqw5AX5DsmtP9L7UD936qiwLmCR6C14yhaVVWj7obVrZYXQ",
                    "x": -44,
                    "y": -35,
                    "width": 86,
                    "height": 86,
                    "transform": "matrix(1, 0, 0, 1, -40, -69.282)",
                    "clipPath": "30"
                },
                {
                    "target": "i12",
                    "id": "AIk5ERF01g3VdO2thLlJAq98KTjDYwWgmvqlr40oiQ6WUusCY-le48fnlfJPedFuRm1g5ZNe-l-Kx6PsCu_Z11AzGDKPedCq_w",
                    "x": -20,
                    "y": -26,
                    "width": 56,
                    "height": 56,
                    "transform": "matrix(1, 0, 0, 1, 40, -69.282)",
                    "clipPath": "30"
                },
                {
                    "target": "i13",
                    "id": "AIk5EREfLm774m9zzsx3iIty_PwMwwX2yPcc5V9-ZFRaaCBBdi7RpLlTSn02fUcg-rUPZ6ROj0aF_ztLLe6gHm3Wp5vUJ74oRg",
                    "x": -51,
                    "y": -37,
                    "width": 88,
                    "height": 88,
                    "transform": "matrix(1, 0, 0, 1, 60.1888, 34.75)",
                    "clipPath": "30"
                },
                {
                    "target": "i14",
                    "id": "AIk5EREwUEEMDkUZC8ppXK9j7dxzrlErJYrAarowI_GbNw8Rz9OTB3OcmQXx0fT_DSDOQQiABzV5ENSBkMnLai65ImzGtqS2yQ",
                    "x": -130,
                    "y": -66,
                    "width": 184,
                    "height": 184,
                    "transform": "matrix(1, 0, 0, 1, 4.25565e-15, 69.5)",
                    "clipPath": "30"
                },
                {
                    "target": "i15",
                    "id": "AIk5ERFKUL6XQhKZtTKCutRWGEE65uTV5iOH5mK3uA5KkhHqR2YOZ6RsqYyGuUcx9yKboBIcDkpxpxuDE7Q0T8Xz-shXwcqRgA",
                    "x": -93,
                    "y": -64,
                    "width": 112,
                    "height": 112,
                    "transform": "matrix(1, 0, 0, 1, -60.1888, 34.75)",
                    "clipPath": "30"
                },
                {
                    "target": "i16",
                    "id": "AIk5EREwUEEMDkUZC8ppXK9j7dxzrlErJYrAarowI_GbNw8Rz9OTB3OcmQXx0fT_DSDOQQiABzV5ENSBkMnLai65ImzGtqS2yQ",
                    "x": -118,
                    "y": -95,
                    "width": 182,
                    "height": 182,
                    "transform": "matrix(1, 0, 0, 1, -60.1888, -34.75)",
                    "clipPath": "30"
                },
                {
                    "target": "i17",
                    "id": "AIk5EREuaTFWRyW_gJVnBo-Ezx0EyU-RK0_n37eD_wr6qWzUWDr3V1rLyZxDDw1zQERAycBArNq8ZtnzlQjLtk34XnV-bZE6-A",
                    "x": -46,
                    "y": -68,
                    "width": 106,
                    "height": 106,
                    "transform": "matrix(1, 0, 0, 1, -1.27669e-14, -69.5)",
                    "clipPath": "30"
                },
                {
                    "target": "i18",
                    "id": "AIk5ERFKUL6XQhKZtTKCutRWGEE65uTV5iOH5mK3uA5KkhHqR2YOZ6RsqYyGuUcx9yKboBIcDkpxpxuDE7Q0T8Xz-shXwcqRgA",
                    "x": -19,
                    "y": -31,
                    "width": 66,
                    "height": 66,
                    "transform": "matrix(1, 0, 0, 1, 60.1888, -34.75)",
                    "clipPath": "30"
                }
            ]
        },
        {
            "id": "2022-07-07",
            "title": "Getting to Lifest",
            "data": [
                {
                    "target": "i0",
                    "id": "AIk5ERED0q_zlbV3Hb1_ZseOLxboUaPEhuFk4HEz-xbVGX6r6w2haAyxUu3PnbasUI53XA7O5H5HdMMD0VYU324X6IeWbQDlGw",
                    "x": -18,
                    "y": -18,
                    "width": 36,
                    "height": 36,
                    "transform": "matrix(1, 8.85254e-08, -8.85254e-08, 1, 0, 0)",
                    "clipPath": "30"
                },
                {
                    "target": "i1",
                    "id": "AIk5ERHYWZB975JVXK8NvhRRdzW3oRNrosAW7U-LQ7KJQQwq1xYwCwLnD7Oq2u1JaEzWSQgZ1esMcDSlWD1aR-F7oPEPlUn33w",
                    "x": -93,
                    "y": -71,
                    "width": 144,
                    "height": 144,
                    "transform": "matrix(1, 0, 0, 1, 40, 0)",
                    "clipPath": "30"
                },
                {
                    "target": "i2",
                    "id": "AIk5EREiE6X6oQc2IwRiQLJLqJT3PCMojcdlcbKWVjiPBezHayJX7-fJUnsd9oDV7yYAe-cnBmCPKy1gzCg_6Y0og56MSM0t8A",
                    "x": -30,
                    "y": -28,
                    "width": 54,
                    "height": 54,
                    "transform": "matrix(1, 0, 0, 1, 20, 34.641)",
                    "clipPath": "30"
                },
                {
                    "target": "i3",
                    "id": "AIk5ERFyUYw-3PvxFtwrlY5T4Ry8FB8kpWhHcyI6DQHWE7ovPuNZJ-4y4SIHDz0hlPlqmXr18FCR5GMNw_X5vpNm-ksC4ols8g",
                    "x": -61,
                    "y": -57,
                    "width": 118,
                    "height": 118,
                    "transform": "matrix(1, 0, 0, 1, -20, 34.641)",
                    "clipPath": "30"
                },
                {
                    "target": "i4",
                    "id": "AIk5ERGmYVCubF9pW3X6VdbPM9RBoYG_SjPH40QTx2qS4sLUvazkGdfoLgDqaLtys1oKXWyzzc6VqyQ2VUs_4EuXKXN1hP0rAQ",
                    "x": -105,
                    "y": -171,
                    "width": 194,
                    "height": 194,
                    "transform": "matrix(1, 0, 0, 1, -40, 4.89859e-15)",
                    "clipPath": "30"
                },
                {
                    "target": "i5",
                    "id": "AIk5ERG0TbHO0etbzWNweZRVaagCZPNFy5EGGZ1DDfjLkaIpgCPsfN7UT_Jk6FG16wuLFhbHn4kpZWcpGZnvLQRa5W7k_wfimQ",
                    "x": -31,
                    "y": -28,
                    "width": 56,
                    "height": 56,
                    "transform": "matrix(1, 0, 0, 1, -20, -34.641)",
                    "clipPath": "30"
                },
                {
                    "target": "i6",
                    "id": "AIk5ERHfvRvrtNolpW_RC59H9VE8W1ylLd5UkRRTkkHQm9SEVlZaLJtJyNFasXCe9JlBrItScYmEOhZXVXUZbEzjwps1jqCviA",
                    "x": -34,
                    "y": -29,
                    "width": 64,
                    "height": 64,
                    "transform": "matrix(1, -8.85254e-08, 8.85254e-08, 1, 20, -34.641)",
                    "clipPath": "30"
                },
                {
                    "target": "i7",
                    "id": "AIk5ERE5nIiCnpanqVXltcQczI5JJNZRALXRr2lSmTklolb__QWHB23w4I1UAwZ_WV7Jjx4JTKqLxrIG2Xn1m7x9bX1igzMG3g",
                    "x": -22,
                    "y": -30,
                    "width": 58,
                    "height": 58,
                    "transform": "matrix(1, 0, 0, 1, 80, 0)",
                    "clipPath": "30"
                },
                {
                    "target": "i8",
                    "id": "AIk5ERHH0drurnkRUl2rD3bZ-YxEiJ7aFH0O2ZDz-D7-hNoq69F473deNVMSp2xAzCUphFgjsuenTQKWTFUNaGYqNg8lqhXwLQ",
                    "x": -31,
                    "y": -30,
                    "width": 62,
                    "height": 62,
                    "transform": "matrix(1, 0, 0, 1, 40, 69.282)",
                    "clipPath": "30"
                },
                {
                    "target": "i9",
                    "id": "AIk5ERE6q8sPo8wbSj8-KnGcor2MsiJihIhuCmJ_kFmDEjYe9rWXkniPCzgqM3fmhWFvSxhAVvcKfPQolABCWEuw47fMqJQZtw",
                    "x": -22,
                    "y": -29,
                    "width": 58,
                    "height": 58,
                    "transform": "matrix(1, 0, 0, 1, -40, 69.282)",
                    "clipPath": "30"
                },
                {
                    "target": "i10",
                    "id": "AIk5ERHgbP9F48Ac0h1jL0hwnyJ5PjUueVRNVkCLNdKu_UjZIKDOgDbc6kL0G1byx4gW-h6a_Quzw6rjLRlX1--HmuAUez95dw",
                    "x": -65,
                    "y": -31,
                    "width": 176,
                    "height": 176,
                    "transform": "matrix(1, 0, 0, 1, -80, 9.79717e-15)",
                    "clipPath": "30"
                },
                {
                    "target": "i11",
                    "id": "AIk5ERElyfQMIUBj7iLPwQZ06K9EXyNMHZ7ZttebkJHDpSHBcR6JuRsdC80vAJyPKdbUB107HyU_4ubOMKaroat-K4jlO1AYew",
                    "x": -53,
                    "y": -63,
                    "width": 144,
                    "height": 144,
                    "transform": "matrix(1, 0, 0, 1, -40, -69.282)",
                    "clipPath": "30"
                },
                {
                    "target": "i12",
                    "id": "AIk5EREb23zoS4PAXvlLVD_JoFa3bB29abT2HS9geiJZP1o9GxaeBUphGv9v9uwJbdp0oVTcFAlgE325w_zmTM_fFB_rbGUFxw",
                    "x": -27,
                    "y": -27,
                    "width": 54,
                    "height": 54,
                    "transform": "matrix(1, 0, 0, 1, 40, -69.282)",
                    "clipPath": "30"
                },
                {
                    "target": "i13",
                    "id": "AIk5ERHkYMVLALc5CoXLTzLnYvUPVj-8s2aPkV9wOBTPTla7_8kcFvDPv1hc-GhF0t2Jc01bDLOl8Ti_wCu2FNvPHG3NYnnTMw",
                    "x": -51,
                    "y": -37,
                    "width": 88,
                    "height": 88,
                    "transform": "matrix(1, 0, 0, 1, 60.1888, 34.75)",
                    "clipPath": "30"
                },
                {
                    "target": "i14",
                    "id": "AIk5ERF0HPnJB7naC8zt9a1X1BTOGBmWG4USBa1hKttyqVEGOBCpIe24fcTiG_H3LkiYZUtQK2conrVevku2dsRorZZtW4-m-Q",
                    "x": -30,
                    "y": -27,
                    "width": 54,
                    "height": 54,
                    "transform": "matrix(1, 0, 0, 1, 4.25565e-15, 69.5)",
                    "clipPath": "30"
                },
                {
                    "target": "i15",
                    "id": "AIk5ERF1NJE1dhShWzrohKtmVRXMDdQ8u2XGK-sb8lsczFaRYKtinWmHDO_VcNXU2fXuB-WeKQ6BDNMxzXJbehU789TCwKiPkQ",
                    "x": -25,
                    "y": -25,
                    "width": 50,
                    "height": 50,
                    "transform": "matrix(1, 0, 0, 1, -60.1888, 34.75)",
                    "clipPath": "30"
                },
                {
                    "target": "i16",
                    "id": "AIk5ERGmYVCubF9pW3X6VdbPM9RBoYG_SjPH40QTx2qS4sLUvazkGdfoLgDqaLtys1oKXWyzzc6VqyQ2VUs_4EuXKXN1hP0rAQ",
                    "x": -37,
                    "y": -19,
                    "width": 78,
                    "height": 78,
                    "transform": "matrix(1, 0, 0, 1, -60.1888, -34.75)",
                    "clipPath": "30"
                },
                {
                    "target": "i17",
                    "id": "AIk5ERGcUXgAsXkl6MZsOTG1yd5wxpyw30W9tOaskAsM-splDPZgn5aq15vdpGGM12z92mubD64idyOgzR5wM4FkQx9Pfm4jEQ",
                    "x": -95,
                    "y": -53,
                    "width": 132,
                    "height": 132,
                    "transform": "matrix(1, 0, 0, 1, -1.27669e-14, -69.5)",
                    "clipPath": "30"
                },
                {
                    "target": "i18",
                    "id": "AIk5EREA4k4Tpx8ZhfMKoaXs_jityAA8-U08rdSUGJJVfADRnYZke_MPPmOR6s6gKy3CxufY55wnTj6AKOV0P6IFUwac2BzCSA",
                    "x": -22,
                    "y": -27,
                    "width": 58,
                    "height": 58,
                    "transform": "matrix(1, 0, 0, 1, 60.1888, -34.75)",
                    "clipPath": "30"
                }
            ]
        }
        ,
        {
            "id": "2022-07-03",
            "title": "Air Show on the Mississippi",
            "data": [
                {
                    "target": "i0",
                    "id": "AIk5ERHl2gHzpAiI5JXSKif97DSPQ82uMhUSboq1vYlt3evQjO9P7hmdb-z-_OeEQytNj5V6Vh89zhbk9tq9D0xEfQghdVYSlQ",
                    "x": -65,
                    "y": -49,
                    "width": 110,
                    "height": 110,
                    "transform": "",
                    "clipPath": "30"
                },
                {
                    "target": "i1",
                    "id": "AIk5EREwuP5R2M7YzXW0MYk1KVhPgop2hX1XfUwd7WIzBAhZGji-40ULPfWt36pPDflKwQlRaIwRcsFyffl5f5y-rHlioPMcCA",
                    "x": -50,
                    "y": -50,
                    "width": 100,
                    "height": 100,
                    "transform": "matrix(1, 0, 0, 1, 40, 0)",
                    "clipPath": "30"
                },
                {
                    "target": "i2",
                    "id": "AIk5ERG8NWi_jPCNh9mZ0NIlZJfMCNq32ga25YEKazeHd0sShw_c6-mZ-PoDvIFtNt0Yis2F01joYC4lUuQMrqgxXD_IsR622Q",
                    "x": -50,
                    "y": -50,
                    "width": 100,
                    "height": 100,
                    "transform": "matrix(1, 0, 0, 1, 20, 34.641)",
                    "clipPath": "30"
                },
                {
                    "target": "i3",
                    "id": "AIk5ERF_sb2kiCDeQYZABV82W4OPH-4qIwVge8aHCpCmdZpsqUtfmCS639MkQ6QmZZ2dI-PLTIRVZQmGw7MFxNGGTVxyUI-r2A",
                    "x": -50,
                    "y": -50,
                    "width": 100,
                    "height": 100,
                    "transform": "matrix(1, 0, 0, 1, -20, 34.641)",
                    "clipPath": "30"
                },
                {
                    "target": "i4",
                    "id": "AIk5ERGJhxbIerNzXG7spcrFPdW5Q_74UmEPo0pNHO56OTRipMjyKCAhUqL75bXPy8D8GRtQkl2luYgDYUivX2LI51RnHmUF-g",
                    "x": -50,
                    "y": -50,
                    "width": 100,
                    "height": 100,
                    "transform": "matrix(1, 0, 0, 1, -40, 4.89859e-15)",
                    "clipPath": "30"
                },
                {
                    "target": "i5",
                    "id": "AIk5ERE8HIPRYpxkTnEmntljdMy3bHerqFYkY6_GMLFPjpYmy9EcZl0Kta6CMgj8R8qERW9OxvLzDr70nUptYnEbt2-446CK6g",
                    "x": -50,
                    "y": -50,
                    "width": 100,
                    "height": 100,
                    "transform": "matrix(1, 0, 0, 1, -20, -34.641)",
                    "clipPath": "30"
                },
                {
                    "target": "i6",
                    "id": "AIk5ERGxg4NrOIKmoygt3GytlGjj8v0nIRTHV0jVfhoQDHm3qzP1zkKaAriLYGDPxhJQtfnookC_-5ank9Woq48OIy_l1AAvuw",
                    "x": -50,
                    "y": -50,
                    "width": 100,
                    "height": 100,
                    "transform": "matrix(1, 0, 0, 1, 20, -34.641)",
                    "clipPath": "30"
                },
                {
                    "target": "i7",
                    "id": "AIk5ERH4Sf4lUjP27v9LJi6rH4edL8A2kb9a3YUaNgH-nrfGzQytNb8Cuzp2-IN3k7imu3PyY_rJVBlNq_P5Q11rKeiwYNGPJA",
                    "x": -50,
                    "y": -50,
                    "width": 100,
                    "height": 100,
                    "transform": "matrix(1, 0, 0, 1, 80, 0)",
                    "clipPath": "30"
                },
                {
                    "target": "i8",
                    "id": "AIk5ERFt-7Z7JdUc0F94c7jn6Ikqs1qyURUjYQTVSgsgoW14Qo4fFIpDNOgprETEjA8xN2rcnwUEneYqLbc_vTlB9A6Limh25Q",
                    "x": -32,
                    "y": -27,
                    "width": 56,
                    "height": 56,
                    "transform": "matrix(1, -8.85254e-08, 8.85254e-08, 1, 40, 69.282)",
                    "clipPath": "30"
                },
                {
                    "target": "i9",
                    "id": "AIk5ERE_FnbvGaXYIemDbd9jzqSIPWR0UKjU2LxRGISzkFF5XejZJQFL582iS_XXtAvS9YDO9liF4knIcdVKWlG48xBGOIEgIg",
                    "x": -43,
                    "y": -29,
                    "width": 76,
                    "height": 76,
                    "transform": "matrix(1, 0, 0, 1, -40, 69.282)",
                    "clipPath": "30"
                },
                {
                    "target": "i10",
                    "id": "AIk5EREt8zGmYkVvEDDKaf533eeU8y5b21uFZCBmo9eywoJTIJOoyiQuE2rpvRCeL3xGH5VHNq-lQxlj2i5j-vBLGkpk-ePZCQ",
                    "x": -50,
                    "y": -50,
                    "width": 100,
                    "height": 100,
                    "transform": "matrix(1, 0, 0, 1, -80, 9.79717e-15)",
                    "clipPath": "30"
                },
                {
                    "target": "i11",
                    "id": "AIk5ERGwYXzsDD01kqLnG0_Sb0xpNMBLdJr_JdNzKEImXo31T-wEUaB34WAzDk5cVCItUO75ZuHQVO4HYwdVK8UVS1aU4L9xYg",
                    "x": -44,
                    "y": -40,
                    "width": 88,
                    "height": 88,
                    "transform": "matrix(1, 0, 0, 1, -40, -69.282)",
                    "clipPath": "30"
                },
                {
                    "target": "i12",
                    "id": "AIk5ERHSp7KJB5R-S8F2DdGsJw5Gj23TtignvGEkjFs3Irhp-t2R6nu93HcQ9FVNX4AFdZ6afxdQN0exdH548w2cZxXQwBrlrA",
                    "x": -50,
                    "y": -50,
                    "width": 100,
                    "height": 100,
                    "transform": "matrix(1, 0, 0, 1, 40, -69.282)",
                    "clipPath": "30"
                },
                {
                    "target": "i13",
                    "id": "AIk5ERFG5uhQI4cXzN9e4hNnj9aGu18kOUUkWT66AXIgeOw8ai7xm86GAI_K8wLREeNarpx_ughp_028a4JXZsFw6BUuuuUcHg",
                    "x": -30,
                    "y": -57,
                    "width": 102,
                    "height": 102,
                    "transform": "matrix(1, 0, 0, 1, 60.1888, 34.75)",
                    "clipPath": "30"
                },
                {
                    "target": "i14",
                    "id": "AIk5EREPxaNxvaGxLrN6AVdoKo9f0HBmWPzn-6KNKga8Fizqh19YFOTOPy5ff-3fAvTbdqPNKv5n1BHPc6yp_X_IQ0D6fR1DlQ",
                    "x": -38,
                    "y": -37,
                    "width": 76,
                    "height": 76,
                    "transform": "matrix(1, 0, 0, 1, 4.25565e-15, 69.5)",
                    "clipPath": "30"
                },
                {
                    "target": "i15",
                    "id": "AIk5ERFhluYws8E_4Sr7DX4tEE3Ju5iTiS52Pf-G6FNb2CA6cW8ovSsNxCpukTWLtBP-YkecB-HeHNXllSPFgFL5Heh7Rmn4Mw",
                    "x": -57,
                    "y": -45,
                    "width": 90,
                    "height": 90,
                    "transform": "matrix(1, 0, 0, 1, -60.1888, 34.75)",
                    "clipPath": "30"
                },
                {
                    "target": "i16",
                    "id": "AIk5ERER_Z7EGsyEdVxWPEZBsXGkXuvVZsEpk8Ce5wKSSzPuG0EdZ6jEE11-aSPctqzl-uRIRO65OJV8L7UPOPRbbmOGza0rzw",
                    "x": -29,
                    "y": -40,
                    "width": 70,
                    "height": 70,
                    "transform": "matrix(1, 0, 0, 1, -60.1888, -34.75)",
                    "clipPath": "30"
                },
                {
                    "target": "i17",
                    "id": "AIk5EREV5LgQoB3UVu6gEsQ8MEpOG1Yu066V0c2YHgWrDBUItpWnUpg896YTW6gPhaa4XOA4Qys3EMwO6jalZkuYbbgoD9O74w",
                    "x": -50,
                    "y": -50,
                    "width": 100,
                    "height": 100,
                    "transform": "matrix(1, 0, 0, 1, -1.27669e-14, -69.5)",
                    "clipPath": "30"
                },
                {
                    "target": "i18",
                    "id": "AIk5ERFK06chC6yH_uMdvGrNnbEuubxW1D0bA-M_9Qcrt0KRW8Tb27d7V72E8m2OejIVSkGlmyoF8Hdz_pTFB3gHahtClumYHw",
                    "x": -110,
                    "y": -87,
                    "width": 186,
                    "height": 186,
                    "transform": "matrix(1, 0, 0, 1, 60.1888, -34.75)",
                    "clipPath": "30"
                }
            ]
        },
        {
            "id": "2022-07-02",
            "title": "Nebraska",
            "data": [
                {
                    "id": "AIk5ERFCqpJJuqADXzNH313Yc8pupS4lc1hgFqu8gRy9MWhmp5JNoymBWQ0LnOLhHb9r_mPfmmBzjku-Sv5ATVvrui_Y65WqZg",
                    "target": "i0",
                    "x": -53,
                    "y": -43,
                    "width": 114,
                    "height": 114,
                    "transform": "",
                    "clipPath": "30"
                },
                {
                    "id": "AIk5EREjDfyCwiQMW7z0dv6XBQ12M13XiH49IFqvTD3cOzqvow7DGfuC-yRu8U_e_R0ArCs4sA-khMmPmn3-RXwlUkNtij2wHQ",
                    "target": "i1",
                    "x": -25,
                    "y": -25,
                    "width": 50,
                    "height": 50,
                    "transform": "matrix(1, 0, 0, 1, 40, 0)",
                    "clipPath": "30"
                },
                {
                    "id": "AIk5EREmpiFOgd0PnL-PsjH4KMF3iCOdg4-fuKf0ywjNv3MnxaETjLcz2k3dZ7_SaLujBz2PApG9C0pyxfxGqZSig33NNQ8VLg",
                    "target": "i2",
                    "x": -27,
                    "y": -30,
                    "width": 58,
                    "height": 58,
                    "transform": "matrix(1, 0, 0, 1, 20, 34.641)",
                    "clipPath": "30"
                },
                {
                    "id": "AIk5EREbSPjw3gdZpWpdFiqSb6hlI7LV5RzANzqWbSGbY6RBtS0qQbW160_YNqRXcrisjKG9-C-CAPP_kuc0xzACnaOoMRCrQw",
                    "target": "i3",
                    "x": -73,
                    "y": -48,
                    "width": 122,
                    "height": 122,
                    "transform": "matrix(1, 0, 0, 1, -20, 34.641)",
                    "clipPath": "30"
                },
                {
                    "id": "AIk5ERH8e5VumHBsOeaQSZs-cn8pNTfqD3SEyftHuQe30GpJSV75f6esONwY1f_BiK22E8bRTnNFt6Hc21cbvEbDBAkillkJTA",
                    "target": "i4",
                    "x": -25,
                    "y": -25,
                    "width": 44,
                    "height": 44,
                    "transform": "matrix(1, 0, 0, 1, -40, 4.89859e-15)",
                    "clipPath": "30"
                },
                {
                    "id": "AIk5EREOh-6996GVeywPqH_TBmSmhT7o6VCta2Zkubmg2zrcU_x-P1Hx-BImrhByCkbkdowPSivWF52HmgNPkvtmDWhdZLsT9w",
                    "target": "i5",
                    "x": -43,
                    "y": -52,
                    "width": 100,
                    "height": 100,
                    "transform": "matrix(1, 0, 0, 1, -20, -34.641)",
                    "clipPath": "30"
                },
                {
                    "id": "AIk5ERFhRWAJjvqy-kRwhj0lVyZVPxejsm_L78w9Or4cXx_uLj5g12omCReFcU4sWjxzqJbIpjCok79TapmoD_48Otphk435Mg",
                    "target": "i6",
                    "x": -25,
                    "y": -25,
                    "width": 50,
                    "height": 50,
                    "transform": "matrix(1, 0, 0, 1, 20, -34.641)",
                    "clipPath": "30"
                },
                {
                    "id": "AIk5ERHhmQ2zgiBUZSrYPpCktxr7IAyqYf_fMlfdMk0Ww5Z3H9nc2yYBNyDtO7P7HdJHgMjyqMex-UzTxX52IHSdSoVregE9Lw",
                    "target": "i7",
                    "x": -24,
                    "y": -24,
                    "width": 48,
                    "height": 48,
                    "transform": "matrix(1, 0, 0, 1, 80, 0)",
                    "clipPath": "30"
                },
                {
                    "id": "AIk5EREgRV-TvmwO7AKMsU-HwxDYwfYD6f061la9AFDKjfDqqxaxFEuooI79Kicfz3Bg4of_dby-6M30o5_oU62DD2awgzVmpA",
                    "target": "i8",
                    "x": -26,
                    "y": -32,
                    "width": 52,
                    "height": 52,
                    "transform": "matrix(1, 0, 0, 1, 40, 69.282)",
                    "clipPath": "30"
                },
                {
                    "id": "AIk5ERHZZxfeCEQENLvFSqEY66mMHovD8g5GG8020vkaUjb3P187q8K09xlucJ_GzPhicYHLS5X6Af8DTAFe6A4oiN7AqstN2w",
                    "target": "i9",
                    "x": -57,
                    "y": -43,
                    "width": 100,
                    "height": 100,
                    "transform": "matrix(1, 0, 0, 1, -40, 69.282)",
                    "clipPath": "30"
                },
                {
                    "id": "AIk5ERFWkcl7e6kW96nRDZGuEhV0jY4IHgeZE-15FqP4W3cbXEdPE2NCEtGR5T6yynzrkk9ZsKRYIkBf67Q3luMiJNclA7d4HQ",
                    "target": "i10",
                    "x": -24,
                    "y": -20,
                    "width": 48,
                    "height": 48,
                    "transform": "matrix(1, 0, 0, 1, -80, 9.79717e-15)",
                    "clipPath": "30"
                },
                {
                    "id": "AIk5EREFmz4Uh7kjczKdYvStqmzq7F1qyd8x_LDqCbd2eZmn-LZGdZaMEJPwV6ojMh0Hc0G4QfSILFDJrl3R2qzHj8RK1TQQOg",
                    "target": "i11",
                    "x": -65,
                    "y": -42,
                    "width": 100,
                    "height": 100,
                    "transform": "matrix(1, 0, 0, 1, -40, -69.282)",
                    "clipPath": "30"
                },
                {
                    "id": "AIk5EREqHAZmb5e2XDHRRiK35conyFfL442tXNNqwkOi96NCdpSwEH4EbhXoMT3-jc6uK8F5XFjbBTpNs93-0UHr97-qg9JXWA",
                    "target": "i12",
                    "x": -32,
                    "y": -27,
                    "width": 56,
                    "height": 56,
                    "transform": "matrix(1, 0, 0, 1, 40, -69.282)",
                    "clipPath": "30"
                },
                {
                    "id": "AIk5ERG6Li8N6_OB-mZuNTYLine1HL-gbcjqSdcbx0eNz27bgncXOsguVwsi_8ed7b7croDcSgkUlurlSMWBc_rmhCCbmxUtwA",
                    "target": "i13",
                    "x": -25,
                    "y": -26,
                    "width": 50,
                    "height": 50,
                    "transform": "matrix(1, 0, 0, 1, 60.1888, 34.75)",
                    "clipPath": "30"
                },
                {
                    "id": "AIk5EREHECPQLgP7domL_FGJ-N-NW4SXAY3eisedSO95NzlDM7GiutBWDln3TStScuSXu4KrrOiJ8EhllLjpmCREKPHBqe3XnA",
                    "target": "i14",
                    "x": -37,
                    "y": -29,
                    "width": 58,
                    "height": 58,
                    "transform": "matrix(1, 0, 0, 1, 4.25565e-15, 69.5)",
                    "clipPath": "30"
                },
                {
                    "id": "AIk5ERH1RzPtBQdIoMA8rqdA6A5zhzICvUK_FLswirWLo7ajGOBySWRPX0z-IE7kk2VPBbV0GgMGmQu_yVQfyqIfV5YujCZNWw",
                    "target": "i15",
                    "x": -31,
                    "y": -28,
                    "width": 54,
                    "height": 54,
                    "transform": "matrix(1, 0, 0, 1, -60.1888, 34.75)",
                    "clipPath": "30"
                },
                {
                    "id": "AIk5EREFmz4Uh7kjczKdYvStqmzq7F1qyd8x_LDqCbd2eZmn-LZGdZaMEJPwV6ojMh0Hc0G4QfSILFDJrl3R2qzHj8RK1TQQOg",
                    "target": "i16",
                    "x": -23,
                    "y": -57,
                    "width": 100,
                    "height": 100,
                    "transform": "matrix(1, 0, 0, 1, -60.1888, -34.75)",
                    "clipPath": "30"
                },
                {
                    "id": "AIk5EREK7zXlEPSHYB193SbxeTYIdFI2Jf2x-BLw_VY4w8-hghkdEfsyeCkw76fPgBaQr5tmNEz_gqQtd4NxmmFtkUma86ocLg",
                    "target": "i17",
                    "x": -46,
                    "y": -44,
                    "width": 100,
                    "height": 100,
                    "transform": "matrix(1, 0, 0, 1, -1.27669e-14, -69.5)",
                    "clipPath": "30"
                },
                {
                    "id": "AIk5EREdQIidtJVxTc68CSD02TlLUIovfhy1QMRn_vm8GXJkxr5NjHV9NdQd_OL3pRaBggMjzIBORSDT7zbB3JsMccg5TZUEHQ",
                    "target": "i18",
                    "x": -61,
                    "y": -45,
                    "width": 114,
                    "height": 114,
                    "transform": "matrix(1, 0, 0, 1, 60.1888, -34.75)",
                    "clipPath": "30"
                }
            ]
        },
        {
            "id": "2022-07-01",
            "title": "Tallgrass Prarie NP and Marysville KS",
            "data": [
                {
                    "id": "AIk5EREmCxbNunvJbnyM-v57SaklYYAKqrdVtJv1xmT9UygLenr1lBm05xzwhgpza-B2bsSEeFxy46c9112cGSVC6uBUa6jlIw",
                    "target": "i0",
                    "x": -28,
                    "y": -28,
                    "width": 58,
                    "height": 58,
                    "transform": "",
                    "clipPath": "30"
                },
                {
                    "id": "AIk5EREx1btL7WbGtLbWV1KOVeog-eHODeKiefqd98STss3xDcDo3_lMKpCvqIQYVT4G9Bw6sZUft7NxdqqYTrX2Kruuc2dsWA",
                    "target": "i1",
                    "x": -26,
                    "y": -27,
                    "width": 52,
                    "height": 52,
                    "transform": "matrix(1, 0, 0, 1, 40, 0)",
                    "clipPath": "30"
                },
                {
                    "id": "AIk5ERGrlWnd3ou1TUkdr89W5FVIpIoZw5nsNgYyzLl7nJFWijmvKf_8bntoEq-6I9VlQNM62lEz",
                    "target": "i2",
                    "x": -27,
                    "y": -30,
                    "width": 58,
                    "height": 58,
                    "transform": "matrix(1, 0, 0, 1, 20, 34.641)",
                    "clipPath": "30"
                },
                {
                    "id": "AIk5ERGiveKRAQOeFeRmpibjZEKcGW78GI6n_Ljgu0ptlPo1S0tUasr26Hj_0FX0vT0B1gipdtnMollgrglCpgcysQrYv6sNsw",
                    "target": "i3",
                    "x": -34,
                    "y": -24,
                    "width": 66,
                    "height": 66,
                    "transform": "matrix(1, 0, 0, 1, -20, 34.641)",
                    "clipPath": "30"
                },
                {
                    "id": "AIk5ERFGgBmy-i7mWenRL5-WPK3Nc-BPW9DGXZdmOYx45qjw5Ya6dHoFbgbGWtM0bzFVklayMNrU",
                    "target": "i4",
                    "x": -44,
                    "y": -54,
                    "width": 94,
                    "height": 94,
                    "transform": "matrix(1, 0, 0, 1, -40, 4.89859e-15)",
                    "clipPath": "30"
                },
                {
                    "id": "AIk5EREJUGtPmOa0he3ZDyskMHmPwLJuTUxyKcBoYpimbflBsMf6NhyD4fG4d5DtcYgBtrtcthdo",
                    "target": "i5",
                    "x": -57,
                    "y": -54,
                    "width": 128,
                    "height": 128,
                    "transform": "matrix(1, 0, 0, 1, -20, -34.641)",
                    "clipPath": "30"
                },
                {
                    "id": "AIk5ERH3nqOBJzmt1dzI9YVtGEHQJmmg8h0omceVoSLV2N9o_6djk9MT8PzQ4KcGqferxVTWTSii",
                    "target": "i6",
                    "x": -32,
                    "y": -42,
                    "width": 76,
                    "height": 76,
                    "transform": "matrix(1, 0, 0, 1, 20, -34.641)",
                    "clipPath": "30"
                },
                {
                    "id": "AIk5EREGlBZJ3lBjTrC6ND4oTXJ5VrlKBfC1ss_4EcIBK-R5Scs__oeq2coe3L5kOYAXejR-oqoVSaa6NyUY7y4J8T7sjYlb3g",
                    "target": "i7",
                    "x": -38,
                    "y": -44,
                    "width": 102,
                    "height": 102,
                    "transform": "matrix(1, 0, 0, 1, 80, 0)",
                    "clipPath": "30"
                },
                {
                    "id": "AIk5ERFTf0TBMY3rmwjVwg2PNAB3d8bkNsrCwdju4D_s8Es-3_0tdbBkj8nYdn9Pw0QGmaxgvv63",
                    "target": "i8",
                    "x": -25,
                    "y": -25,
                    "width": 50,
                    "height": 50,
                    "transform": "matrix(1, 0, 0, 1, 40, 69.282)",
                    "clipPath": "30"
                },
                {
                    "id": "AIk5ERGJktdvc-kxu63CdPECDmvu7svH_y-OZBEb5wSz_WQnU6QrEet190EQqUxTEoRwD4eA4G1qiAdE4L8l7RStkbnMbgTGZw",
                    "target": "i9",
                    "x": -40,
                    "y": -29,
                    "width": 72,
                    "height": 72,
                    "transform": "matrix(1, 0, 0, 1, -40, 69.282)",
                    "clipPath": "30"
                },
                {
                    "id": "AIk5ERGFKFN82JeCBJ7nnEV6bYgsY3ePm3TEOQuX3RjFE4LIpPfpezxRAzbXvyuAB_DNmGtRV4i_k0N8r9EDEHQxdx3mGfOXqw",
                    "target": "i10",
                    "x": -25,
                    "y": -25,
                    "width": 50,
                    "height": 50,
                    "transform": "matrix(1, 0, 0, 1, -80, 9.79717e-15)",
                    "clipPath": "30"
                },
                {
                    "id": "AIk5EREY4l_aR-W9yCA1uVdnT94ULQ1lWBTUstAR-p_eT3PBYdpDQ6iGQS3uyl_kxLagmRbi2M-l",
                    "target": "i11",
                    "x": -39,
                    "y": -31,
                    "width": 68,
                    "height": 68,
                    "transform": "matrix(1, 0, 0, 1, -40, -69.282)",
                    "clipPath": "30"
                },
                {
                    "id": "AIk5ERHyurod9B5VSi8Nv5V4eCd02_G3d2HqWVKMQ8z__Wniwf3YbI_dgvrxhW3iHUVNXMLRp833",
                    "target": "i12",
                    "x": -43,
                    "y": -37,
                    "width": 72,
                    "height": 72,
                    "transform": "matrix(1, 0, 0, 1, 40, -69.282)",
                    "clipPath": "30"
                },
                {
                    "id": "AIk5ERHRJK6Ag_AUqqFiDEu68qgzYEw1IrzRywz8UR5iXm-0-o0fjuPdi5fpLU75vAcB8zdwewuzH8mNnn-NEJdNk-a54hu9iA",
                    "target": "i13",
                    "x": -50,
                    "y": -33,
                    "width": 80,
                    "height": 80,
                    "transform": "matrix(1, 0, 0, 1, 60.1888, 34.75)",
                    "clipPath": "30"
                },
                {
                    "id": "AIk5ERGI3w0qDby2wdkiZRSkoJgSwBUFlVRr3kKDqs7CbXJBKx-y6e9KNdxmOHjr59ApJ3snS13O",
                    "target": "i14",
                    "x": -25,
                    "y": -25,
                    "width": 50,
                    "height": 50,
                    "transform": "matrix(1, 0, 0, 1, 4.25565e-15, 69.5)",
                    "clipPath": "30"
                },
                {
                    "id": "AIk5ERE43ja9ZLaQzx_ihJfXg1z6lcqjGjM7SGbGtal2oDz5mFQfaFkgkob5l8GV8biaiAa4GMBZ",
                    "target": "i15",
                    "x": -41,
                    "y": -90,
                    "width": 114,
                    "height": 114,
                    "transform": "matrix(1, 0, 0, 1, -60.1888, 34.75)",
                    "clipPath": "30"
                },
                {
                    "id": "AIk5ERFuVvWUA1G2AaxRvjhjA7LhzVFTIFM9Wj4FYx9r1qiDBx0jgrR0ZT3RZq_g9JmvT6jmlBru",
                    "target": "i16",
                    "x": -58,
                    "y": -75,
                    "width": 202,
                    "height": 202,
                    "transform": "matrix(1, 0, 0, 1, -60.1888, -34.75)",
                    "clipPath": "30"
                },
                {
                    "id": "AIk5EREGmytbvPC9-nlYeIdYXIIskXxX9_IKxeRWL564NKsCsgwLH3XiG9uruAvm6Z23DO1c2PZUzwLlYb0gBbzsOxKKQoAYbg",
                    "target": "i17",
                    "x": -66,
                    "y": -61,
                    "width": 126,
                    "height": 126,
                    "transform": "matrix(1, 0, 0, 1, -1.27669e-14, -69.5)",
                    "clipPath": "30"
                },
                {
                    "id": "AIk5EREbNet03tgRCVqBJV5kBla5G06NG9Xcc5i7Zp6UORVKrNXipPFn9dKEOWffnJCgNRSxh-Cw",
                    "target": "i18",
                    "x": -25,
                    "y": -25,
                    "width": 50,
                    "height": 50,
                    "transform": "matrix(1, 0, 0, 1, 60.1888, -34.75)",
                    "clipPath": "30"
                }
            ]
        },
        {
            "id": "2022-06-27",
            "title": "Wichita KS",
            "data": [
                {
                    "id": "AIk5EREPeKW_EHj6kl6Tu9XnOkOqojz3PfVfzg_hhWxocOlrIvUJUDeCORmwcmllHjbxJLlPMOuP",
                    "target": "i0",
                    "x": -52,
                    "y": -34,
                    "width": 80,
                    "height": 80,
                    "transform": "",
                    "clipPath": "30"
                },
                {
                    "id": "AIk5ERHN9KTTw3MLW6VzYG0oL4ojFBuJpMWmNK5vlyns62ewnB-5B8p0zyP8IgHyrgJAfHwpk-3Y",
                    "target": "i1",
                    "x": -47,
                    "y": -38,
                    "width": 72,
                    "height": 72,
                    "transform": "matrix(1, 0, 0, 1, 40, 0)",
                    "clipPath": "30"
                },
                {
                    "id": "AIk5ERELhKmBsZSyrCgZehLs6Suvwc1ogxa_Fz3EzaZjY2puGyn4X4vYXxR5zZlTqDW6zi8x_rtigA80RyAMl0ruUnq6ThwRbA",
                    "target": "i2",
                    "x": -34,
                    "y": -27,
                    "width": 86,
                    "height": 86,
                    "transform": "matrix(1, 0, 0, 1, 20, 34.641)",
                    "clipPath": "30"
                },
                {
                    "id": "AIk5ERFJNxKZvRwUQepjM5-ITAZ05MHvv7TJG1ksrOkn1mfNDk7Nj4Eha-S9hAHYhiNR0gP6aqF7",
                    "target": "i3",
                    "x": -25,
                    "y": -25,
                    "width": 50,
                    "height": 50,
                    "transform": "matrix(1, 0, 0, 1, -20, 34.641)",
                    "clipPath": "30"
                },
                {
                    "id": "AIk5ERE7drgnUSY4U1Q3D9pZLYfws9M74hn8c-TxXrNJDvZnCzMNwtExbx6Awh9fTz16mpHozh4h",
                    "target": "i4",
                    "x": -25,
                    "y": -25,
                    "width": 50,
                    "height": 50,
                    "transform": "matrix(1, 0, 0, 1, -40, 4.89859e-15)",
                    "clipPath": "30"
                },
                {
                    "id": "AIk5ERFVJIl-SvWM2liaJ7El3oPjLQl5pYczwPWFnwsxYGF4T6K3Hfk9GJCe_4zEOv6AsTKhb-NE",
                    "target": "i5",
                    "x": -46,
                    "y": -56,
                    "width": 128,
                    "height": 128,
                    "transform": "matrix(1, 0, 0, 1, -20, -34.641)",
                    "clipPath": "30"
                },
                {
                    "id": "AIk5ERFVJIl-SvWM2liaJ7El3oPjLQl5pYczwPWFnwsxYGF4T6K3Hfk9GJCe_4zEOv6AsTKhb-NE",
                    "target": "i6",
                    "x": -79,
                    "y": -54,
                    "width": 128,
                    "height": 128,
                    "transform": "matrix(1, 0, 0, 1, 20, -34.641)",
                    "clipPath": "30"
                },
                {
                    "id": "AIk5ERGEG78o8PBLC-fS-elig2ud0Mj-hN4_AbumCOIThJ_33Wa3l4gsU0Z695MQwBWxU29Inlep",
                    "target": "i7",
                    "x": -70,
                    "y": -51,
                    "width": 118,
                    "height": 118,
                    "transform": "matrix(1, 0, 0, 1, 80, 0)",
                    "clipPath": "30"
                },
                {
                    "id": "AIk5ERELhKmBsZSyrCgZehLs6Suvwc1ogxa_Fz3EzaZjY2puGyn4X4vYXxR5zZlTqDW6zi8x_rtigA80RyAMl0ruUnq6ThwRbA",
                    "target": "i8",
                    "x": -54,
                    "y": -61,
                    "width": 86,
                    "height": 86,
                    "transform": "matrix(1, 0, 0, 1, 40, 69.282)",
                    "clipPath": "30"
                },
                {
                    "id": "AIk5ERHzrxnI2aXEGbBZkctTU-zEJQGxVrRYJtqMYQ2J-Nfoj2WpeZi-Y5uZCSBp8o21lmRgCtEY06mkRkZ0jumtUkk-eCNAmg",
                    "target": "i9",
                    "x": -25,
                    "y": -25,
                    "width": 50,
                    "height": 50,
                    "transform": "matrix(1, 0, 0, 1, -40, 69.282)",
                    "clipPath": "30"
                },
                {
                    "id": "AIk5ERGEG78o8PBLC-fS-elig2ud0Mj-hN4_AbumCOIThJ_33Wa3l4gsU0Z695MQwBWxU29Inlep",
                    "target": "i10",
                    "x": -30,
                    "y": -56,
                    "width": 118,
                    "height": 118,
                    "transform": "matrix(1, 0, 0, 1, -80, 9.79717e-15)",
                    "clipPath": "30"
                },
                {
                    "id": "AIk5EREq44I89fT_IWqEYhcXN55dU5AWMUZLO01g7JR3_r_WNVsy0VeMHGM8eve20O16r41dNKl3",
                    "target": "i11",
                    "x": -63,
                    "y": -55,
                    "width": 114,
                    "height": 114,
                    "transform": "matrix(1, 0, 0, 1, -40, -69.282)",
                    "clipPath": "30"
                },
                {
                    "id": "AIk5ERH1mphrDmNlsUjSzGccgIubq_sGI-1kZmWKcOlXNcvtL94cOSs5qnWc7SQmVjnYLQ-_fQPRgCGohQGwnad2X6kI-Couew",
                    "target": "i12",
                    "x": -84,
                    "y": -55,
                    "width": 120,
                    "height": 120,
                    "transform": "matrix(1, 0, 0, 1, 40, -69.282)",
                    "clipPath": "30"
                },
                {
                    "id": "AIk5ERG0Ayk07oB820cVUSUwG8cj4NqQbpdUQHI426qfqnr6vggadIfWIcoV3rgoYJEhcx1s65GI",
                    "target": "i13",
                    "x": -37,
                    "y": -36,
                    "width": 70,
                    "height": 70,
                    "transform": "matrix(1, 0, 0, 1, 60.1888, 34.75)",
                    "clipPath": "30"
                },
                {
                    "id": "AIk5ERFJbEIpj3q7heYJHUgHMKC6QNt-VIzAba96pkAJcAIYUNdX1cce4juAowalHh61Te3FxHHwXhuegoQiNd8D-n4HaPSKSA",
                    "target": "i14",
                    "x": -25,
                    "y": -25,
                    "width": 50,
                    "height": 50,
                    "transform": "matrix(1, 0, 0, 1, 4.25565e-15, 69.5)",
                    "clipPath": "30"
                },
                {
                    "id": "AIk5ERHZwI9GJI25oel01Tuobu9nFypiXnEQP9NafQAXPTnopICpo3QoTWorIkXfvvnEFK3KJzWE",
                    "target": "i15",
                    "x": -25,
                    "y": -25,
                    "width": 50,
                    "height": 50,
                    "transform": "matrix(1, 0, 0, 1, -60.1888, 34.75)",
                    "clipPath": "30"
                },
                {
                    "id": "AIk5ERFRhOxYyIsVWnGijj_0TXND7aeK-7bdM_U-DQKE4E6JyI_pIkX0ENT4FsGwfPlCXR7P-au1",
                    "target": "i16",
                    "x": -47,
                    "y": -36,
                    "width": 104,
                    "height": 104,
                    "transform": "matrix(1, 0, 0, 1, -60.1888, -34.75)",
                    "clipPath": "30"
                },
                {
                    "id": "AIk5ERFqfaiPWOKy1TYzgFM7APVby5vcEPFwoeeis_Vp2kRc1m0kCDCD4VOHTP7u7TirtUOd_iw6",
                    "target": "i17",
                    "x": -35,
                    "y": -53,
                    "width": 110,
                    "height": 110,
                    "transform": "matrix(1, 0, 0, 1, -1.27669e-14, -69.5)",
                    "clipPath": "30"
                },
                {
                    "id": "AIk5ERGNKnrjVtq0XTL9m9tYJ6_iYiIM7HKf61jRw1M8ZkxGWAGdZJ4VV0vf28FqoC0cKvkU5Mm75sebR39NcflBqCYI_X3AYg",
                    "target": "i18",
                    "x": -36,
                    "y": -29,
                    "width": 72,
                    "height": 72,
                    "transform": "matrix(1, 0, 0, 1, 60.1888, -34.75)",
                    "clipPath": "30"
                }
            ]
        },
        {
            "id": "2022-06-26",
            "title": "Leaving Greenville",
            "data": [
                {
                    "target": "i0",
                    "id": "AIk5ERGcaLIgFEPsWux1GWuGqPVS_NrJYfO77m6bO3ZmMG6j78MU9vWRc5D0_4cAqVzECgtyYb90",
                    "x": -53,
                    "y": -35,
                    "width": 78,
                    "height": 78,
                    "transform": "",
                    "clipPath": "30"
                },
                {
                    "target": "i1",
                    "id": "AIk5ERHgKNkG0HcwJtGQReKtVNY_uQlFg2D-kokgVCVvjz5VDTPySqEKaArdBohFOL7HmA7gQUihV3g5ycG4-g6OEkUu0SaTlA",
                    "x": -25,
                    "y": -25,
                    "width": 50,
                    "height": 50,
                    "transform": "matrix(1, 0, 0, 1, 40, 0)",
                    "clipPath": "30"
                },
                {
                    "target": "i2",
                    "id": "AIk5ERENk44UmBuW5MtStpzi9QSLiS_765JuBsn0VV-H-hPLqdI09OEcNDsgzCN6VHJ-eSDaPM0ei8iEWLYk0j3osJlJjKdIHw",
                    "x": -58,
                    "y": -81,
                    "width": 130,
                    "height": 130,
                    "transform": "matrix(1, 0, 0, 1, 20, 34.641)",
                    "clipPath": "30"
                },
                {
                    "target": "i3",
                    "id": "AIk5ERGGIKyyrMvwBbgkZoAl769QnQtf0XpQXR1RL5fGLT_o2T4xiE-YFzAucOjDUOI2JVXZPrgN-7cuHASXKlcINRmkabYAHg",
                    "x": -26,
                    "y": -29,
                    "width": 56,
                    "height": 56,
                    "transform": "matrix(1, 0, 0, 1, -20, 34.641)",
                    "clipPath": "30"
                },
                {
                    "target": "i4",
                    "id": "AIk5ERGx2ociGEK9rh2FxUdZvK-dln8jeYuPb6deOZgKiNheUoU1FmnS8iq_ay2-8sxNN3KrMK_4rP-DFfnhPvSZDznksckxLQ",
                    "x": -25,
                    "y": -25,
                    "width": 50,
                    "height": 50,
                    "transform": "matrix(1, 0, 0, 1, -40, 4.89859e-15)",
                    "clipPath": "30"
                },
                {
                    "target": "i5",
                    "id": "AIk5ERFPY6OB--YrnS5WfGE6GQJcd_pqMiYWKsfQM34kf1A6Th6VrI7XseiXJ8V8YBLQ7dzEWBiM",
                    "x": -33,
                    "y": -42,
                    "width": 66,
                    "height": 66,
                    "transform": "matrix(1, 0, 0, 1, -20, -34.641)",
                    "clipPath": "30"
                },
                {
                    "target": "i6",
                    "id": "AIk5ERENLM7Vv4-pA3p4atK8tEwSpNHaY1V3WQsBgzEPLo39UdQqQG6JXbuDrM7TN267y1vt4t3jRCA16aLG3SsQjHM5qwgHIQ",
                    "x": -25,
                    "y": -25,
                    "width": 50,
                    "height": 50,
                    "transform": "matrix(1, 0, 0, 1, 20, -34.641)",
                    "clipPath": "30"
                },
                {
                    "target": "i7",
                    "id": "AIk5ERHkwRQeA306LaihQTI3qkgqHNJf8MlU8B5VSmzx9FC4r-b59xWRrk6MozLcmBZLgwjNvJ2n5eQv2DTpwdDpDz5Ryqb1JQ",
                    "x": -68,
                    "y": -56,
                    "width": 114,
                    "height": 114,
                    "transform": "matrix(1, 0, 0, 1, 80, 0)",
                    "clipPath": "30"
                },
                {
                    "target": "i8",
                    "id": "AIk5ERHB26YoEI7rVWyaPVhzVvASb4LacMCdTFlT--Eer0aXQqmSr_dH3ZdRTTKNoroi8HiEgIZI5xktVNwSzRNLAXRw7VbTgA",
                    "x": -33,
                    "y": -37,
                    "width": 66,
                    "height": 66,
                    "transform": "matrix(1, 0, 0, 1, 40, 69.282)",
                    "clipPath": "30"
                },
                {
                    "target": "i9",
                    "id": "AIk5ERH6_eAug5spR1KOSlKfn7XOWTLg9Fa4k2FW2ctXgw681-tVGTyP1xy0OCvKfDG0ZzyHp24rZREKm7OgEcd4_0-dbFzPGg",
                    "x": -32,
                    "y": -39,
                    "width": 62,
                    "height": 62,
                    "transform": "matrix(0.00457789, -0.999989, 0.999989, 0.00457789, -40, 69.282)",
                    "clipPath": "0"
                },
                {
                    "target": "i10",
                    "id": "AIk5ERHIJAPOawrdlDGVVOs-DZndecbtO_UYU6OUKOcxoTixh-ZxVwtYPGJVDknBZKonHUQ8Ngz0koopIDAdUFrf7Q6Y482PGw",
                    "x": -52,
                    "y": -40,
                    "width": 84,
                    "height": 84,
                    "transform": "matrix(1, 0, 0, 1, -80, 9.79717e-15)",
                    "clipPath": "30"
                },
                {
                    "target": "i11",
                    "id": "AIk5ERH8a8inyM92XStceGovWlBDkvuCBC3OLo9ErOLUjzYTuSA4jgLGPd7p-rHm-7m6Fh8U47ahVxrGc9TeTqB6bKF1rni_QA",
                    "x": -63,
                    "y": -53,
                    "width": 122,
                    "height": 122,
                    "transform": "matrix(1, 0, 0, 1, -40, -69.282)",
                    "clipPath": "30"
                },
                {
                    "target": "i12",
                    "id": "AIk5ERFudiXEn1UPT7Eq75KW5hprJLul0sMowcER9VQEoA2jhxI4qlpzJw9lqXR18IknFUL1nqm5V801CgNRqy0-xui9Bq_RVQ",
                    "x": -26,
                    "y": -24,
                    "width": 52,
                    "height": 52,
                    "transform": "matrix(1, 0, 0, 1, 40, -69.282)",
                    "clipPath": "30"
                },
                {
                    "target": "i13",
                    "id": "AIk5EREOa11aMm3AEYrPfO5eqrbjdbfsh_ZXzr-kxmKlt6sv28-5uHqet4wVfVVvkl9Mux2eizm3OfU87gJgnTKuZuW9ODDMhA",
                    "x": -34,
                    "y": -50,
                    "width": 72,
                    "height": 72,
                    "transform": "matrix(1, 0, 0, 1, 60.1888, 34.75)",
                    "clipPath": "30"
                },
                {
                    "target": "i14",
                    "id": "AIk5EREjonQ4ovpHyfBIdiZGh9YTG0EqtW_8QjGXw3FpktY3ycaJCDV6TuC4j-TuRxyfxzbk48N9ibvA8TCOmp2IHJeQle13oQ",
                    "x": -50,
                    "y": -50,
                    "width": 100,
                    "height": 100,
                    "transform": "matrix(1, 0, 0, 1, 4.25565e-15, 69.5)",
                    "clipPath": "30"
                },
                {
                    "target": "i15",
                    "id": "AIk5ERGans84Zg_TZ2pssI3afP6UL4RTvwcOTGJg0Eqju89g93YxB42wDmd9KxzGRRAUdzEDuTJ4jY2afsC1DD5cVMisaJeP5w",
                    "x": -37,
                    "y": -31,
                    "width": 58,
                    "height": 58,
                    "transform": "matrix(1, 0, 0, 1, -60.1888, 34.75)",
                    "clipPath": "30"
                },
                {
                    "target": "i16",
                    "id": "AIk5ERGIQZLEtBYTvPNeYI4zzwCqrqz2MD8Y2F3dwH7zVkAz7cs-q2zvOZy4XJ-RpMpv3xD8Y2jZ8L5f6JKmj4FQ-c5zk3d6Fw",
                    "x": -12,
                    "y": -11,
                    "width": 22,
                    "height": 22,
                    "transform": "matrix(1, 0, 0, 1, -60.1888, -34.75)",
                    "clipPath": "30"
                },
                {
                    "target": "i17",
                    "id": "AIk5EREnGsgh2I0TkR5TiCYBx677skTe1Y--aiA9vDL7FU2d7MsMgqGwC9NeTxRDKAm1BYJLZGZnENOf_vc96xqkMpK-B9Cw9A",
                    "x": -41,
                    "y": -30,
                    "width": 64,
                    "height": 64,
                    "transform": "matrix(1, 0, 0, 1, -1.27669e-14, -69.5)",
                    "clipPath": "30"
                },
                {
                    "target": "i18",
                    "id": "AIk5ERGgra2xTjsCZ7siN2-XbnezfoxpdN7c4WbZFWdWloEwPaYyHhlDyD4W7pSQyGI4M6735wAnTD5jSOsLSS8lGCfJbKFf2A",
                    "x": -41,
                    "y": -32,
                    "width": 64,
                    "height": 64,
                    "transform": "matrix(1, 0, 0, 1, 60.1888, -34.75)",
                    "clipPath": "30"
                }
            ]
        },
    ].sort((a, b) => a.id.localeCompare(b.id))

collages.push({ id: "next", title: "next", data: [] })


function injectClipPath(id: string, body: string) {
    svgClipPaths.update(p => [...p, { id, body }])
    return id;
}

function injectRect(id: string, x: number, y: number, width: number, height: number) {
    const body = `<rect x="${x}" y="${y}" width="${width}" height="${height}"/>`
    svgClipPaths.update(p => [...p, { id, body }]);
    return id;
}

function injectPath(id: string, d: string) {
    const body = `<path d="${d}"/>`
    svgClipPaths.update(p => [...p, { id, body }]);
    return id;
}

const dummy = document.createElement("div")
document.body.appendChild(dummy)

function getEffectiveTransform(data: HexagonData) {
    dummy.style.transform = data.transform
    const { transform } = getComputedStyle(dummy)
    return transform === "none" ? "" : transform
}

export { transforms, collages, getEffectiveTransform }

