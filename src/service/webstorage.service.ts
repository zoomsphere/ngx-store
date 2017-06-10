import { ClearType, Config } from '../config';
import { WebStorageConfigInterface } from '../config/config.interface';
import { WebStorageUtility } from '../utility/webstorage-utility';
import { WebStorageServiceInterface } from './webstorage.interface';
import { debug } from '../config/config';

export abstract class WebStorageService {
    public static keys: Array<string>;

    public constructor(public utility: WebStorageUtility) { }

    /**
     * Gets keys for stored variables created by ngx-store,
     * ignores keys that have not been created by decorators and have no prefix at once
     * @returns {Array<string>}
     */
    public get keys(): Array<string> {
        // get prefixed key if prefix is defined
        let prefixKeys = this.utility.keys.filter(key => {
            return this.utility.prefix && key.startsWith(this.utility.prefix);
        });
        let decoratorKeys = (<WebStorageServiceInterface>this.constructor).keys;
        return prefixKeys.concat(decoratorKeys);
    }

    public get config(): WebStorageConfigInterface {
        return Config;
    }

    public get(key: string): any {
        return this.utility.get(key);
    }

    public set(key: string, value: any): any {
        return this.utility.set(key, value);
    }

    // TODO return true if item existed and false otherwise (?)
    public remove(key: string): void {
        return this.utility.remove(key);
    }

    /**
     * Clears chosen data from Storage
     * @param clearType 'decorators', 'prefix' or 'all'
     * @param prefix if clearType = prefix, defines the prefix
     */
    public clear(clearType?: ClearType, prefix?: string): void {
        clearType = clearType || Config.clearType;
        if (clearType === 'decorators') {
            debug.log('Removing decorated data from ' + this.utility.getStorageName() + ':', this.keys);
            this.keys.forEach(key => this.remove(key));
        } else if (clearType === 'prefix') {
            prefix = prefix || Config.prefix;
            this.utility.forEach((value, key) => {
                if (key.startsWith(prefix)) {
                    this.remove(this.utility.trimPrefix(key));
                }
            });
        } else if (clearType === 'all') {
            this.utility.clear();
        }
    }
}
