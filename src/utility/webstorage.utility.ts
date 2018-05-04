import { DecoratorConfig } from '../ngx-store.types';
import { WebStorage } from './storage/cookies-storage';
import { Cache } from '../decorator/cache';
import { CONFIG_PREFIX, debug } from '../config/index';
import { Subject } from 'rxjs';
import { NgxStorageEvent } from './storage/storage-event';
import { Observable } from 'rxjs';
export type StorageName = 'localStorage' | 'sessionStorage' | 'cookiesStorage' | 'sharedStorage';

export class WebStorageUtility {
    protected _prefix: string = '';
    protected _storage: WebStorage;
    protected _changes: Subject<NgxStorageEvent> = new Subject();

    public static getSettable(value: any): string {
        return JSON.stringify(value);
    }

    public static getGettable(value: string): any {
        if (value === 'undefined') return null;
        try {
            return JSON.parse(value);
        } catch (e) {
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
            if (key.startsWith(previousPrefix) && !key.startsWith(CONFIG_PREFIX)) {
                const nameWithoutPrefix = this.trimPrefix(key);
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
        const keys = [];
        this.forEach((value, key) => keys.push(key));
        return keys;
    }

    public get changes(): Observable<NgxStorageEvent> {
        return this._changes.asObservable();
    }

    public getStorage() {
        return this._storage;
    }

    public getStorageKey(key: string, prefix?: string): string {
        prefix = (typeof prefix === 'string') ? prefix : this.prefix;
        return `${prefix}${key}`;
    }

    public getStorageName(): StorageName {
        return this._storage.type || ((this._storage === localStorage) ? 'localStorage' : 'sessionStorage');
    }

    public get(key: string, config: DecoratorConfig = {}): any {
        const storageKey = this.getStorageKey(key, config.prefix);
        const value = this._storage.getItem(storageKey);
        return this.getGettable(value);
    }

    public set<T>(key: string, value: T, config: DecoratorConfig = {}): T {
        if (value === null || value === undefined) {
            this.remove(key);
            return null;
        }
        try {
            const storageKey = this.getStorageKey(key, config.prefix);
            const storable = this.getSettable(value);
            this.emitEvent(key, value);
            this._storage.setItem(storageKey, storable, config.expires);
            const cacheItem = Cache.get(key);
            if (cacheItem) {
                debug.log(`updating following CacheItem from ${this.constructor.name}:`, cacheItem);
                cacheItem.resetProxy();
                cacheItem.propagateChange(value, this);
            }
        } catch (error) {
            console.warn(`[ngx-store] ${this.getStorageName()}: following error occurred while trying to save ${key} =`, value);
            console.error(error);
        }
        return value;
    }

    // TODO return true if item existed and false otherwise (?)
    public remove(key: string, config: DecoratorConfig = {}): void {
        const storageKey = this.getStorageKey(key, config.prefix);
        this._storage.removeItem(storageKey);
        const cacheItem = Cache.get(key);
        if (cacheItem) {
            cacheItem.resetProxy();
        }
    }

    public clear() {
        this.emitEvent(null, null, null);
        this.forEach((value, key) => {
            if (key.startsWith(CONFIG_PREFIX)) return;
            this.remove(key, {prefix: ''});
        });
    }

    public forEach(callbackFn: (value: any, key: string) => any): void {
        if (typeof this._storage.forEach === 'function') {
            return this._storage.forEach((value, key) => {
                callbackFn(this.getGettable(value), key);
            });
        }
        Object.keys(this._storage).forEach((key) => {
            callbackFn(this.getGettable(this._storage[key]), key);
        });
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

    protected emitEvent(key: string, newValue: any, oldValue?: any) {
        const event = new NgxStorageEvent(this.getStorageName(), key, this._storage);
        event.oldValue = (oldValue !== undefined) ? oldValue : this.get(key);
        event.newValue = newValue;
        this._changes.next(event);
    }
}
