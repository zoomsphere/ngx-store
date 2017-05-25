export class WebStorageUtility {
    protected _prefix: string = '';
    protected _storage: Storage;

    public static getSettable(value: any): string {
        return typeof value === "string" ? value : JSON.stringify(value);
    }

    public static getGettable(value: string): any {
        if (value === 'undefined') return null;
        try {
            return JSON.parse(value);
        } catch(e) {
            return value;
        }
    }

    public constructor(storage: Storage, prefix: string) {
        this._storage = storage;
        this._prefix = prefix;
    }

    public getStorageKey(key: string): string {
        return `${this._prefix}${key}`;
    }

    public get(key: string): any {
        let storageKey = this.getStorageKey(key);
        let value = this._storage.getItem(storageKey);
        return WebStorageUtility.getGettable(value);
    }

    public set(key: string, value: any): any {
        let storageKey = this.getStorageKey(key);
        let storable = WebStorageUtility.getSettable(value);
        this._storage.setItem(storageKey, storable);
        return value;
    }

    public remove(key: string): void {
        let storageKey = this.getStorageKey(key);
        this._storage.removeItem(storageKey);
    }

    public clear() {
        this._storage.clear();
    }

    public forEach(func: Function) {
        for (let key in this._storage) {
            func(key, this._storage[key]);
        }
    }
}
