import { WebStorageServiceInterface } from '../service/webstorage.interface';
import { WebStorageUtility } from '../utility/webstorage-utility';
import { Config, debug } from '../config/config';
import { DecoratorConfig } from './webstorage';
import * as isEmpty from 'is-empty';
import { Cache } from './cache';

export interface CacheItemInterface {
    key: string;
    name: string;
    targets: Array<Object>;
    services: Array<WebStorageServiceInterface>;
    utilities: Array<WebStorageUtility>;
}

export class CacheItem implements CacheItemInterface {
    public name: string = '';
    public targets: Array<Object> = [];
    public services: Array<WebStorageServiceInterface> = [];
    public utilities: Array<WebStorageUtility> = [];
    protected proxy: any;
    protected _key: string = '';
    protected newTargetsCount: number = 0;

    constructor(cacheItem: CacheItemInterface) {
        this._key = cacheItem.key;
        this.name = cacheItem.name;
        this.addTargets(cacheItem.targets);
        this.addServices(cacheItem.services);
        this.addUtilities(cacheItem.utilities);
    }

    public get key() {
        return this._key;
    }

    public saveValue(value: any, config: DecoratorConfig = {}): any {
        debug.groupCollapsed('CacheItem#saveValue for ' + this.key);
        debug.log('new value ', value);
        debug.log('newTargetsCount ', this.newTargetsCount);
        debug.log('previous value: ', this.readValue(config));
        debug.log('targets.length: ', this.targets.length);
        debug.groupEnd();

        if (this.newTargetsCount) { // prevent overwriting value by initializators
            this.newTargetsCount--;
            let savedValue = this.readValue(config);
            if (!isEmpty(savedValue)) {
                let proxy = (this.newTargetsCount < this.targets.length-1)
                    ? this.proxy : this.getProxy(savedValue, config);
                proxy = proxy || value;
                debug.log('initial value for ' + this.key + ' in ' +
                    this.targets[this.newTargetsCount].constructor.name, proxy);
                return proxy;
            }
        }

        this.utilities.forEach(utility => {
            try {
                utility.set(this._key, value, config);
            } catch (e) {
                console.warn('[ngx-store] ' + utility.getStorageName() + ': error occurred while trying to save: ', value);
                console.error(e);
            }
        });
        return this.getProxy(value, config);
    }

    public getProxy(value?: any, config: DecoratorConfig = {}): any {
        if (!value && this.proxy) return this.proxy; // return cached proxy if value hasn't changed
        value = value || this.readValue(config);
        if (typeof value !== 'object' || value === null) {
            this.proxy = value;
            return value;
        }
        if ((!Config.mutateObjects && !config.mutate) || config.mutate === false) return value;

        let _this = this; // alias to use in standard function expressions
        let prototype: any = Object.assign(new value.constructor(), value.__proto__);

        prototype.save = function () { // add method for triggering force save
            _this.saveValue(value, config);
        };

        // TODO set prototype for Array.prototype or something
        if (Array.isArray(value)) { // handle methods changing value of array
            prototype = Object.assign({}, prototype, Array.prototype);
            // this.proxy = value;
            const methodsToOverwrite = [
                'join', 'pop', 'push', 'reverse', 'shift', 'unshift', 'splice',
                'filter', 'forEach', 'map', 'fill', 'sort', 'copyWithin'
            ];
            for (let method of methodsToOverwrite) {
                prototype[method] = function () {
                    let value = _this.readValue(config);
                    let result = Array.prototype[method].apply(value, arguments);
                    _this.saveValue(value, config);
                    return result;
                }
            }
        }
        Object.setPrototypeOf(value, prototype);
        this.proxy = value;
        return value;
    }

    public readValue(config: DecoratorConfig = {}): any {
        let value = null;
        this.utilities.forEach(utility => {
            if (!value) {
                value = utility.get(this._key, config);
            }
        });
        return value;
    }

    public addTargets(targets: Array<any>): void {
        targets.forEach(target => {
            if (this.targets.indexOf(target) === -1) {
                if (typeof target === 'object') { // handle Angular Component destruction
                    let originalFunction = target.ngOnDestroy;
                    target.ngOnDestroy = () => {
                        if (typeof originalFunction === 'function') {
                            originalFunction();
                        }
                        target.ngOnDestroy = originalFunction;

                        this.targets = this.targets.filter(t => t !== target);
                        if (!this.targets.length) {
                            this.services.forEach(service => {
                                service.keys = service.keys.filter(key => key !== this._key);
                            });
                            Cache.remove(this);
                        }
                        debug.group('OnDestroy handler:');
                        debug.log('removed target:', target.constructor.name);
                        debug.log('remaining targets:', this.targets);
                        debug.log('cacheItem removed?', Cache.items.get(this.key));
                        debug.groupEnd();
                    };
                    this.targets.push(target);
                    this.newTargetsCount++;
                }
            }
        });
    }

    public addServices(services: Array<WebStorageServiceInterface>): void {
        services.forEach(service => {
            if (this.services.indexOf(service) === -1) {
                service.keys.push(this._key);
                this.services.push(service);
            }
        });
    }

    public addUtilities(utilities: Array<WebStorageUtility>): void {
        utilities.forEach(utility => {
            if (this.utilities.indexOf(utility) === -1) {
                this.utilities.push(utility);
            }
        });
    }
}
