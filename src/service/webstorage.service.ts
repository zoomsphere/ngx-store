import { Injectable } from '@angular/core';
import { WebStorageUtility } from '../utility/webstorage.utility';

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

    clear(): void {
        for (let key of (<WebStorageServiceInterface>this.constructor).keys) {
            this.storage.removeItem(key);
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
