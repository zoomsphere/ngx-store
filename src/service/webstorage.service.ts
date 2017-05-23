import { Injectable } from '@angular/core';
import { WebStorageUtility } from '../utility/webstorage.utility';
import { ClearType, WEBSTORAGE_CONFIG } from '../index';

export interface WebStorageServiceInterface {
    keys: Array<string>;
    new(): {
        get(key: string): any;
        set(key: string, value: any): void;
        remove(key: string): void;
        clear(): void;
    }
}

export abstract class WebStorageService {
    public static keys: Array<string>;

    constructor(protected storage: Storage) {}

    public get(key: string): any {
        return WebStorageUtility.get(this.storage, key);
    }

    public set(key: string, value: any): void {
        WebStorageUtility.set(this.storage, key, value);
    }

    public remove(key: string): void {
        WebStorageUtility.remove(this.storage, key);
    }

    public clear(clearType: ClearType = 'decorators'): void {
        let keys = (<WebStorageServiceInterface>this.constructor).keys; // get keys from child class
        if (clearType === 'decorators') {
            for (let key of keys) {
                this.storage.removeItem(key);
            }
        } else if (clearType === 'prefix') {
            for (let key in this.storage) {
                if (this.storage.getItem(key).startsWith(WEBSTORAGE_CONFIG.prefix)) {
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
