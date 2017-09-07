import { DecoratorConfig } from '../decorator/webstorage';
import { WebStorage } from './storage/cookies-storage';
import { Cache } from '../decorator/cache';
import { debug } from '../config/config';
export type StorageName = 'LocalStorage' | 'SessionStorage' | 'CookiesStorage';

export class WebStorageUtility {
    protected _prefix: string = '';
    protected _storage: WebStorage;

    public static getSettable(value: any): string {
        return JSON.stringify(value);
    }

    public static getGettable(value: string): any {
        if (value === 'undefined') return null;
        try {
            return JSON.parse(value);
        } catch(e) {
            return value;
        }
    }

    public constructor(storage: WebStorage, prefix: string, previousPrefix?: string) {
        this._storage = storage;
        this._prefix = prefix;

        // handle previousPrefix for backward-compatibility and safe config changes below
        if (prefix === previousPrefix) return;
        if (previousPrefix === null) return;
        if (previousPrefix === undefined) return;
        debug.log(this.getStorageName() + ' > Detected prefix change from ' + previousPrefix + ' to ' + prefix);
        this.forEach((value, key) => {
            // ignore config settings when previousPrefix = ''
            if (key.startsWith(previousPrefix) && !key.startsWith('NGX-STORE_')) {
                let nameWithoutPrefix = this.trimPrefix(key);
                this.set(nameWithoutPrefix, this._storage.getItem(key));

                if (previousPrefix !== '') {
                    this._storage.removeItem(key);
                }
            }
        });
    }

    public get prefix(): string {
        return this._prefix;
    }

    public get keys(): Array<string> {
        let keys = [];
        this.forEach((value, key) => keys.push(key));
        return keys;
    }

    public getStorageKey(key: string, prefix?: string): string {
        prefix = (typeof prefix === 'string') ? prefix : this._prefix;
        return `${prefix}${key}`;
    }

    public getStorageName(): StorageName {
        let storageName: any = this._storage.constructor.name;
        if (storageName === 'Storage') {
            storageName = (this._storage === localStorage) ? 'LocalStorage' : 'SessionStorage';
        }
        return storageName;
    }

    public get(key: string, config: DecoratorConfig = {}): any {
        let storageKey = this.getStorageKey(key, config.prefix);
        let value = this._storage.getItem(storageKey);
        return this.getGettable(value);
    }

    public set(key: string, value: any, config: DecoratorConfig = {}): any {
        if (value === null || value === undefined) {
            return this.remove(key);
        }
        try {
            let storageKey = this.getStorageKey(key, config.prefix);
            let storable = this.getSettable(value);
            this._storage.setItem(storageKey, storable, config.expires);
        } catch (error) {
            console.warn(`[ngx-store] ${this.getStorageName()}: following error occurred while trying to save ${key} =`, value);
            console.error(error);
        }
        return value;
    }

    // TODO return true if item existed and false otherwise (?)
    public remove(key: string): void {
        let storageKey = this.getStorageKey(key);
        this._storage.removeItem(storageKey);
        let cacheItem = Cache.get(key);
        if (cacheItem) {
            cacheItem.resetProxy();
        }
    }

    public clear() {
        this.forEach((value, key) => {
            this.remove(key);
        });
    }

    public forEach(func: (value: any, key: string) => any): void {
        if (typeof this._storage.forEach === 'function') {
            return this._storage.forEach((value, key) => func(this.getGettable(value), key));
        }
        for (let key in this._storage) {
            func(this.getGettable(this._storage[key]), key);
        }
    }

    public getSettable(value: any): string {
        return WebStorageUtility.getSettable(value);
    }

    public getGettable(value: string): any {
        return WebStorageUtility.getGettable(value);
    }

    public trimPrefix(key: string): string {
       return key.replace(this.prefix, '');
    }
}
