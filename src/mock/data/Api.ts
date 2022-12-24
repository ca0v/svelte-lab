import { getLocalStorage } from "@/lib/globals";
import type { CollageData } from "@/d.ts";

class Collage {
    private client_id: string | undefined;

    constructor(private api: Api) {
    }

    get(): Promise<Array<string>>;
    get(id: string): Promise<CollageData>;
    async get(id?: string) {
        if (!id) {
            return ["1", "2", "3"]
        } else {
            const result: CollageData = {
                id,
                title: `Collage ${id}`,
                note: "Notes Go Here",
                data: [{ "id": "AIk5ERFrV7YxvPBqVg3prtWxO1iGmqxFd0or1PI65r6t69FZGQWHC2Z0so4NT0XQhaOJnOKu3ihhEtEMR4wRt_Frw0ookSwA9g", "target": "i0", "x": -50, "y": -50, "width": 100, "height": 100, "transform": "translate(0,0)", "clipPath": "poly5_36", "background": null }, { "id": "AIk5EREUeBm4g7nFvXmqBC3Dn8N-4xYImZ6z7WovvSFco-C1KCL7B88OgOW2J8PQAkODNRhap7pD5Y834T7aeaaqigIg7i6YzQ", "target": "i1", "x": -48, "y": -48, "width": 96, "height": 96, "transform": "rotate(108deg) translate(55px, -20px) rotate(-108deg) ", "clipPath": "poly5_36_1", "background": null }, { "id": "AIk5EREWJd3syq4t-ZFWCy0rqHqjlHHDq2GmmuzGIbWbYNrM6sEfAOXzIPJlm2Md5h-tz5gj5K_zprX_YE7kqfMGocwIW3z9Mg", "target": "i2", "x": -64, "y": -44, "width": 100, "height": 100, "transform": "rotate(180deg) translate(55px, -20px) rotate(-180deg) ", "clipPath": "poly5_36_1", "background": null }, { "id": "AIk5ERFGF-RITXG_Jc9FXEK81yR2WA9_TZFRgslNCTFC7HKo-Ut_uE69W5W0uQJ2ZJrixtPMHtjshJyCywJJxryCLX4joik68A", "target": "i3", "x": -50, "y": -50, "width": 100, "height": 100, "transform": "rotate(252deg) translate(55px, -20px) rotate(-252deg) ", "clipPath": "poly5_36_1", "background": null }, { "id": "AIk5ERFwp5KcYTUlETXWTVaD2yd7yh63D9B03ZGgt_-JCy1F-7H7tNqtMrK3vM0zzxWq-2-FdNdIoAQQMjdmFQldzZFgdMilpg", "target": "i4", "x": -50, "y": -50, "width": 100, "height": 100, "transform": "rotate(324deg) translate(55px, -20px) rotate(-324deg) ", "clipPath": "poly5_36_1", "background": null }, { "id": "AIk5ERFdl3X9x1hfoKK_5TKnrrAvtf0K2rad9Nc_NG7rIKDYPm1bGC38Rxyafm0bszLChEBtG-GzYlUk2co1rvWDgvK46hn6Rg", "target": "i5", "x": -50, "y": -50, "width": 100, "height": 100, "transform": "rotate(396deg) translate(55px, -20px) rotate(-396deg) ", "clipPath": "poly5_36_1", "background": null }]
            }
            return result;
        }
    }

    async create(collage: CollageData) {
        return;
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
