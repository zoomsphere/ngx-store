import { Config, debug } from '../config/config';
import { ClearType, WebStorageConfigInterface } from '../config/config.interface';
import { WebStorageUtility } from '../utility/webstorage.utility';
import { WebStorageServiceInterface } from './webstorage.interface';
import { Cache } from '../decorator/cache';
import { Observable } from 'rxjs';
import { delay, filter } from 'rxjs/operators';
import { NgxStorageEvent } from '../utility/storage/storage-event';
import { Resource } from './resource';
import merge from 'lodash.merge';

// const merge = require('lodash.merge');

export abstract class WebStorageService {
  public static keys: Array<string> = [];
  // @ts-ignore
  protected _changes: Observable<NgxStorageEvent>;

  protected constructor(public utility: WebStorageUtility) {
  }

  /**
   * Gets keys for stored variables created by ngx-store,
   * ignores keys that have not been created by decorators and have no prefix at once
   */
  public get keys(): Array<string> {
    // get prefixed key if prefix is defined
    const prefixKeys = this.utility.keys.filter(key => {
      if (this.utility.prefix && this.utility.prefix.length) {
        return key.startsWith(this.utility.prefix);
      }
      return true;
    });
    const decoratorKeys = (this.constructor as WebStorageServiceInterface).keys;
    return prefixKeys.concat(decoratorKeys);
  }

  public get config(): WebStorageConfigInterface {
    return Config;
  }

  public get(key: string): any {
    return this.utility.get(key);
  }

  /**
   * Returns new data Resource for given key exposing builder design pattern
   * designed for complex nested data structures
   */
  public load(key: string): Resource<any> {
    return new Resource(this, key);
  }

  public set<T>(key: string, value: T): T {
    return this.utility.set(key, value) as T;
  }

  public update(key: string, changes: any): any {
    const value = this.get(key);
    if (value !== undefined && typeof value !== 'object') {
      debug.throw(new Error(`Value stored under "${key}" key is not an object and tried to be updated.`));
      return value;
    }
    return this.set(key, merge({}, value, changes));
  }

  // TODO return true if item existed and false otherwise (?)
  public remove(key: string): void {
    return this.utility.remove(key);
  }

  public observe(key?: string, exactMatch?: boolean): Observable<NgxStorageEvent> {
    return this._changes.pipe(
      filter((event: NgxStorageEvent) => {
        if (!key) {
          return true;
        }
        if (exactMatch) {
          if (Config.prefix && key.startsWith(Config.prefix)) {
            return event.key === key;
          }
          return event.key === Config.prefix + key;
        } else {
          return event.key?.indexOf(key) !== -1;
        }
      }),
      delay(30), // event should come after actual data change and propagation
    );
  }

  /**
   * Clears chosen data from Storage
   * @param clearType 'prefix' | 'decorators' | 'all'
   * @param prefixOrClass defines the prefix or class (not its instance) whose decorators should be cleared
   */
  public clear(clearType?: ClearType, prefixOrClass?: string | object): void {
    clearType = clearType || Config.clearType;
    if (clearType === 'decorators') {
      let keys = [];
      if (typeof prefixOrClass === 'object') {
        keys = this.keys.filter(key => Cache.get(key).targets.includes(prefixOrClass as object));
        debug.log(this.utility.getStorageName() + ' > Removing decorated data from '
          + prefixOrClass.constructor.name + ':', keys);
      } else {
        keys = this.keys;
        debug.log(this.utility.getStorageName() + ' > Removing decorated data:', keys);
      }
      keys.forEach(key => this.remove(key));
    } else if (clearType === 'prefix') {
      prefixOrClass = prefixOrClass || this.utility.prefix;
      this.utility.forEach((value, key) => {
        if (key.startsWith(prefixOrClass as string)) {
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

  protected mapNativeEvent(ev: StorageEvent): NgxStorageEvent {
    const event = this.generateEvent(
      ev.key as string,
      this.utility.getGettable(ev.newValue as string),
      this.utility.getGettable(ev.oldValue as string));
    event.isInternal = false;
    return event;
  }
}
