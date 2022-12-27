import { getLocalStorage, getPhotoUrl, promptUser, setLocalStorage } from "@/lib/globals";
import type { CollageData } from "@/d.ts";

class Collage {
    private client_id: string | undefined;

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

    async getClientId() {
        if (this.client_id) return this.client_id;
        this.client_id = await getLocalStorage('clientId', "");
        if (!this.client_id) {
            const photoUrl = await getPhotoUrl();
            const response = await fetch(`${photoUrl}/client_id`, { credentials: "include" });
            this.client_id = (await response.json()).client_id;
        }
        setLocalStorage('clientId', this.client_id)
        return this.client_id
    }

    async login(photoUrl: any, credential: any) {
        const response = await fetch(`${photoUrl}/login`, {
            method: 'POST',
            credentials: "include",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ credential }),
        });
        const responseData = await response.json();
        return responseData;
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
