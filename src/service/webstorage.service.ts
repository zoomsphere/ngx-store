import { ClearType, Config } from '../config';
import { WebStorageConfigInterface } from '../config/config.interface';
import { WebStorageUtility } from '../utility/webstorage-utility';
import { WebStorageServiceInterface } from './webstorage.interface';
import { debug } from '../config/config';
import { Cache } from '../decorator/cache';

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
     * @param clearType 'prefix'
     * @param prefix defines the prefix
     */
    public clear(clearType?: 'prefix', prefix?: string): void;
    /**
     * Clears chosen data from Storage
     * @param clearType 'decorators'
     * @param target defines the class (not its instance) whose decorators should be cleared
     */
    public clear(clearType?: 'decorators', target?: Object): void;
    /**
     * Clears all data from Storage
     * @param clearType 'all'
     */
    public clear(clearType?: 'all'): void;
    public clear(clearType?: ClearType, secondParam?: any): void {
        clearType = clearType || Config.clearType;
        if (clearType === 'decorators') {
            let keys = [];
            debug.log('this.keys:', this.keys);
            if (typeof secondParam === 'object') {
                keys = this.keys.filter(key => Cache.get(key).targets.indexOf(secondParam) !== -1);
                debug.log(this.utility.getStorageName() + ' > Removing decorated data from ' + secondParam.constructor.name + ':', keys);
            } else {
                keys = this.keys;
                debug.log(this.utility.getStorageName() + ' > Removing decorated data:', keys);
            }
            keys.forEach(key => this.remove(key));
        } else if (clearType === 'prefix') {
            secondParam = secondParam || Config.prefix;
            this.utility.forEach((value, key) => {
                if (key.startsWith(secondParam)) {
                    this.remove(this.utility.trimPrefix(key));
                }
            });
        } else if (clearType === 'all') {
            this.utility.clear();
        }
    }
}
