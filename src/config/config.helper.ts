import { WebStorageUtility } from '../utility/webstorage-utility';

export class ConfigHelper {
    protected static _webStorageUtility: WebStorageUtility =
        new WebStorageUtility(localStorage, 'NGX-STORE_');

    public static getItem(key: string): any {
        return this._webStorageUtility.get(key);
    }

    public static setItem(key: string, item: any): any {
        return this._webStorageUtility.set(key, item);
    }
}
