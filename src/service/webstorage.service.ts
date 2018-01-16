import { debug, ClearType, Config, WebStorageConfigInterface } from '../config/index';
import { WebStorageUtility } from '../utility/webstorage-utility';
import { WebStorageServiceInterface } from './webstorage.interface';
import { Cache } from '../decorator/cache';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/delay';
import { NgxStorageEvent } from '../utility/storage/storage-event';
const merge = require('lodash.merge');

export abstract class WebStorageService {
    public static keys: Array<string> = [];
    protected _changes: Observable<NgxStorageEvent>;

    public constructor(public utility: WebStorageUtility) { }

    /**
     * Gets keys for stored variables created by ngx-store,
     * ignores keys that have not been created by decorators and have no prefix at once
     */
    public get keys(): Array<string> {
        // get prefixed key if prefix is defined
        const prefixKeys = this.utility.keys.filter(key => {
            return this.utility.prefix && key.startsWith(this.utility.prefix);
        });
        const decoratorKeys = (<WebStorageServiceInterface>this.constructor).keys;
        return prefixKeys.concat(decoratorKeys);
    }

    public get config(): WebStorageConfigInterface {
        return Config;
    }

    public get(key: string): any {
        return this.utility.get(key);
    }

    public set<T>(key: string, value: T): T {
        return this.utility.set(key, value);
    }

    public update(key: string, changes: any): any {
        const value = this.get(key);
        if (typeof value !== 'object') {
            debug.throw(new Error(`Value stored under "${key}" key is not an object and tried to be updated.`));
            return value;
        }
        return this.set(key, merge({}, value, changes));
    }

    // TODO return true if item existed and false otherwise (?)
    public remove(key: string): void {
        return this.utility.remove(key);
    }

    public observe(key?: string, exactMatch?: boolean) {
        return this._changes.filter((event: NgxStorageEvent) => {
            if (!key) { return true; }
            if (exactMatch) {
                if (key.startsWith(Config.prefix)) {
                    return event.key === key;
                }
                return event.key === Config.prefix + key;
            } else {
                return event.key.indexOf(key) !== -1;
            }
        }).delay(30); // event should come after actual data change and propagation
    }

    /**
     * Clears chosen data from Storage
     * @param clearType 'prefix' | 'decorators' | 'all'
     * @param secondParam defines the prefix or class (not its instance) whose decorators should be cleared
     */
    public clear(clearType?: ClearType, secondParam?: string | object): void {
        clearType = clearType || Config.clearType;
        if (clearType === 'decorators') {
            let keys = [];
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
                if (key.startsWith(<string>secondParam)) {
                    this.remove(this.utility.trimPrefix(key));
                }
            });
        } else if (clearType === 'all') {
            this.utility.clear();
        }
    }

    protected generateEvent(key: string, newValue: any, oldValue?: any): NgxStorageEvent {
        const type = this.utility.getStorageName().charAt(0).toLowerCase() + this.utility.getStorageName().slice(1);
        const event = new NgxStorageEvent(type, key, this.utility.getStorage());
        event.oldValue = (oldValue !== undefined) ? oldValue : this.get(key);
        event.newValue = newValue;
        return event;
    }
}
