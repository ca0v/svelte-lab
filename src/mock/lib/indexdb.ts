// this is a wrapper around the indexedDB API

import { getLocalStorage, setLocalStorage } from "@/lib/globals";

class DB {

    async initialize(dbName: string) {
    }

    openDB(name: string, version: number) {
    }

    performUpgrade() {
    }

    async get<Q>(table: string, id: string) {
        switch (table) {
            case "globals":
                return new Promise<Q>((resolve, reject) => {
                    resolve(getLocalStorage(`${table}.${id}`) as unknown as Q)
                })
        }
    }

    async put<Q>(table: string, value: Q & { id: string }) {
        return new Promise<Q>((resolve, reject) => {
            setLocalStorage(`${table}.${value.id}`, JSON.stringify(value))
            resolve(value);
        });
    }

    createTable(name: string, keyPath: string) {
    }

    tableExists(name: string) {
        return true;
    }
}

export class PhotoDB<T extends { id: string }> extends DB {

    override async initialize() {
        await super.initialize('photos');
    }

    override performUpgrade() {
        super.performUpgrade();
        this.createTable("photos", "id");
        this.createTable("globals", "id");
    }

    async getGlobal<Q>(id: string) {
        return this.get<Q>('globals', id);
    }

    async putGlobal<Q>(id: string, value: Q) {
        return this.put('globals', { id, value });
    }

    async getPhoto(id: string) {
        return this.get('photos', id);
    }

    async putPhoto(photo: T) {
        return this.put('photos', photo);
    }

    async getPhotos(ids: Array<string>) {
        return Promise.all(ids.map(id => this.getPhoto(id)));
    }

    async putPhotos(photos: Array<T>) {
        return Promise.all(photos.map(photo => this.putPhoto(photo)));
    }


}