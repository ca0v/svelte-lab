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
                id: "1",
                title: "My First Collage",
                note: "Nots",
                data: [
                    {
                        id: "0",
                        target: "i0",
                        x: -100,
                        y: -100,
                        width: 200,
                        height: 300,
                        transform: "",
                        clipPath: "",
                    },
                ]
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
