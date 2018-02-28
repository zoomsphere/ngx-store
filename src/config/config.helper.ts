import { WebStorageUtility } from '../utility/webstorage.utility';

export const CONFIG_PREFIX = 'NGX-STORE_';

export class ConfigHelper {
    protected static _webStorageUtility: WebStorageUtility =
        new WebStorageUtility(localStorage, CONFIG_PREFIX);

    public static getItem(key: string): any {
        return ConfigHelper._webStorageUtility.get(key);
    }

    public static setItem(key: string, item: any): any {
        return ConfigHelper._webStorageUtility.set(key, item);
    }
}
