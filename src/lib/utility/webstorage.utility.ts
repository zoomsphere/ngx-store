import { DecoratorConfig } from '../ngx-store.types';
import { WebStorage } from './storage/cookies-storage';
import { Cache } from '../decorator/cache';
import { CONFIG_PREFIX, debug } from '../config/config';
import { Observable, Subject } from 'rxjs';
import { NgxStorageEvent } from './storage/storage-event';

export type StorageName = 'localStorage' | 'sessionStorage' | 'cookiesStorage' | 'sharedStorage';

export class WebStorageUtility {
  protected _storage: WebStorage;

  public constructor(storage: WebStorage, prefix: string = '', previousPrefix?: string) {
    this._storage = storage;
    this._prefix = prefix;

    // handle previousPrefix for backward-compatibility and safe config changes below
    if (prefix === previousPrefix) {
      return;
    }
    if (previousPrefix === null) {
      return;
    }
    if (previousPrefix === undefined) {
      return;
    }
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

  protected _prefix: string = '';

  public get prefix(): string {
    return this._prefix;
  }

  protected _changes: Subject<NgxStorageEvent> = new Subject();

  public get changes(): Observable<NgxStorageEvent> {
    return this._changes.asObservable();
  }

  public get keys(): Array<string> {
    const keys: Array<string> = [];
    this.forEach((value, key) => keys.push(key));
    return keys;
  }

  public static getSettable(value: any): string {
    return JSON.stringify(value);
  }

  public static getGettable(value: string): any {
    if (value === 'undefined') {
      return null;
    }
    try {
      return JSON.parse(value);
    } catch (e) {
      return value;
    }
  }

  public getStorage(): WebStorage {
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
    // TODO return undefined if no key
    /*if (value === null && !(storageKey in this._storage)) {
      return undefined;
    }*/
    return this.getGettable(value as string);
  }

  public set<T>(key: string, value: T, config: DecoratorConfig = {}): T | null {
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
      console.warn(`[ngx-store] ${this.getStorageName()}:
             following error occurred while trying to save ${key} =`, value);
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

  public clear(): void {
    this.emitEvent(null as any, null, null);
    this.forEach((value, key) => {
      if (key.startsWith(CONFIG_PREFIX)) {
        return;
      }
      this.remove(key, {prefix: ''});
    });
  }

  public forEach(callbackFn: (value: any, key: string) => any): void {
    if (typeof this._storage.forEach === 'function') {
      return this._storage.forEach((value: any, key: string) => {
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

  protected emitEvent(key: string, newValue: any, oldValue?: any): void {
    const event = new NgxStorageEvent(this.getStorageName(), key, this._storage);
    event.oldValue = (oldValue !== undefined) ? oldValue : this.get(key);
    event.newValue = newValue;
    this._changes.next(event);
  }
}
