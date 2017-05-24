import { Injectable } from '@angular/core';
import { ClearType, Config } from '../config';
import { WebStorageUtility } from '../utility/webstorage.utility';
import { WebStorageConfigInterface } from '../config/config.interface';

export interface WebStorageServiceInterface {
    keys: Array<string>;
    new(): {
        keys: Array<string>;
        config: WebStorageConfigInterface;
        get(key: string): any;
        set(key: string, value: any): void;
        remove(key: string): void;
        clear(): void;
    }
}

export abstract class WebStorageService {
    public static keys: Array<string>;

    constructor(protected storage: Storage) {}

    /**
     * Gets keys from child class
     * @returns {Array<string>}
     */
    public get keys(): Array<string> {
        return (<WebStorageServiceInterface>this.constructor).keys;
    }

    public get config(): WebStorageConfigInterface {
        return Config;
    }

    public get(key: string): any {
        return WebStorageUtility.get(this.storage, key);
    }

    public set(key: string, value: any): void {
        WebStorageUtility.set(this.storage, key, value);
    }

    public remove(key: string): void {
        WebStorageUtility.remove(this.storage, key);
    }

    /**
     * Clears chosen data from Storage
     * @param clearType 'decorators', 'prefix' or 'all'
     * @param prefix if clearType = prefix, defines the prefix
     */
    public clear(clearType?: ClearType, prefix?: string): void {
        clearType = clearType || Config.clearType;
        if (clearType === 'decorators') {
            for (let key of this.keys) {
                this.storage.removeItem(key);
            }
        } else if (clearType === 'prefix') {
            prefix = prefix || Config.prefix;
            for (let key in this.storage) {
                if (this.storage.getItem(key).startsWith(prefix)) {
                    this.storage.removeItem(key);
                }
            }
        } else if (clearType === 'all') {
            this.storage.clear();
        }
    }
}

@Injectable()
export class LocalStorageService extends WebStorageService {
    public static keys: Array<string> = [];

    constructor() {
        super(localStorage);
    }
}

@Injectable()
export class SessionStorageService extends WebStorageService {
    public static keys: Array<string> = [];

    constructor() {
        super(sessionStorage);
    }
}
