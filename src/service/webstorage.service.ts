import { Injectable } from '@angular/core';
import { ClearType, Config } from '../config';
import { WebStorageConfigInterface } from '../config/config.interface';
import { WebStorageUtilityClass } from '../utility/webstorage-utility.class';
import { localStorageUtility, sessionStorageUtility } from '../utility';

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

    protected _webStorageUtility: WebStorageUtilityClass;

    public constructor(protected webStorageUtility: WebStorageUtilityClass) {
        this._webStorageUtility = webStorageUtility;
    }

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
        return this._webStorageUtility.get(key);
    }

    public set(key: string, value: any): void {
        return this._webStorageUtility.set(key, value);
    }

    // TODO return true if item existed and false otherwise (?)
    public remove(key: string): void {
        return this._webStorageUtility.remove(key);
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
                this._webStorageUtility.remove(key);
            }
        } else if (clearType === 'prefix') {
            prefix = prefix || Config.prefix;
            this._webStorageUtility.forEach((key) => {
                if (key.startsWith(prefix)) {
                    this._webStorageUtility.remove(key);
                }
            });
        } else if (clearType === 'all') {
            this._webStorageUtility.clear();
        }
    }
}

@Injectable()
export class LocalStorageService extends WebStorageService {
    public static keys: Array<string> = [];

    constructor() {
        super(localStorageUtility);
    }
}

@Injectable()
export class SessionStorageService extends WebStorageService {
    public static keys: Array<string> = [];

    constructor() {
        super(sessionStorageUtility);
    }
}
