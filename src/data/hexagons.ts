export type Hexagon = {
    id: string
    data: {
        target: string
        href: string
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
    }[]
}



const transforms = {
    "spiral-19": [{ "i": 0, "style": "" }, { "i": 1, "style": "rotate(0deg) translate(40px, 0) rotate(0deg)" }, { "i": 2, "style": "rotate(60deg) translate(40px, 0) rotate(-60deg)" }, { "i": 3, "style": "rotate(120deg) translate(40px, 0) rotate(-120deg)" }, { "i": 4, "style": "rotate(180deg) translate(40px, 0) rotate(-180deg)" }, { "i": 5, "style": "rotate(240deg) translate(40px, 0) rotate(-240deg)" }, { "i": 6, "style": "rotate(300deg) translate(40px, 0) rotate(-300deg)" }, { "i": 7, "style": "rotate(0deg) translate(80px, 0) rotate(-0deg) " }, { "i": 8, "style": "rotate(60deg) translate(80px, 0) rotate(-60deg) " }, { "i": 9, "style": "rotate(120deg) translate(80px, 0) rotate(-120deg) " }, { "i": 10, "style": "rotate(180deg) translate(80px, 0) rotate(-180deg) " }, { "i": 11, "style": "rotate(240deg) translate(80px, 0) rotate(-240deg) " }, { "i": 12, "style": "rotate(300deg) translate(80px, 0) rotate(-300deg) " }, { "i": 13, "style": "rotate(30deg) translate(69.5px, 0) rotate(-30deg)" }, { "i": 14, "style": "rotate(90deg) translate(69.5px, 0) rotate(-90deg)" }, { "i": 15, "style": "rotate(150deg) translate(69.5px, 0) rotate(-150deg)" }, { "i": 16, "style": "rotate(210deg) translate(69.5px, 0) rotate(-210deg)" }, { "i": 17, "style": "rotate(270deg) translate(69.5px, 0) rotate(-270deg)" }, { "i": 18, "style": "rotate(330deg) translate(69.5px, 0) rotate(-330deg)" }],
}

const hexagons: Array<Hexagon> =
    [
        { id: "phase-5", data: [] },

        {
            "id": "phase-4",
            "data": [
                {
                    "target": "i0",
                    "href": "PXL_20220701_165259073.jpg",
                    "x": -28,
                    "y": -28,
                    "width": 58,
                    "height": 58,
                    "transform": "",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "target": "i1",
                    "href": "PXL_20220701_004332161.jpg",
                    "x": -26,
                    "y": -27,
                    "width": 52,
                    "height": 52,
                    "transform": "matrix(1, 0, 0, 1, 40, 0)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "target": "i2",
                    "href": "PXL_20220701_004215987.jpg",
                    "x": -27,
                    "y": -30,
                    "width": 58,
                    "height": 58,
                    "transform": "matrix(1, 0, 0, 1, 20, 34.641)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "target": "i3",
                    "href": "PXL_20220701_010044803.jpg",
                    "x": -34,
                    "y": -24,
                    "width": 66,
                    "height": 66,
                    "transform": "matrix(1, 0, 0, 1, -20, 34.641)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "target": "i4",
                    "href": "DSC_7415.JPG",
                    "x": -44,
                    "y": -54,
                    "width": 94,
                    "height": 94,
                    "transform": "matrix(1, 0, 0, 1, -40, 4.89859e-15)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "target": "i5",
                    "href": "DSC_7434.JPG",
                    "x": -57,
                    "y": -54,
                    "width": 128,
                    "height": 128,
                    "transform": "matrix(1, 0, 0, 1, -20, -34.641)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "target": "i6",
                    "href": "DSC_7442.JPG",
                    "x": -25,
                    "y": -25,
                    "width": 50,
                    "height": 50,
                    "transform": "matrix(1, 0, 0, 1, 20, -34.641)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "target": "i7",
                    "href": "PXL_20220701_002511651.jpg",
                    "x": -38,
                    "y": -44,
                    "width": 102,
                    "height": 102,
                    "transform": "matrix(1, 0, 0, 1, 80, 0)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "target": "i8",
                    "href": "PXL_20220701_005105996.jpg",
                    "x": -25,
                    "y": -25,
                    "width": 50,
                    "height": 50,
                    "transform": "matrix(1, 0, 0, 1, 40, 69.282)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "target": "i9",
                    "href": "PXL_20220701_005427545.jpg",
                    "x": -40,
                    "y": -29,
                    "width": 72,
                    "height": 72,
                    "transform": "matrix(1, 0, 0, 1, -40, 69.282)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "target": "i10",
                    "href": "PXL_20220701_185631582.jpg",
                    "x": -25,
                    "y": -25,
                    "width": 50,
                    "height": 50,
                    "transform": "matrix(1, 0, 0, 1, -80, 9.79717e-15)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "target": "i11",
                    "href": "DSC_7408.JPG",
                    "x": -39,
                    "y": -31,
                    "width": 68,
                    "height": 68,
                    "transform": "matrix(1, 0, 0, 1, -40, -69.282)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "target": "i12",
                    "href": "IMG_1611.HEIC",
                    "x": -43,
                    "y": -37,
                    "width": 72,
                    "height": 72,
                    "transform": "matrix(1, 0, 0, 1, 40, -69.282)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "target": "i13",
                    "href": "PXL_20220630_231322926.jpg",
                    "x": -25,
                    "y": -25,
                    "width": 50,
                    "height": 50,
                    "transform": "matrix(1, 0, 0, 1, 60.1888, 34.75)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "target": "i14",
                    "href": "PXL_20220701_010202280.jpg",
                    "x": -25,
                    "y": -25,
                    "width": 50,
                    "height": 50,
                    "transform": "matrix(1, 0, 0, 1, 4.25565e-15, 69.5)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "target": "i15",
                    "href": "DSC_7452.JPG",
                    "x": -41,
                    "y": -90,
                    "width": 114,
                    "height": 114,
                    "transform": "matrix(1, 0, 0, 1, -60.1888, 34.75)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "target": "i16",
                    "href": "DSC_7420.JPG",
                    "x": -58,
                    "y": -75,
                    "width": 202,
                    "height": 202,
                    "transform": "matrix(1, 0, 0, 1, -60.1888, -34.75)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "target": "i17",
                    "href": "PXL_20220630_171624176.jpg",
                    "x": -66,
                    "y": -61,
                    "width": 126,
                    "height": 126,
                    "transform": "matrix(1, 0, 0, 1, -1.27669e-14, -69.5)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "target": "i18",
                    "href": "PXL_20220701_011554969.jpg",
                    "x": -25,
                    "y": -25,
                    "width": 50,
                    "height": 50,
                    "transform": "matrix(1, 0, 0, 1, 60.1888, -34.75)",
                    "clipPath": "url(#clip_30)"
                }
            ]
        },


        {
            "id": "phase-3",
            "data": [
                {
                    "target": "i0",
                    "href": "DSC_7382.JPG",
                    "x": -52,
                    "y": -34,
                    "width": 80,
                    "height": 80,
                    "transform": "",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "target": "i1",
                    "href": "DSC_7374.JPG",
                    "x": -47,
                    "y": -38,
                    "width": 72,
                    "height": 72,
                    "transform": "matrix(1, 0, 0, 1, 40, 0)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "target": "i2",
                    "href": "PXL_20220627_201908273.jpg",
                    "x": -34,
                    "y": -27,
                    "width": 86,
                    "height": 86,
                    "transform": "matrix(1, 0, 0, 1, 20, 34.641)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "target": "i3",
                    "href": "PXL_20220630_160124614.jpg",
                    "x": -25,
                    "y": -25,
                    "width": 50,
                    "height": 50,
                    "transform": "matrix(1, 0, 0, 1, -20, 34.641)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "target": "i4",
                    "href": "DSC_7354.JPG",
                    "x": -25,
                    "y": -25,
                    "width": 50,
                    "height": 50,
                    "transform": "matrix(1, 0, 0, 1, -40, 4.89859e-15)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "target": "i5",
                    "href": "DSC_7366.JPG",
                    "x": -46,
                    "y": -56,
                    "width": 128,
                    "height": 128,
                    "transform": "matrix(1, 0, 0, 1, -20, -34.641)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "target": "i6",
                    "href": "DSC_7366.JPG",
                    "x": -79,
                    "y": -54,
                    "width": 128,
                    "height": 128,
                    "transform": "matrix(1, 0, 0, 1, 20, -34.641)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "target": "i7",
                    "href": "DSC_7361.JPG",
                    "x": -70,
                    "y": -51,
                    "width": 118,
                    "height": 118,
                    "transform": "matrix(1, 0, 0, 1, 80, 0)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "target": "i8",
                    "href": "PXL_20220627_201908273.jpg",
                    "x": -54,
                    "y": -61,
                    "width": 86,
                    "height": 86,
                    "transform": "matrix(1, 0, 0, 1, 40, 69.282)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "target": "i9",
                    "href": "PXL_20220627_165207638.jpg",
                    "x": -25,
                    "y": -25,
                    "width": 50,
                    "height": 50,
                    "transform": "matrix(1, 0, 0, 1, -40, 69.282)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "target": "i10",
                    "href": "DSC_7361.JPG",
                    "x": -30,
                    "y": -56,
                    "width": 118,
                    "height": 118,
                    "transform": "matrix(1, 0, 0, 1, -80, 9.79717e-15)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "target": "i11",
                    "href": "DSC_7349.JPG",
                    "x": -63,
                    "y": -55,
                    "width": 114,
                    "height": 114,
                    "transform": "matrix(1, 0, 0, 1, -40, -69.282)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "target": "i12",
                    "href": "PXL_20220628_022815898.jpg",
                    "x": -84,
                    "y": -55,
                    "width": 120,
                    "height": 120,
                    "transform": "matrix(1, 0, 0, 1, 40, -69.282)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "target": "i13",
                    "href": "DSC_7367.JPG",
                    "x": -37,
                    "y": -36,
                    "width": 70,
                    "height": 70,
                    "transform": "matrix(1, 0, 0, 1, 60.1888, 34.75)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "target": "i14",
                    "href": "PXL_20220629_140431696.jpg",
                    "x": -25,
                    "y": -25,
                    "width": 50,
                    "height": 50,
                    "transform": "matrix(1, 0, 0, 1, 4.25565e-15, 69.5)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "target": "i15",
                    "href": "IMG_1577.HEIC",
                    "x": -25,
                    "y": -25,
                    "width": 50,
                    "height": 50,
                    "transform": "matrix(1, 0, 0, 1, -60.1888, 34.75)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "target": "i16",
                    "href": "DSC_7369.JPG",
                    "x": -47,
                    "y": -36,
                    "width": 104,
                    "height": 104,
                    "transform": "matrix(1, 0, 0, 1, -60.1888, -34.75)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "target": "i17",
                    "href": "DSC_7343.JPG",
                    "x": -35,
                    "y": -53,
                    "width": 110,
                    "height": 110,
                    "transform": "matrix(1, 0, 0, 1, -1.27669e-14, -69.5)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "target": "i18",
                    "href": "PXL_20220628_211804556.jpg",
                    "x": -36,
                    "y": -29,
                    "width": 72,
                    "height": 72,
                    "transform": "matrix(1, 0, 0, 1, 60.1888, -34.75)",
                    "clipPath": "url(#clip_30)"
                }
            ]
        },



        {
            "id": "phase-2",
            "data": [
                {
                    "target": "i0",
                    "href": "DSC_7331.JPG",
                    "x": -53,
                    "y": -35,
                    "width": 78,
                    "height": 78,
                    "transform": "",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "target": "i1",
                    "href": "PXL_20220626_160006532.jpg",
                    "x": -25,
                    "y": -25,
                    "width": 50,
                    "height": 50,
                    "transform": "matrix(1, 0, 0, 1, 40, 0)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "target": "i2",
                    "href": "PXL_20220626_201607540.jpg",
                    "x": -58,
                    "y": -81,
                    "width": 130,
                    "height": 130,
                    "transform": "matrix(1, 0, 0, 1, 20, 34.641)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "target": "i3",
                    "href": "PXL_20220625_125912191.jpg",
                    "x": -25,
                    "y": -25,
                    "width": 50,
                    "height": 50,
                    "transform": "matrix(1, 0, 0, 1, -20, 34.641)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "target": "i4",
                    "href": "PXL_20220625_195625272.jpg",
                    "x": -25,
                    "y": -25,
                    "width": 50,
                    "height": 50,
                    "transform": "matrix(1, 0, 0, 1, -40, 4.89859e-15)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "target": "i5",
                    "href": "IMG_1542.HEIC",
                    "x": -33,
                    "y": -42,
                    "width": 66,
                    "height": 66,
                    "transform": "matrix(1, 0, 0, 1, -20, -34.641)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "target": "i6",
                    "href": "PXL_20220626_160809779.jpg",
                    "x": -25,
                    "y": -25,
                    "width": 50,
                    "height": 50,
                    "transform": "matrix(1, 0, 0, 1, 20, -34.641)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "target": "i7",
                    "href": "PXL_20220626_215636926.jpg",
                    "x": -68,
                    "y": -56,
                    "width": 114,
                    "height": 114,
                    "transform": "matrix(1, 0, 0, 1, 80, 0)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "target": "i8",
                    "href": "PXL_20220624_151818573.jpg",
                    "x": -33,
                    "y": -37,
                    "width": 66,
                    "height": 66,
                    "transform": "matrix(1, 0, 0, 1, 40, 69.282)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "target": "i9",
                    "href": "PXL_20220625_010308251.jpg",
                    "x": -32,
                    "y": -39,
                    "width": 62,
                    "height": 62,
                    "transform": "matrix(2.01892e-07, -1, 1, 2.01892e-07, -40, 69.282)",
                    "clipPath": "url(#clip_0)"
                },
                {
                    "target": "i10",
                    "href": "PXL_20220625_200351090.jpg",
                    "x": -52,
                    "y": -40,
                    "width": 84,
                    "height": 84,
                    "transform": "matrix(1, 0, 0, 1, -80, 9.79717e-15)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "target": "i11",
                    "href": "PXL_20220625_233200894.jpg",
                    "x": -63,
                    "y": -53,
                    "width": 122,
                    "height": 122,
                    "transform": "matrix(1, 0, 0, 1, -40, -69.282)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "target": "i12",
                    "href": "PXL_20220626_011400211.jpg",
                    "x": -26,
                    "y": -24,
                    "width": 52,
                    "height": 52,
                    "transform": "matrix(1, 0, 0, 1, 40, -69.282)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "target": "i13",
                    "href": "PXL_20220626_013223840.jpg",
                    "x": -34,
                    "y": -50,
                    "width": 72,
                    "height": 72,
                    "transform": "matrix(1, 0, 0, 1, 60.1888, 34.75)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "target": "i14",
                    "href": "PXL_20220624_151825418.jpg",
                    "x": -50,
                    "y": -50,
                    "width": 100,
                    "height": 100,
                    "transform": "matrix(1, 0, 0, 1, 4.25565e-15, 69.5)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "target": "i15",
                    "href": "PXL_20220625_161525273.jpg",
                    "x": -37,
                    "y": -31,
                    "width": 58,
                    "height": 58,
                    "transform": "matrix(1, 0, 0, 1, -60.1888, 34.75)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "target": "i16",
                    "href": "PXL_20220625_233124349.jpg",
                    "x": -12,
                    "y": -11,
                    "width": 22,
                    "height": 22,
                    "transform": "matrix(1, 0, 0, 1, -60.1888, -34.75)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "target": "i17",
                    "href": "PXL_20220625_104429130.jpg",
                    "x": -41,
                    "y": -30,
                    "width": 64,
                    "height": 64,
                    "transform": "matrix(1, 0, 0, 1, -1.27669e-14, -69.5)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "target": "i18",
                    "href": "PXL_20220626_215522749.jpg",
                    "x": -41,
                    "y": -32,
                    "width": 64,
                    "height": 64,
                    "transform": "matrix(1, 0, 0, 1, 60.1888, -34.75)",
                    "clipPath": "url(#clip_30)"
                }
            ]
        },




        {
            "id": "phase-1",
            "data": [
                {
                    "target": "i0",
                    "href": "PXL_20220629_140431696.jpg",
                    "x": -38,
                    "y": -39,
                    "width": 82,
                    "height": 82,
                    "transform": "",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "target": "i1",
                    "href": "PXL_20220628_190953569.jpg",
                    "x": -25,
                    "y": -25,
                    "width": 50,
                    "height": 50,
                    "transform": "matrix(1, 0, 0, 1, 40, 0)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "target": "i2",
                    "href": "PXL_20220628_022815898.jpg",
                    "x": -84,
                    "y": -57,
                    "width": 122,
                    "height": 122,
                    "transform": "matrix(1, 0, 0, 1, 20, 34.641)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "target": "i3",
                    "href": "PXL_20220628_022815898.jpg",
                    "x": -45,
                    "y": -59,
                    "width": 122,
                    "height": 122,
                    "transform": "matrix(1, 0, 0, 1, -20, 34.641)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "target": "i4",
                    "href": "PXL_20220626_201607540.jpg",
                    "x": -55,
                    "y": -75,
                    "width": 120,
                    "height": 120,
                    "transform": "matrix(1, 0, 0, 1, -40, 4.89859e-15)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "target": "i5",
                    "href": "DSC_7331.JPG",
                    "x": -25,
                    "y": -25,
                    "width": 50,
                    "height": 50,
                    "transform": "matrix(1, 0, 0, 1, -20, -34.641)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "target": "i6",
                    "href": "PXL_20220626_193024587.jpg",
                    "x": -25,
                    "y": -25,
                    "width": 50,
                    "height": 50,
                    "transform": "matrix(1, 0, 0, 1, 20, -34.641)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "target": "i7",
                    "href": "PXL_20220626_011400211.jpg",
                    "x": -32,
                    "y": -24,
                    "width": 50,
                    "height": 50,
                    "transform": "matrix(1, 0, 0, 1, 80, 0)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "target": "i8",
                    "href": "PXL_20220626_160809779.jpg",
                    "x": -48,
                    "y": -36,
                    "width": 78,
                    "height": 78,
                    "transform": "matrix(1, 0, 0, 1, 40, 69.282)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "target": "i9",
                    "href": "PXL_20220627_201908273.jpg",
                    "x": -48,
                    "y": -55,
                    "width": 76,
                    "height": 76,
                    "transform": "matrix(1, 0, 0, 1, -40, 69.282)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "target": "i10",
                    "href": "DSC_7369.JPG",
                    "x": -46,
                    "y": -35,
                    "width": 98,
                    "height": 98,
                    "transform": "matrix(1, 0, 0, 1, -80, 9.79717e-15)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "target": "i11",
                    "href": "DSC_7365.JPG",
                    "x": -50,
                    "y": -56,
                    "width": 140,
                    "height": 140,
                    "transform": "matrix(1, 0, 0, 1, -40, -69.282)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "target": "i12",
                    "href": "DSC_7365.JPG",
                    "x": -77,
                    "y": -52,
                    "width": 126,
                    "height": 126,
                    "transform": "matrix(1, 0, 0, 1, 40, -69.282)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "target": "i13",
                    "href": "DSC_7313.JPG",
                    "x": -32,
                    "y": -36,
                    "width": 68,
                    "height": 68,
                    "transform": "matrix(1, 0, 0, 1, 60.1888, 34.75)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "target": "i14",
                    "href": "PXL_20220624_151818573.jpg",
                    "x": -29,
                    "y": -29,
                    "width": 58,
                    "height": 58,
                    "transform": "matrix(1, 0, 0, 1, 4.25565e-15, 69.5)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "target": "i15",
                    "href": "PXL_20220627_201908273.jpg",
                    "x": -31,
                    "y": -21,
                    "width": 76,
                    "height": 76,
                    "transform": "matrix(1, 0, 0, 1, -60.1888, 34.75)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "target": "i16",
                    "href": "PXL_20220627_165129391.jpg",
                    "x": -25,
                    "y": -25,
                    "width": 50,
                    "height": 50,
                    "transform": "matrix(1, 0, 0, 1, -60.1888, -34.75)",
                    "clipPath": "url(#clip_30)",
                },
                {
                    "target": "i17",
                    "href": "DSC_7367.JPG",
                    "x": -34,
                    "y": -33,
                    "width": 64,
                    "height": 64,
                    "transform": "matrix(1, 0, 0, 1, -1.27669e-14, -69.5)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "target": "i18",
                    "href": "PXL_20220628_231009770.jpg",
                    "x": -37,
                    "y": -54,
                    "width": 120,
                    "height": 120,
                    "transform": "matrix(1, 0, 0, 1, 60.1888, -34.75)",
                    "clipPath": "url(#clip_30)"
                }
            ]
        },

    ]

export { transforms, hexagons }