import { WebStorageServiceInterface } from '../service';
import { WebStorageUtility } from '../utility/webstorage.utility';
import { Config, debug } from '../config/index';
import { DecoratorConfig } from './webstorage';
import { Cache } from './cache';

const isEqual = require('lodash.isequal');

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
    public currentTarget: Object;
    protected proxy: any = null;
    protected _key: string = '';
    protected initializedTargets: Set<Object> = new Set();

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

    public saveValue(value: any, config: DecoratorConfig = {}, source?: WebStorageUtility): any {
        debug.groupCollapsed('CacheItem#saveValue for ' + this.key + ' in ' + this.currentTarget.constructor.name);
        debug.log('new value: ', value);
        debug.log('previous value: ', this.readValue(config));
        debug.log('targets.length: ', this.targets.length);
        debug.log('currentTarget:', this.currentTarget);
        debug.groupEnd();

        // prevent overwriting value by initializators
        if (!this.initializedTargets.has(this.currentTarget)) {
            this.initializedTargets.add(this.currentTarget);
            const readValue = this.readValue(config);
            const savedValue = (readValue !== null && readValue !== undefined) ? readValue : value;
            let proxy = this.getProxy(savedValue, config);
            proxy = (proxy !== null) ? proxy : value;
            debug.log('initial value for ' + this.key + ' in ' + this.currentTarget.constructor.name, proxy);
            this.propagateChange(savedValue, config, source);
            return proxy;
        }
        this.propagateChange(value, config, source);
        return this.getProxy(value, config);
    }

    public getProxy(value?: any, config: DecoratorConfig = {}): any {
        if (value === undefined && this.proxy) return this.proxy; // return cached proxy if value hasn't changed
        value = (value === undefined) ? this.readValue(config) : value;
        if (typeof value !== 'object' || value === null) {
            this.proxy = value;
            return value;
        }
        if ((!Config.mutateObjects && !config.mutate) || config.mutate === false) return value;

        const _self = this; // alias to use in standard function expressions
        const prototype: any = Object.assign(new value.constructor(), value.__proto__);

        prototype.save = function () { // add method for triggering force save
            _self.saveValue(value, config);
        };

        // TODO set prototype for Array.prototype or something
        if (Array.isArray(value)) { // handle methods that could change value of array
            const methodsToOverwrite = [
                'pop', 'push', 'reverse', 'shift', 'unshift', 'splice',
                'filter', 'forEach', 'map', 'fill', 'sort', 'copyWithin'
            ];
            for (const method of methodsToOverwrite) {
                prototype[method] = function () {
                    const readValue = _self.readValue(config);
                    const result = Array.prototype[method].apply(readValue, arguments);
                    debug.log('Saving value for ' + _self.key + ' by method ' + prototype.constructor.name + '.' + method);
                    _self.saveValue(readValue, config);
                    return result;
                };
            }
        }
        Object.setPrototypeOf(value, prototype);
        this.proxy = value;
        return value;
    }

    public readValue(config: DecoratorConfig = {}): any {
        let value = null;
        this.utilities.forEach(utility => {
            if (value === null) {
                value = utility.get(this._key, config);
            }
        });
        return (typeof value !== 'object') ? value : JSON.parse(JSON.stringify(this.getProxy(value, config)));
    }

    public addTargets(targets: Array<any>): void {
        targets.forEach(target => {
            if (this.targets.indexOf(target) === -1) {
                if (typeof target === 'object') { // handle Angular Component destruction
                    const originalFunction = target.ngOnDestroy;
                    const _self = this;
                    target.ngOnDestroy = function() {
                        if (typeof originalFunction === 'function') {
                            originalFunction.apply(this, arguments);
                        }
                        target.ngOnDestroy = originalFunction || function() {};

                        _self.initializedTargets.delete(target);
                        _self.targets = _self.targets.filter(t => t !== target);
                        if (!_self.targets.length) {
                            _self.services.forEach(service => {
                                service.keys = service.keys.filter(key => key !== _self._key);
                            });
                            _self.resetProxy();
                            Cache.remove(_self);
                        }
                        debug.groupCollapsed(`${_self.key} OnDestroy handler:`);
                        debug.log('removed target:', target.constructor.name);
                        debug.log('remaining targets:', _self.targets);
                        debug.log('cacheItem:', Cache.get(_self.key));
                        debug.groupEnd();
                    };
                    this.targets.push(target);
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

    public resetProxy(): void {
        this.proxy = null;
    }

    protected propagateChange(value: any, config: DecoratorConfig, source) {
        if (isEqual(value, this.readValue(config))) return;
        this.utilities.forEach(utility => {
            // updating service which the change came from would affect in a cycle
            if (utility === source) return;
            debug.log(`propagating change on ${this.key} to:`, utility);
            utility.set(this._key, value, config);
        });
    }
}
