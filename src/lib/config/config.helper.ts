export const CONFIG_PREFIX = 'NGX-STORE_';

export class ConfigHelper {
    public static getItem(key: string): any {
      return localStorage.getItem(CONFIG_PREFIX + key);
    }

    public static setItem(key: string, item: any): void {
      return localStorage.setItem(CONFIG_PREFIX + key, item);
    }
}
