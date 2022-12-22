import type { CollageData } from "../d.ts";

class Collage {
    constructor(private api: Api) {
    }

    get(): Promise<Array<string>>;
    get(id: string): Promise<CollageData>;
    async get(id?: string) {
        if (!id) {
            const resp = await fetch(`${this.api.baseUrl}/collage/`, {
                credentials: "include",
            })
            if (!resp.ok) throw new Error(resp.statusText)
            return await resp.json() as Array<string>;
        } else {
            const resp = await fetch(`${this.api.baseUrl}/collage/${id}`, {
                credentials: "include",
            })
            if (!resp.ok) throw new Error(resp.statusText)
            return await resp.json() as CollageData;
        }
    }

    async create(collage: CollageData) {
        const resp = await fetch(`${this.api.baseUrl}/collage/`, {
            method: "POST",
            credentials: "include",
            body: JSON.stringify(collage),
            headers: {
                "Content-Type": "application/json",
            },
        })
        if (!resp.ok) throw new Error(resp.statusText)
        return await resp.json();
    }


}

export class Api {
    baseUrl: string;
    collage: Collage;

    constructor(config: { baseUrl: string }) {
        this.baseUrl = config.baseUrl;
        this.collage = new Collage(this);
    }
}


