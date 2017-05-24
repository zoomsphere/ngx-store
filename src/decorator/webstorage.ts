import { WebStorageUtility } from '../utility/webstorage.utility';
import { LocalStorageService, SessionStorageService, WebStorageServiceInterface } from '../service/webstorage.service';
import * as isEmpty from 'is-empty';

export function LocalStorage(key?: string) {
    return WebStorage(localStorage, LocalStorageService, key);
}

export function SessionStorage(key?: string) {
    return WebStorage(sessionStorage, SessionStorageService, key);
}

// initialization cache
let cache: {[name: string]: boolean} = {};

function WebStorage(webStorage: Storage, service: WebStorageServiceInterface, key: string) {
    return (target: any, propertyName: string): void => {
        key = key || propertyName;

        if (target) { // handle Angular Component destruction
            let originalFunction = target.ngOnDestroy;
            target.ngOnDestroy = () => {
                cache[key] = false;
                if (typeof originalFunction === 'function') {
                    originalFunction();
                }
            };
        }

        let proxy = WebStorageUtility.get(webStorage, key);
        service.keys.push(key);

        Object.defineProperty(target, propertyName, {
            get: function() {
                return proxy;
            },
            set: function(value: any) {
                if (!cache[key]) { // first setter handle
                    if (isEmpty(proxy)) {
                        // if no value in localStorage, set it to initializer
                        proxy = WebStorageUtility.set(webStorage, key, value);
                    }
                    cache[key] = true;
                } else { // if there is no value in localStorage, set it to initializer
                    proxy = WebStorageUtility.set(webStorage, key, value);
                }

                // manual method for force save
                if (proxy instanceof Object) {
                    proxy.save = function () {
                        WebStorageUtility.set(webStorage, key, proxy);
                    };
                }

                // handle methods changing value of array
                if (Array.isArray(proxy)) {
                    const methodsToOverwrite = [
                        'join', 'pop', 'push', 'reverse', 'shift', 'unshift', 'splice',
                        'filter', 'forEach', 'map', 'fill', 'sort', 'copyWithin'
                    ];
                    for (let method of methodsToOverwrite) {
                        proxy[method] = function(value) {
                            let result = Array.prototype[method].apply(proxy, arguments);
                            WebStorageUtility.set(webStorage, key, proxy);
                            return result;
                        }
                    }
                }
            },
        });
    }
}
