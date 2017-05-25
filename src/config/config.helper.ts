import { WebStorageUtilityClass } from '../utility/webstorage-utility.class';

export class ConfigHelper {
    protected static _webStorageUtility: WebStorageUtilityClass = new WebStorageUtilityClass('NGX-STORE_');

    public static getItem(key: string): any {
        return this._webStorageUtility.get(localStorage, key);
    }

    public static setItem(key: string, item: any): any {
        return this._webStorageUtility.set(localStorage, key, item);
    }
}
