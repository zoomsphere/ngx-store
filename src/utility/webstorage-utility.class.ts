export class WebStorageUtilityClass {
    protected _prefix: string = '';

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

    public constructor(prefix: string) {
        this._prefix = prefix;
    }


    public getStorageKey(key: string): string {
        return `${this._prefix}${key}`;
    }

    public get(storage: Storage, key: string): any {
        let storageKey = this.getStorageKey(key);
        let value = storage.getItem(storageKey);
        return WebStorageUtilityClass.getGettable(value);
    }

    public set(storage: Storage, key: string, value: any): any {
        let storageKey = this.getStorageKey(key);
        let storable = WebStorageUtilityClass.getSettable(value);
        storage.setItem(storageKey, storable);
        return value;
    }

    public remove(storage: Storage, key: string): void {
        let storageKey = this.getStorageKey(key);
        storage.removeItem(storageKey);
    }
}
