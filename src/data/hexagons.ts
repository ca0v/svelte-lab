export type Photo = {
    id: string
    filename: string
    url: string
    created: string
    width: number
    height: number
}

export type Hexagon = {
    id: string
    title: string
    data: {
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
    }[]
}

const transforms = {
    "spiral-19": [{ "i": 0, "style": "" }, { "i": 1, "style": "rotate(0deg) translate(40px, 0) rotate(0deg)" }, { "i": 2, "style": "rotate(60deg) translate(40px, 0) rotate(-60deg)" }, { "i": 3, "style": "rotate(120deg) translate(40px, 0) rotate(-120deg)" }, { "i": 4, "style": "rotate(180deg) translate(40px, 0) rotate(-180deg)" }, { "i": 5, "style": "rotate(240deg) translate(40px, 0) rotate(-240deg)" }, { "i": 6, "style": "rotate(300deg) translate(40px, 0) rotate(-300deg)" }, { "i": 7, "style": "rotate(0deg) translate(80px, 0) rotate(-0deg) " }, { "i": 8, "style": "rotate(60deg) translate(80px, 0) rotate(-60deg) " }, { "i": 9, "style": "rotate(120deg) translate(80px, 0) rotate(-120deg) " }, { "i": 10, "style": "rotate(180deg) translate(80px, 0) rotate(-180deg) " }, { "i": 11, "style": "rotate(240deg) translate(80px, 0) rotate(-240deg) " }, { "i": 12, "style": "rotate(300deg) translate(80px, 0) rotate(-300deg) " }, { "i": 13, "style": "rotate(30deg) translate(69.5px, 0) rotate(-30deg)" }, { "i": 14, "style": "rotate(90deg) translate(69.5px, 0) rotate(-90deg)" }, { "i": 15, "style": "rotate(150deg) translate(69.5px, 0) rotate(-150deg)" }, { "i": 16, "style": "rotate(210deg) translate(69.5px, 0) rotate(-210deg)" }, { "i": 17, "style": "rotate(270deg) translate(69.5px, 0) rotate(-270deg)" }, { "i": 18, "style": "rotate(330deg) translate(69.5px, 0) rotate(-330deg)" }],
}

const hexagons: Array<Hexagon> =
    [
        {
            "id": "phase-5",
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
                    "clipPath": "url(#clip_30)"
                },
                {
                    "id": "AIk5EREjDfyCwiQMW7z0dv6XBQ12M13XiH49IFqvTD3cOzqvow7DGfuC-yRu8U_e_R0ArCs4sA-khMmPmn3-RXwlUkNtij2wHQ",
                    "target": "i1",
                    "x": -25,
                    "y": -25,
                    "width": 50,
                    "height": 50,
                    "transform": "matrix(1, 0, 0, 1, 40, 0)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "id": "AIk5EREmpiFOgd0PnL-PsjH4KMF3iCOdg4-fuKf0ywjNv3MnxaETjLcz2k3dZ7_SaLujBz2PApG9C0pyxfxGqZSig33NNQ8VLg",
                    "target": "i2",
                    "x": -27,
                    "y": -30,
                    "width": 58,
                    "height": 58,
                    "transform": "matrix(1, 0, 0, 1, 20, 34.641)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "id": "AIk5EREbSPjw3gdZpWpdFiqSb6hlI7LV5RzANzqWbSGbY6RBtS0qQbW160_YNqRXcrisjKG9-C-CAPP_kuc0xzACnaOoMRCrQw",
                    "target": "i3",
                    "x": -73,
                    "y": -48,
                    "width": 122,
                    "height": 122,
                    "transform": "matrix(1, 0, 0, 1, -20, 34.641)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "id": "AIk5ERH8e5VumHBsOeaQSZs-cn8pNTfqD3SEyftHuQe30GpJSV75f6esONwY1f_BiK22E8bRTnNFt6Hc21cbvEbDBAkillkJTA",
                    "target": "i4",
                    "x": -25,
                    "y": -25,
                    "width": 44,
                    "height": 44,
                    "transform": "matrix(1, 0, 0, 1, -40, 4.89859e-15)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "id": "AIk5EREOh-6996GVeywPqH_TBmSmhT7o6VCta2Zkubmg2zrcU_x-P1Hx-BImrhByCkbkdowPSivWF52HmgNPkvtmDWhdZLsT9w",
                    "target": "i5",
                    "x": -43,
                    "y": -52,
                    "width": 100,
                    "height": 100,
                    "transform": "matrix(1, 0, 0, 1, -20, -34.641)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "id": "AIk5ERFhRWAJjvqy-kRwhj0lVyZVPxejsm_L78w9Or4cXx_uLj5g12omCReFcU4sWjxzqJbIpjCok79TapmoD_48Otphk435Mg",
                    "target": "i6",
                    "x": -25,
                    "y": -25,
                    "width": 50,
                    "height": 50,
                    "transform": "matrix(1, 0, 0, 1, 20, -34.641)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "id": "AIk5ERHhmQ2zgiBUZSrYPpCktxr7IAyqYf_fMlfdMk0Ww5Z3H9nc2yYBNyDtO7P7HdJHgMjyqMex-UzTxX52IHSdSoVregE9Lw",
                    "target": "i7",
                    "x": -24,
                    "y": -24,
                    "width": 48,
                    "height": 48,
                    "transform": "matrix(1, 0, 0, 1, 80, 0)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "id": "AIk5EREgRV-TvmwO7AKMsU-HwxDYwfYD6f061la9AFDKjfDqqxaxFEuooI79Kicfz3Bg4of_dby-6M30o5_oU62DD2awgzVmpA",
                    "target": "i8",
                    "x": -26,
                    "y": -32,
                    "width": 52,
                    "height": 52,
                    "transform": "matrix(1, 0, 0, 1, 40, 69.282)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "id": "AIk5ERHZZxfeCEQENLvFSqEY66mMHovD8g5GG8020vkaUjb3P187q8K09xlucJ_GzPhicYHLS5X6Af8DTAFe6A4oiN7AqstN2w",
                    "target": "i9",
                    "x": -57,
                    "y": -43,
                    "width": 100,
                    "height": 100,
                    "transform": "matrix(1, 0, 0, 1, -40, 69.282)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "id": "AIk5ERFWkcl7e6kW96nRDZGuEhV0jY4IHgeZE-15FqP4W3cbXEdPE2NCEtGR5T6yynzrkk9ZsKRYIkBf67Q3luMiJNclA7d4HQ",
                    "target": "i10",
                    "x": -24,
                    "y": -20,
                    "width": 48,
                    "height": 48,
                    "transform": "matrix(1, 0, 0, 1, -80, 9.79717e-15)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "id": "AIk5EREFmz4Uh7kjczKdYvStqmzq7F1qyd8x_LDqCbd2eZmn-LZGdZaMEJPwV6ojMh0Hc0G4QfSILFDJrl3R2qzHj8RK1TQQOg",
                    "target": "i11",
                    "x": -65,
                    "y": -42,
                    "width": 100,
                    "height": 100,
                    "transform": "matrix(1, 0, 0, 1, -40, -69.282)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "id": "AIk5EREqHAZmb5e2XDHRRiK35conyFfL442tXNNqwkOi96NCdpSwEH4EbhXoMT3-jc6uK8F5XFjbBTpNs93-0UHr97-qg9JXWA",
                    "target": "i12",
                    "x": -32,
                    "y": -27,
                    "width": 56,
                    "height": 56,
                    "transform": "matrix(1, 0, 0, 1, 40, -69.282)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "id": "AIk5ERG6Li8N6_OB-mZuNTYLine1HL-gbcjqSdcbx0eNz27bgncXOsguVwsi_8ed7b7croDcSgkUlurlSMWBc_rmhCCbmxUtwA",
                    "target": "i13",
                    "x": -25,
                    "y": -26,
                    "width": 50,
                    "height": 50,
                    "transform": "matrix(1, 0, 0, 1, 60.1888, 34.75)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "id": "AIk5EREHECPQLgP7domL_FGJ-N-NW4SXAY3eisedSO95NzlDM7GiutBWDln3TStScuSXu4KrrOiJ8EhllLjpmCREKPHBqe3XnA",
                    "target": "i14",
                    "x": -37,
                    "y": -29,
                    "width": 58,
                    "height": 58,
                    "transform": "matrix(1, 0, 0, 1, 4.25565e-15, 69.5)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "id": "AIk5ERH1RzPtBQdIoMA8rqdA6A5zhzICvUK_FLswirWLo7ajGOBySWRPX0z-IE7kk2VPBbV0GgMGmQu_yVQfyqIfV5YujCZNWw",
                    "target": "i15",
                    "x": -31,
                    "y": -28,
                    "width": 54,
                    "height": 54,
                    "transform": "matrix(1, 0, 0, 1, -60.1888, 34.75)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "id": "AIk5EREFmz4Uh7kjczKdYvStqmzq7F1qyd8x_LDqCbd2eZmn-LZGdZaMEJPwV6ojMh0Hc0G4QfSILFDJrl3R2qzHj8RK1TQQOg",
                    "target": "i16",
                    "x": -23,
                    "y": -57,
                    "width": 100,
                    "height": 100,
                    "transform": "matrix(1, 0, 0, 1, -60.1888, -34.75)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "id": "AIk5EREK7zXlEPSHYB193SbxeTYIdFI2Jf2x-BLw_VY4w8-hghkdEfsyeCkw76fPgBaQr5tmNEz_gqQtd4NxmmFtkUma86ocLg",
                    "target": "i17",
                    "x": -46,
                    "y": -44,
                    "width": 100,
                    "height": 100,
                    "transform": "matrix(1, 0, 0, 1, -1.27669e-14, -69.5)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "id": "AIk5EREdQIidtJVxTc68CSD02TlLUIovfhy1QMRn_vm8GXJkxr5NjHV9NdQd_OL3pRaBggMjzIBORSDT7zbB3JsMccg5TZUEHQ",
                    "target": "i18",
                    "x": -61,
                    "y": -45,
                    "width": 114,
                    "height": 114,
                    "transform": "matrix(1, 0, 0, 1, 60.1888, -34.75)",
                    "clipPath": "url(#clip_30)"
                }
            ]
        },
        {
            "id": "phase-4",
            "title": "Marysville KS",
            "data": [
                {
                    "id": "AIk5EREmCxbNunvJbnyM-v57SaklYYAKqrdVtJv1xmT9UygLenr1lBm05xzwhgpza-B2bsSEeFxy46c9112cGSVC6uBUa6jlIw",
                    "target": "i0",
                    "x": -28,
                    "y": -28,
                    "width": 58,
                    "height": 58,
                    "transform": "",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "id": "AIk5EREx1btL7WbGtLbWV1KOVeog-eHODeKiefqd98STss3xDcDo3_lMKpCvqIQYVT4G9Bw6sZUft7NxdqqYTrX2Kruuc2dsWA",
                    "target": "i1",
                    "x": -26,
                    "y": -27,
                    "width": 52,
                    "height": 52,
                    "transform": "matrix(1, 0, 0, 1, 40, 0)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "id": "AIk5ERGrlWnd3ou1TUkdr89W5FVIpIoZw5nsNgYyzLl7nJFWijmvKf_8bntoEq-6I9VlQNM62lEz",
                    "target": "i2",
                    "x": -27,
                    "y": -30,
                    "width": 58,
                    "height": 58,
                    "transform": "matrix(1, 0, 0, 1, 20, 34.641)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "id": "AIk5ERGiveKRAQOeFeRmpibjZEKcGW78GI6n_Ljgu0ptlPo1S0tUasr26Hj_0FX0vT0B1gipdtnMollgrglCpgcysQrYv6sNsw",
                    "target": "i3",
                    "x": -34,
                    "y": -24,
                    "width": 66,
                    "height": 66,
                    "transform": "matrix(1, 0, 0, 1, -20, 34.641)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "id": "AIk5ERFGgBmy-i7mWenRL5-WPK3Nc-BPW9DGXZdmOYx45qjw5Ya6dHoFbgbGWtM0bzFVklayMNrU",
                    "target": "i4",
                    "x": -44,
                    "y": -54,
                    "width": 94,
                    "height": 94,
                    "transform": "matrix(1, 0, 0, 1, -40, 4.89859e-15)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "id": "AIk5EREJUGtPmOa0he3ZDyskMHmPwLJuTUxyKcBoYpimbflBsMf6NhyD4fG4d5DtcYgBtrtcthdo",
                    "target": "i5",
                    "x": -57,
                    "y": -54,
                    "width": 128,
                    "height": 128,
                    "transform": "matrix(1, 0, 0, 1, -20, -34.641)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "id": "AIk5ERH3nqOBJzmt1dzI9YVtGEHQJmmg8h0omceVoSLV2N9o_6djk9MT8PzQ4KcGqferxVTWTSii",
                    "target": "i6",
                    "x": -32,
                    "y": -42,
                    "width": 76,
                    "height": 76,
                    "transform": "matrix(1, 0, 0, 1, 20, -34.641)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "id": "AIk5EREGlBZJ3lBjTrC6ND4oTXJ5VrlKBfC1ss_4EcIBK-R5Scs__oeq2coe3L5kOYAXejR-oqoVSaa6NyUY7y4J8T7sjYlb3g",
                    "target": "i7",
                    "x": -38,
                    "y": -44,
                    "width": 102,
                    "height": 102,
                    "transform": "matrix(1, 0, 0, 1, 80, 0)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "id": "AIk5ERFTf0TBMY3rmwjVwg2PNAB3d8bkNsrCwdju4D_s8Es-3_0tdbBkj8nYdn9Pw0QGmaxgvv63",
                    "target": "i8",
                    "x": -25,
                    "y": -25,
                    "width": 50,
                    "height": 50,
                    "transform": "matrix(1, 0, 0, 1, 40, 69.282)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "id": "AIk5ERGJktdvc-kxu63CdPECDmvu7svH_y-OZBEb5wSz_WQnU6QrEet190EQqUxTEoRwD4eA4G1qiAdE4L8l7RStkbnMbgTGZw",
                    "target": "i9",
                    "x": -40,
                    "y": -29,
                    "width": 72,
                    "height": 72,
                    "transform": "matrix(1, 0, 0, 1, -40, 69.282)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "id": "AIk5ERGFKFN82JeCBJ7nnEV6bYgsY3ePm3TEOQuX3RjFE4LIpPfpezxRAzbXvyuAB_DNmGtRV4i_k0N8r9EDEHQxdx3mGfOXqw",
                    "target": "i10",
                    "x": -25,
                    "y": -25,
                    "width": 50,
                    "height": 50,
                    "transform": "matrix(1, 0, 0, 1, -80, 9.79717e-15)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "id": "AIk5EREY4l_aR-W9yCA1uVdnT94ULQ1lWBTUstAR-p_eT3PBYdpDQ6iGQS3uyl_kxLagmRbi2M-l",
                    "target": "i11",
                    "x": -39,
                    "y": -31,
                    "width": 68,
                    "height": 68,
                    "transform": "matrix(1, 0, 0, 1, -40, -69.282)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "id": "AIk5ERHyurod9B5VSi8Nv5V4eCd02_G3d2HqWVKMQ8z__Wniwf3YbI_dgvrxhW3iHUVNXMLRp833",
                    "target": "i12",
                    "x": -43,
                    "y": -37,
                    "width": 72,
                    "height": 72,
                    "transform": "matrix(1, 0, 0, 1, 40, -69.282)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "id": "AIk5ERHRJK6Ag_AUqqFiDEu68qgzYEw1IrzRywz8UR5iXm-0-o0fjuPdi5fpLU75vAcB8zdwewuzH8mNnn-NEJdNk-a54hu9iA",
                    "target": "i13",
                    "x": -50,
                    "y": -33,
                    "width": 80,
                    "height": 80,
                    "transform": "matrix(1, 0, 0, 1, 60.1888, 34.75)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "id": "AIk5ERGI3w0qDby2wdkiZRSkoJgSwBUFlVRr3kKDqs7CbXJBKx-y6e9KNdxmOHjr59ApJ3snS13O",
                    "target": "i14",
                    "x": -25,
                    "y": -25,
                    "width": 50,
                    "height": 50,
                    "transform": "matrix(1, 0, 0, 1, 4.25565e-15, 69.5)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "id": "AIk5ERE43ja9ZLaQzx_ihJfXg1z6lcqjGjM7SGbGtal2oDz5mFQfaFkgkob5l8GV8biaiAa4GMBZ",
                    "target": "i15",
                    "x": -41,
                    "y": -90,
                    "width": 114,
                    "height": 114,
                    "transform": "matrix(1, 0, 0, 1, -60.1888, 34.75)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "id": "AIk5ERFuVvWUA1G2AaxRvjhjA7LhzVFTIFM9Wj4FYx9r1qiDBx0jgrR0ZT3RZq_g9JmvT6jmlBru",
                    "target": "i16",
                    "x": -58,
                    "y": -75,
                    "width": 202,
                    "height": 202,
                    "transform": "matrix(1, 0, 0, 1, -60.1888, -34.75)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "id": "AIk5EREGmytbvPC9-nlYeIdYXIIskXxX9_IKxeRWL564NKsCsgwLH3XiG9uruAvm6Z23DO1c2PZUzwLlYb0gBbzsOxKKQoAYbg",
                    "target": "i17",
                    "x": -66,
                    "y": -61,
                    "width": 126,
                    "height": 126,
                    "transform": "matrix(1, 0, 0, 1, -1.27669e-14, -69.5)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "id": "AIk5EREbNet03tgRCVqBJV5kBla5G06NG9Xcc5i7Zp6UORVKrNXipPFn9dKEOWffnJCgNRSxh-Cw",
                    "target": "i18",
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
            "title": "Brief Wichita Visit",
            "data": [
                {
                    "id": "AIk5EREPeKW_EHj6kl6Tu9XnOkOqojz3PfVfzg_hhWxocOlrIvUJUDeCORmwcmllHjbxJLlPMOuP",
                    "target": "i0",
                    "x": -52,
                    "y": -34,
                    "width": 80,
                    "height": 80,
                    "transform": "",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "id": "AIk5ERHN9KTTw3MLW6VzYG0oL4ojFBuJpMWmNK5vlyns62ewnB-5B8p0zyP8IgHyrgJAfHwpk-3Y",
                    "target": "i1",
                    "x": -47,
                    "y": -38,
                    "width": 72,
                    "height": 72,
                    "transform": "matrix(1, 0, 0, 1, 40, 0)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "id": "AIk5ERELhKmBsZSyrCgZehLs6Suvwc1ogxa_Fz3EzaZjY2puGyn4X4vYXxR5zZlTqDW6zi8x_rtigA80RyAMl0ruUnq6ThwRbA",
                    "target": "i2",
                    "x": -34,
                    "y": -27,
                    "width": 86,
                    "height": 86,
                    "transform": "matrix(1, 0, 0, 1, 20, 34.641)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "id": "AIk5ERFJNxKZvRwUQepjM5-ITAZ05MHvv7TJG1ksrOkn1mfNDk7Nj4Eha-S9hAHYhiNR0gP6aqF7",
                    "target": "i3",
                    "x": -25,
                    "y": -25,
                    "width": 50,
                    "height": 50,
                    "transform": "matrix(1, 0, 0, 1, -20, 34.641)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "id": "AIk5ERE7drgnUSY4U1Q3D9pZLYfws9M74hn8c-TxXrNJDvZnCzMNwtExbx6Awh9fTz16mpHozh4h",
                    "target": "i4",
                    "x": -25,
                    "y": -25,
                    "width": 50,
                    "height": 50,
                    "transform": "matrix(1, 0, 0, 1, -40, 4.89859e-15)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "id": "AIk5ERFVJIl-SvWM2liaJ7El3oPjLQl5pYczwPWFnwsxYGF4T6K3Hfk9GJCe_4zEOv6AsTKhb-NE",
                    "target": "i5",
                    "x": -46,
                    "y": -56,
                    "width": 128,
                    "height": 128,
                    "transform": "matrix(1, 0, 0, 1, -20, -34.641)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "id": "AIk5ERFVJIl-SvWM2liaJ7El3oPjLQl5pYczwPWFnwsxYGF4T6K3Hfk9GJCe_4zEOv6AsTKhb-NE",
                    "target": "i6",
                    "x": -79,
                    "y": -54,
                    "width": 128,
                    "height": 128,
                    "transform": "matrix(1, 0, 0, 1, 20, -34.641)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "id": "AIk5ERGEG78o8PBLC-fS-elig2ud0Mj-hN4_AbumCOIThJ_33Wa3l4gsU0Z695MQwBWxU29Inlep",
                    "target": "i7",
                    "x": -70,
                    "y": -51,
                    "width": 118,
                    "height": 118,
                    "transform": "matrix(1, 0, 0, 1, 80, 0)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "id": "AIk5ERELhKmBsZSyrCgZehLs6Suvwc1ogxa_Fz3EzaZjY2puGyn4X4vYXxR5zZlTqDW6zi8x_rtigA80RyAMl0ruUnq6ThwRbA",
                    "target": "i8",
                    "x": -54,
                    "y": -61,
                    "width": 86,
                    "height": 86,
                    "transform": "matrix(1, 0, 0, 1, 40, 69.282)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "id": "AIk5ERHzrxnI2aXEGbBZkctTU-zEJQGxVrRYJtqMYQ2J-Nfoj2WpeZi-Y5uZCSBp8o21lmRgCtEY06mkRkZ0jumtUkk-eCNAmg",
                    "target": "i9",
                    "x": -25,
                    "y": -25,
                    "width": 50,
                    "height": 50,
                    "transform": "matrix(1, 0, 0, 1, -40, 69.282)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "id": "AIk5ERGEG78o8PBLC-fS-elig2ud0Mj-hN4_AbumCOIThJ_33Wa3l4gsU0Z695MQwBWxU29Inlep",
                    "target": "i10",
                    "x": -30,
                    "y": -56,
                    "width": 118,
                    "height": 118,
                    "transform": "matrix(1, 0, 0, 1, -80, 9.79717e-15)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "id": "AIk5EREq44I89fT_IWqEYhcXN55dU5AWMUZLO01g7JR3_r_WNVsy0VeMHGM8eve20O16r41dNKl3",
                    "target": "i11",
                    "x": -63,
                    "y": -55,
                    "width": 114,
                    "height": 114,
                    "transform": "matrix(1, 0, 0, 1, -40, -69.282)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "id": "AIk5ERH1mphrDmNlsUjSzGccgIubq_sGI-1kZmWKcOlXNcvtL94cOSs5qnWc7SQmVjnYLQ-_fQPRgCGohQGwnad2X6kI-Couew",
                    "target": "i12",
                    "x": -84,
                    "y": -55,
                    "width": 120,
                    "height": 120,
                    "transform": "matrix(1, 0, 0, 1, 40, -69.282)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "id": "AIk5ERG0Ayk07oB820cVUSUwG8cj4NqQbpdUQHI426qfqnr6vggadIfWIcoV3rgoYJEhcx1s65GI",
                    "target": "i13",
                    "x": -37,
                    "y": -36,
                    "width": 70,
                    "height": 70,
                    "transform": "matrix(1, 0, 0, 1, 60.1888, 34.75)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "id": "AIk5ERFJbEIpj3q7heYJHUgHMKC6QNt-VIzAba96pkAJcAIYUNdX1cce4juAowalHh61Te3FxHHwXhuegoQiNd8D-n4HaPSKSA",
                    "target": "i14",
                    "x": -25,
                    "y": -25,
                    "width": 50,
                    "height": 50,
                    "transform": "matrix(1, 0, 0, 1, 4.25565e-15, 69.5)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "id": "AIk5ERHZwI9GJI25oel01Tuobu9nFypiXnEQP9NafQAXPTnopICpo3QoTWorIkXfvvnEFK3KJzWE",
                    "target": "i15",
                    "x": -25,
                    "y": -25,
                    "width": 50,
                    "height": 50,
                    "transform": "matrix(1, 0, 0, 1, -60.1888, 34.75)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "id": "AIk5ERFRhOxYyIsVWnGijj_0TXND7aeK-7bdM_U-DQKE4E6JyI_pIkX0ENT4FsGwfPlCXR7P-au1",
                    "target": "i16",
                    "x": -47,
                    "y": -36,
                    "width": 104,
                    "height": 104,
                    "transform": "matrix(1, 0, 0, 1, -60.1888, -34.75)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "id": "AIk5ERFqfaiPWOKy1TYzgFM7APVby5vcEPFwoeeis_Vp2kRc1m0kCDCD4VOHTP7u7TirtUOd_iw6",
                    "target": "i17",
                    "x": -35,
                    "y": -53,
                    "width": 110,
                    "height": 110,
                    "transform": "matrix(1, 0, 0, 1, -1.27669e-14, -69.5)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "id": "AIk5ERGNKnrjVtq0XTL9m9tYJ6_iYiIM7HKf61jRw1M8ZkxGWAGdZJ4VV0vf28FqoC0cKvkU5Mm75sebR39NcflBqCYI_X3AYg",
                    "target": "i18",
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
            "title": "Leaving Greenville",
            "data": [
                {
                    "id": "AIk5ERGcaLIgFEPsWux1GWuGqPVS_NrJYfO77m6bO3ZmMG6j78MU9vWRc5D0_4cAqVzECgtyYb90",
                    "target": "i0",
                    "x": -53,
                    "y": -35,
                    "width": 78,
                    "height": 78,
                    "transform": "",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "id": "AIk5ERHgKNkG0HcwJtGQReKtVNY_uQlFg2D-kokgVCVvjz5VDTPySqEKaArdBohFOL7HmA7gQUihV3g5ycG4-g6OEkUu0SaTlA",
                    "target": "i1",
                    "x": -25,
                    "y": -25,
                    "width": 50,
                    "height": 50,
                    "transform": "matrix(1, 0, 0, 1, 40, 0)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "id": "AIk5ERENk44UmBuW5MtStpzi9QSLiS_765JuBsn0VV-H-hPLqdI09OEcNDsgzCN6VHJ-eSDaPM0ei8iEWLYk0j3osJlJjKdIHw",
                    "target": "i2",
                    "x": -58,
                    "y": -81,
                    "width": 130,
                    "height": 130,
                    "transform": "matrix(1, 0, 0, 1, 20, 34.641)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "id": "AIk5ERGGIKyyrMvwBbgkZoAl769QnQtf0XpQXR1RL5fGLT_o2T4xiE-YFzAucOjDUOI2JVXZPrgN-7cuHASXKlcINRmkabYAHg",
                    "target": "i3",
                    "x": -25,
                    "y": -25,
                    "width": 50,
                    "height": 50,
                    "transform": "matrix(1, 0, 0, 1, -20, 34.641)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "id": "AIk5ERGx2ociGEK9rh2FxUdZvK-dln8jeYuPb6deOZgKiNheUoU1FmnS8iq_ay2-8sxNN3KrMK_4rP-DFfnhPvSZDznksckxLQ",
                    "target": "i4",
                    "x": -25,
                    "y": -25,
                    "width": 50,
                    "height": 50,
                    "transform": "matrix(1, 0, 0, 1, -40, 4.89859e-15)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "id": "AIk5ERFPY6OB--YrnS5WfGE6GQJcd_pqMiYWKsfQM34kf1A6Th6VrI7XseiXJ8V8YBLQ7dzEWBiM",
                    "target": "i5",
                    "x": -33,
                    "y": -42,
                    "width": 66,
                    "height": 66,
                    "transform": "matrix(1, 0, 0, 1, -20, -34.641)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "id": "AIk5ERENLM7Vv4-pA3p4atK8tEwSpNHaY1V3WQsBgzEPLo39UdQqQG6JXbuDrM7TN267y1vt4t3jRCA16aLG3SsQjHM5qwgHIQ",
                    "target": "i6",
                    "x": -25,
                    "y": -25,
                    "width": 50,
                    "height": 50,
                    "transform": "matrix(1, 0, 0, 1, 20, -34.641)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "id": "AIk5ERHkwRQeA306LaihQTI3qkgqHNJf8MlU8B5VSmzx9FC4r-b59xWRrk6MozLcmBZLgwjNvJ2n5eQv2DTpwdDpDz5Ryqb1JQ",
                    "target": "i7",
                    "x": -68,
                    "y": -56,
                    "width": 114,
                    "height": 114,
                    "transform": "matrix(1, 0, 0, 1, 80, 0)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "id": "AIk5ERHB26YoEI7rVWyaPVhzVvASb4LacMCdTFlT--Eer0aXQqmSr_dH3ZdRTTKNoroi8HiEgIZI5xktVNwSzRNLAXRw7VbTgA",
                    "target": "i8",
                    "x": -33,
                    "y": -37,
                    "width": 66,
                    "height": 66,
                    "transform": "matrix(1, 0, 0, 1, 40, 69.282)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "id": "AIk5ERH6_eAug5spR1KOSlKfn7XOWTLg9Fa4k2FW2ctXgw681-tVGTyP1xy0OCvKfDG0ZzyHp24rZREKm7OgEcd4_0-dbFzPGg",
                    "target": "i9",
                    "x": -32,
                    "y": -39,
                    "width": 62,
                    "height": 62,
                    "transform": "matrix(2.01892e-07, -1, 1, 2.01892e-07, -40, 69.282)",
                    "clipPath": "url(#clip_0)"
                },
                {
                    "id": "AIk5ERHIJAPOawrdlDGVVOs-DZndecbtO_UYU6OUKOcxoTixh-ZxVwtYPGJVDknBZKonHUQ8Ngz0koopIDAdUFrf7Q6Y482PGw",
                    "target": "i10",
                    "x": -52,
                    "y": -40,
                    "width": 84,
                    "height": 84,
                    "transform": "matrix(1, 0, 0, 1, -80, 9.79717e-15)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "id": "AIk5ERH8a8inyM92XStceGovWlBDkvuCBC3OLo9ErOLUjzYTuSA4jgLGPd7p-rHm-7m6Fh8U47ahVxrGc9TeTqB6bKF1rni_QA",
                    "target": "i11",
                    "x": -63,
                    "y": -53,
                    "width": 122,
                    "height": 122,
                    "transform": "matrix(1, 0, 0, 1, -40, -69.282)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "id": "AIk5ERFudiXEn1UPT7Eq75KW5hprJLul0sMowcER9VQEoA2jhxI4qlpzJw9lqXR18IknFUL1nqm5V801CgNRqy0-xui9Bq_RVQ",
                    "target": "i12",
                    "x": -26,
                    "y": -24,
                    "width": 52,
                    "height": 52,
                    "transform": "matrix(1, 0, 0, 1, 40, -69.282)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "id": "AIk5EREOa11aMm3AEYrPfO5eqrbjdbfsh_ZXzr-kxmKlt6sv28-5uHqet4wVfVVvkl9Mux2eizm3OfU87gJgnTKuZuW9ODDMhA",
                    "target": "i13",
                    "x": -34,
                    "y": -50,
                    "width": 72,
                    "height": 72,
                    "transform": "matrix(1, 0, 0, 1, 60.1888, 34.75)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "id": "AIk5EREjonQ4ovpHyfBIdiZGh9YTG0EqtW_8QjGXw3FpktY3ycaJCDV6TuC4j-TuRxyfxzbk48N9ibvA8TCOmp2IHJeQle13oQ",
                    "target": "i14",
                    "x": -50,
                    "y": -50,
                    "width": 100,
                    "height": 100,
                    "transform": "matrix(1, 0, 0, 1, 4.25565e-15, 69.5)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "id": "AIk5ERGans84Zg_TZ2pssI3afP6UL4RTvwcOTGJg0Eqju89g93YxB42wDmd9KxzGRRAUdzEDuTJ4jY2afsC1DD5cVMisaJeP5w",
                    "target": "i15",
                    "x": -37,
                    "y": -31,
                    "width": 58,
                    "height": 58,
                    "transform": "matrix(1, 0, 0, 1, -60.1888, 34.75)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "id": "AIk5ERGIQZLEtBYTvPNeYI4zzwCqrqz2MD8Y2F3dwH7zVkAz7cs-q2zvOZy4XJ-RpMpv3xD8Y2jZ8L5f6JKmj4FQ-c5zk3d6Fw",
                    "target": "i16",
                    "x": -12,
                    "y": -11,
                    "width": 22,
                    "height": 22,
                    "transform": "matrix(1, 0, 0, 1, -60.1888, -34.75)",
                    "clipPath": "url(#clip_30)",
                    "background": {
                        "fill": "#666",
                        "stroke": "#000"
                    }
                },
                {
                    "id": "AIk5EREnGsgh2I0TkR5TiCYBx677skTe1Y--aiA9vDL7FU2d7MsMgqGwC9NeTxRDKAm1BYJLZGZnENOf_vc96xqkMpK-B9Cw9A",
                    "target": "i17",
                    "x": -41,
                    "y": -30,
                    "width": 64,
                    "height": 64,
                    "transform": "matrix(1, 0, 0, 1, -1.27669e-14, -69.5)",
                    "clipPath": "url(#clip_30)"
                },
                {
                    "id": "AIk5ERGgra2xTjsCZ7siN2-XbnezfoxpdN7c4WbZFWdWloEwPaYyHhlDyD4W7pSQyGI4M6735wAnTD5jSOsLSS8lGCfJbKFf2A",
                    "target": "i18",
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
            "id": "next",
            "title": "next",
            "data": []
        }
    ].sort((a, b) => a.id.localeCompare(b.id))

hexagons.push({ id: "next", title: "next", data: [] })

export { transforms, hexagons as collages }
