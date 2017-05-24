import { Config } from '../config';

export class WebStorageUtility {
    public static generateStorageKey(key: string): string {
        return `${Config.prefix}${key}`;
    }

    public static get(storage: Storage, key: string): any {
        let storageKey = WebStorageUtility.generateStorageKey(key);

        let value = storage.getItem(storageKey);
        return WebStorageUtility.getGettable(value);
    }

    public static set(storage: Storage, key: string, value: any): any {
        let storageKey = WebStorageUtility.generateStorageKey(key);
        storage.setItem(storageKey, WebStorageUtility.getSettable(value));
        return value;
    }

    public static remove(storage: Storage, key: string): void {
        let storageKey = WebStorageUtility.generateStorageKey(key);

        storage.removeItem(storageKey);
    }

    protected static getSettable(value: any): string {
        return typeof value === "string" ? value : JSON.stringify(value);
    }

    protected static getGettable(value: string): any {
        if (value === 'undefined') return null;
        try {
            return JSON.parse(value);
        } catch(e) {
            return value;
        }
    }
}
