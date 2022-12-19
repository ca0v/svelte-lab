// this is a wrapper around the indexedDB API

class DB {

    private db: IDBDatabase;

    async initialize(dbName: string) {
        this.db = await this.openDB(dbName, 1);
    }

    openDB(name: string, version: number) {
        return new Promise<IDBDatabase>((resolve, reject) => {
            const request = indexedDB.open(name, version);
            request.onerror = reject;
            request.onsuccess = () => resolve(request.result);
            request.onupgradeneeded = () => {
                this.db = request.result;
                this.performUpgrade();
            };
        });
    }

    performUpgrade() {
        // nothing to do
    }

    async get<Q>(table: string, id: string) {
        return new Promise<Q>((resolve, reject) => {
            const request = this.db.transaction(table).objectStore(table).get(id);
            request.onerror = reject;
            request.onsuccess = () => resolve(request.result as Q);
        });
    }

    async put<Q>(table: string, value: Q & { id: string }) {
        return new Promise<Q>((resolve, reject) => {
            const request = this.db.transaction(table, 'readwrite').objectStore(table).put(value);
            request.onerror = reject;
            request.onsuccess = () => resolve(request.result as Q);
        });
    }

    createTable(name: string, keyPath: string) {
        this.db.createObjectStore(name, { keyPath });
    }

    tableExists(name: string) {
        return this.db.objectStoreNames.contains(name);
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