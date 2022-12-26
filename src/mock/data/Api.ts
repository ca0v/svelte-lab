import { getLocalStorage, setLocalStorage } from "@/lib/globals";
import type { CollageData } from "@/d.ts";

const TEST_COLLAGES: Array<CollageData> = [{
    id: "1",
    title: "Collage 1",
    note: "Notes Go Here",
    data: [{ "id": "AIk5ERFPkW3Qlmlrrnod782EslJAgIy3p7QovbyrO4pf0-WJjnPLjDLkBT7ZVaFgXYf8sRXiied5talqOfHr6kX7N015d6rK-w", "target": "i0", "x": -19, "y": -21, "width": 42, "height": 42, "transform": "translate(-74px, -74px)", "clipPath": "box", "background": null }, { "id": "AIk5ERFzX87fD8_NyVQeFQDyNP6TKle9mV8nj2YBVZGyvppJKKLdEfd6IDKN6I-aDjkwjxIDkDtr", "target": "i1", "x": -20, "y": -20, "width": 40, "height": 40, "transform": "translate(-25px, -74px)", "clipPath": "box", "background": null }, { "id": "AIk5ERGt445BuPn7ArBw1mbz4dCnGt7xOsNF0nn_Zw4TB4kFEQGRjkpxODtIrljcAGiAlY7lKUy9", "target": "i2", "x": -22, "y": -21, "width": 42, "height": 42, "transform": "translate(24px, -74px)", "clipPath": "box", "background": null }, { "id": "AIk5ERE7Hxafn6GDg8GnwhSaNFIQKyxpBnc2MVTnNo_AWCLsNuHDFqBnaWO0WnbM2wZHVGgfGt3S", "target": "i3", "x": -58, "y": -32, "width": 116, "height": 116, "transform": "translate(73px, -74px)", "clipPath": "box", "background": null }, { "id": "AIk5ERFAQwtA0vAK8fBGkXHEsUQc5ld4X5wxjLSdxhp0xcE26TvCrBStuxNlgnoCx2wUlqnj7A9s", "target": "i4", "x": -20, "y": -24, "width": 42, "height": 42, "transform": "translate(-74px, -25px)", "clipPath": "box", "background": null }, { "id": "AIk5ERGcKCx1KmQzOTHLwbFiEIes_Kk-cktPuRt0JWUQ6Gr55AGPBO79JkJWLgPahXgfBaPlS48X2yR4mrCCb8nVTWem4Gk7gw", "target": "i5", "x": -20, "y": -20, "width": 40, "height": 40, "transform": "translate(-25px, -25px)", "clipPath": "box", "background": null }, { "id": "AIk5EREFDp_ugPmUqiZmtHsIVY3Q83kO6GeQQev6wu2aiJv2sgN86oWdHfogGL64dPVIaWQxKCkdFwssb3ievP1ahUjDIOV1BA", "target": "i6", "x": -22, "y": -21, "width": 42, "height": 42, "transform": "scale(1,1) matrix(1.08885, 0, 0, 1.08885, 20.688, -26.1322) translate(1px, 0px)", "clipPath": "box", "background": null }, { "id": "AIk5ERE7Hxafn6GDg8GnwhSaNFIQKyxpBnc2MVTnNo_AWCLsNuHDFqBnaWO0WnbM2wZHVGgfGt3S", "target": "i7", "x": -58, "y": -81, "width": 116, "height": 116, "transform": "scale(0.9714285714285714,0.9714285714285714) matrix(1.02773, 0, 0, 1.02773, 73.9967, -26.721) translate(1px, 1px)", "clipPath": "box", "background": null }, { "id": "AIk5ERFrBZkiVGJhu-ymCQ2F2TAIDQYllOWSVbO8G4KEJUDeYGXfpoW02mScBZOguoDiv69-MG41ZoPTqRCQTjIXL71Hzx-RZQ", "target": "i8", "x": -23, "y": -25, "width": 46, "height": 46, "transform": "scale(1,1) matrix(1.54117, 1.36433e-07, -1.36433e-07, 1.54117, -63.1892, 32.3648) translate(0px, -1px)", "clipPath": "box", "background": null }, { "id": "", "target": "i9", "x": -140, "y": -164, "width": 280, "height": 280, "transform": "translate(-25px, 24px)", "clipPath": "box", "background": null }, { "id": "AIk5EREK_coXp67L0baTT-J1N9MoGCadT1jPxCvoGU2ViOgbc3QU7qPXqIXOrU-5p5n63XX0fD70PxY3GlvOaxJipxNI3V9Ccw", "target": "i10", "x": -23, "y": -22, "width": 46, "height": 46, "transform": "scale(1,1) matrix(1.48577, 0, 0, 1.48577, 22.2868, 28.2297) translate(0px, -1px)", "clipPath": "box", "background": null }, { "id": "", "target": "i11", "x": -21, "y": -21, "width": 42, "height": 42, "transform": "translate(73px, 24px)", "clipPath": "box", "background": null }, { "id": "", "target": "i12", "x": -40, "y": -40, "width": 80, "height": 80, "transform": "translate(-74px, 73px)", "clipPath": "box", "background": null }, { "id": "AIk5ERErNMY3zQRIpj2djK-aSuiKh5W0Q4R-oCBXsZs5zrvEcmmLaUbCLT0azi17gSm855UsAh3Nn6-mfmVcKxTY4GiZQYf9xw", "target": "i13", "x": -21, "y": -21, "width": 42, "height": 42, "transform": "translate(-25px, 73px)", "clipPath": "box", "background": null }, { "id": "", "target": "i14", "x": -40, "y": -40, "width": 80, "height": 80, "transform": "translate(24px, 73px)", "clipPath": "box", "background": null }, { "id": "AIk5EREdC-qKwhFxwS3zLuHtz9TbxUoNr6RhoE9jOwpevcKZYY_q3zsK00rSFcJrlwcmOzhxVWiw", "target": "i15", "x": -21, "y": -21, "width": 42, "height": 42, "transform": "translate(73px, 73px)", "clipPath": "box", "background": null }]
},
{
    "id": "2",
    "title": "Collage 2",
    "note": "Notes Go Here",
    "data": [{ "id": "AIk5ERFrV7YxvPBqVg3prtWxO1iGmqxFd0or1PI65r6t69FZGQWHC2Z0so4NT0XQhaOJnOKu3ihhEtEMR4wRt_Frw0ookSwA9g", "target": "i0", "x": -50, "y": -50, "width": 100, "height": 100, "transform": "translate(0,0)", "clipPath": "poly5_36", "background": null }, { "id": "AIk5EREUeBm4g7nFvXmqBC3Dn8N-4xYImZ6z7WovvSFco-C1KCL7B88OgOW2J8PQAkODNRhap7pD5Y834T7aeaaqigIg7i6YzQ", "target": "i1", "x": -48, "y": -48, "width": 96, "height": 96, "transform": "rotate(108deg) translate(55px, -20px) rotate(-108deg) ", "clipPath": "poly5_36_1", "background": null }, { "id": "AIk5EREWJd3syq4t-ZFWCy0rqHqjlHHDq2GmmuzGIbWbYNrM6sEfAOXzIPJlm2Md5h-tz5gj5K_zprX_YE7kqfMGocwIW3z9Mg", "target": "i2", "x": -64, "y": -44, "width": 100, "height": 100, "transform": "rotate(180deg) translate(55px, -20px) rotate(-180deg) ", "clipPath": "poly5_36_1", "background": null }, { "id": "AIk5ERFGF-RITXG_Jc9FXEK81yR2WA9_TZFRgslNCTFC7HKo-Ut_uE69W5W0uQJ2ZJrixtPMHtjshJyCywJJxryCLX4joik68A", "target": "i3", "x": -50, "y": -50, "width": 100, "height": 100, "transform": "rotate(252deg) translate(55px, -20px) rotate(-252deg) ", "clipPath": "poly5_36_1", "background": null }, { "id": "AIk5ERFwp5KcYTUlETXWTVaD2yd7yh63D9B03ZGgt_-JCy1F-7H7tNqtMrK3vM0zzxWq-2-FdNdIoAQQMjdmFQldzZFgdMilpg", "target": "i4", "x": -50, "y": -50, "width": 100, "height": 100, "transform": "rotate(324deg) translate(55px, -20px) rotate(-324deg) ", "clipPath": "poly5_36_1", "background": null }, { "id": "AIk5ERFdl3X9x1hfoKK_5TKnrrAvtf0K2rad9Nc_NG7rIKDYPm1bGC38Rxyafm0bszLChEBtG-GzYlUk2co1rvWDgvK46hn6Rg", "target": "i5", "x": -50, "y": -50, "width": 100, "height": 100, "transform": "rotate(396deg) translate(55px, -20px) rotate(-396deg) ", "clipPath": "poly5_36_1", "background": null }]
},
{
    "id": "3",
    "title": "Collage 3",
    "note": "Notes Go Here",
    "data": [{ "id": "AIk5ERFmQW5ZIaSgZkWUgGK-at4pM1icCrEEEtKT6p3xLZXnwBmsqiZVt4LA6lU9ne0DcOLbYZzk", "target": "i0", "x": -64, "y": -83, "width": 134, "height": 134, "transform": "", "clipPath": "30", "background": null }, { "id": "AIk5ERFzEVym5JT-z1zVSQ1_oAC7lUQpE_Wjx8ETgnRE8uNkBSHZVC98Or7jYPmFaSwFMdNHm1LdCUcaoCJbRfvehQ_sJ_rp1g", "target": "i1", "x": -25, "y": -22, "width": 50, "height": 50, "transform": "rotate(0deg) translate(40px, 0) rotate(-0deg)", "clipPath": "30", "background": null }, { "id": "AIk5ERHnN3hS7gM83Xmf0_9DtRPvCqpsdWpFiVpIh55i2LDXOhEebRN_3i9-CN5wFHcXxNiOr8eT", "target": "i2", "x": -26, "y": -30, "width": 56, "height": 56, "transform": "rotate(60deg) translate(40px, 0) rotate(-60deg)", "clipPath": "30", "background": null }, { "id": "AIk5EREOQzVgJ3OR6-PiJusex8NgKYkoCzXlVTD7CBZKqxQfa-KmzDh-AIOKzm8rckfdSLV2EWJd", "target": "i3", "x": -28, "y": -28, "width": 56, "height": 56, "transform": "rotate(120deg) translate(40px, 0) rotate(-120deg)", "clipPath": "30", "background": null }, { "id": "AIk5ERGHJqcV9sN7m8EnzCvZHlZwDF1pq_9LeSxJSnn8njcAxCRajO1sha6XwRlibciEhcy_-RsK", "target": "i4", "x": -31, "y": -31, "width": 62, "height": 62, "transform": "rotate(180deg) translate(40px, 0) rotate(-180deg)", "clipPath": "30", "background": null }, { "id": "AIk5ERHGhvIrwSUN4pcoeR7tAi4mMdTXpxuB_-7XOM2Fw57jAU6ARGsSs-3TRl9dszn6FmY0DAwMHXE81to-20kzGjhSU1FULQ", "target": "i5", "x": -34, "y": -29, "width": 58, "height": 58, "transform": "rotate(240deg) translate(40px, 0) rotate(-240deg)", "clipPath": "30", "background": null }, { "id": "AIk5ERElPQeKo8nDBGpEybZQWPES4OndikMNjMidNaRgIZYvx1gUKYo585ooKyaW-VcKHd7-HneH", "target": "i6", "x": -21, "y": -33, "width": 66, "height": 66, "transform": "rotate(300deg) translate(40px, 0) rotate(-300deg)", "clipPath": "30", "background": null }, { "id": "AIk5ERF8PYMOnnT9-NIpJCzxBWLU48CEOSQWVIfAcFUV3O0KynbLSjc7BwVqBMThitw0JMjzwcuM", "target": "i7", "x": -30, "y": -29, "width": 58, "height": 58, "transform": "rotate(0deg) translate(80px, 0) rotate(-0deg)", "clipPath": "30", "background": null }, { "id": "AIk5EREdMRsbOMeyyULRpbTCfyGPu5eRRbdHVy2gk-ANRdAHdNs_Igm2u21mHgfnckIt1VuFfnCqthNm29VDpoECJPVwWxnxEQ", "target": "i8", "x": -25, "y": -25, "width": 50, "height": 50, "transform": "rotate(60deg) translate(80px, 0) rotate(-60deg)", "clipPath": "30", "background": null }, { "id": "AIk5ERFhrh5Z85QbqW37FBYhs6JidS7ZD2be-wkGgjWZIP4P3CmEm_lWHWzhkJnCwH9cdzCimNL7", "target": "i9", "x": -27, "y": -46, "width": 90, "height": 90, "transform": "rotate(120deg) translate(80px, 0) rotate(-120deg)", "clipPath": "30", "background": null }, { "id": "AIk5ERHWzBnGhu4NKUPr4dMVJmwyIysU6811VJ9fBqPzELu_D52IbWKQQ4cwN-LzAHUtr67GSndw", "target": "i10", "x": -27, "y": -34, "width": 68, "height": 68, "transform": "rotate(180deg) translate(80px, 0) rotate(-180deg)", "clipPath": "30", "background": null }, { "id": "AIk5ERH1P31n4sD07TQ3PXr7dEqSeJtVbRjbJ0tk4i7qIa0LuOWqBH5V88lupzoj7FrvOFK01eeuFiAhLNZwm8vtICEK7eaqig", "target": "i11", "x": -32, "y": -28, "width": 62, "height": 62, "transform": "rotate(240deg) translate(80px, 0) rotate(-240deg)", "clipPath": "30", "background": null }, { "id": "AIk5ERFzrvh6MDKy_rnVSvqoDlSEEgDkoRR8MlyJj_pfDPJtHpNed7cV8-qtPtWIux12jYn340z3sTXEYeJZoJG_h2sj1gjGWg", "target": "i12", "x": -59, "y": -27, "width": 144, "height": 144, "transform": "rotate(300deg) translate(80px, 0) rotate(-300deg)", "clipPath": "30", "background": null }, { "id": "AIk5ERGli8cnTxfAKpom4rWRKsF2nNwEujmaKJ8Z54xN6nrAjiEn3cmzA9dSwqIVgzlvBKR9asPU", "target": "i13", "x": -50, "y": -50, "width": 100, "height": 100, "transform": "rotate(30deg) translate(69.5px, 0) rotate(-30deg)", "clipPath": "30", "background": null }, { "id": "AIk5ERFhrh5Z85QbqW37FBYhs6JidS7ZD2be-wkGgjWZIP4P3CmEm_lWHWzhkJnCwH9cdzCimNL7", "target": "i14", "x": -67, "y": -54, "width": 90, "height": 90, "transform": "rotate(90deg) translate(69.5px, 0) rotate(-90deg)", "clipPath": "30", "background": null }, { "id": "AIk5ERHwsQAeultTNBibxaVVW86-anE3gWfpZpWuyu38uoyneiqxgE3aPtvUw9tBolEEeM3HdJd1", "target": "i15", "x": -29, "y": -28, "width": 56, "height": 56, "transform": "scale(0.9583333333333334,0.9583333333333334) matrix(1.04167, 0, 0, 1.04167, -63.7383, 35.1563) translate(1px, 1px)", "clipPath": "30", "background": null }, { "id": "AIk5ERHwsQAeultTNBibxaVVW86-anE3gWfpZpWuyu38uoyneiqxgE3aPtvUw9tBolEEeM3HdJd1", "target": "i16", "x": -33, "y": -33, "width": 66, "height": 66, "transform": "rotate(210deg) translate(69.5px, 0) rotate(-210deg)", "clipPath": "30", "background": null }, { "id": "AIk5ERHfNIP6PQWFQwF6swdUIR6X0hfNH832RQ64bc-5L2wYuep72CYDfIiFnOKb0LZU0tlyeOFRRwhcCCizlI_wfQ8Y_URLFg", "target": "i17", "x": -42, "y": -41, "width": 82, "height": 82, "transform": "rotate(270deg) translate(69.5px, 0) rotate(-270deg)", "clipPath": "30", "background": null }, { "id": "AIk5ERHu0T2nbxkyZmNBDk9OLc1gM8U4gcCBnmbP-7tZiG-9SXBacsviGutVK7G3tCL40kXioWxG", "target": "i18", "x": -58, "y": -66, "width": 118, "height": 118, "transform": "rotate(330deg) translate(69.5px, 0) rotate(-330deg)", "clipPath": "30", "background": null }]
}
]
class Collage {
    private client_id: string | undefined;

    constructor(private api: Api) {
    }

    get(): Promise<Array<string>>;
    get(id: string): Promise<CollageData>;
    async get(id?: string) {
        let collages = await getLocalStorage<Record<string, CollageData>>("collages", {});
        if (!id) {
            let keys = Object.keys(collages);
            return ["1", "2", "3", ...keys]
        } else {
            const result = collages[id] || TEST_COLLAGES.find(c => c.id === id)
            return result;
        }
    }

    async create(collage: CollageData) {
        const collages = await getLocalStorage<Record<string, CollageData>>("collages", {});
        collages[collage.id] = collage;
        setLocalStorage("collages", collages);
    }

    async getClientId() {
        return "123"
    }

    async login(photoUrl: any, credential: any) {
        return {};
    }

}

class Api {
    baseUrl: string;
    collage: Collage;

    constructor(config: { baseUrl: string }) {
        this.baseUrl = config.baseUrl;
        this.collage = new Collage(this);
    }

}

export { Api }
