import {WebStorageUtility} from '../utility/webstorage.utility';
import {LocalStorageService, SessionStorageService, WebStorageServiceInterface} from '../service/webstorage.service';


export function LocalStorage(key?: string) {
    return WebStorage(localStorage, LocalStorageService, key);
}

export function SessionStorage(key?: string) {
    return WebStorage(sessionStorage, SessionStorageService, key);
}

// initialization cache
let cache = {};

export let WebStorage = (webStorage: Storage, service: WebStorageServiceInterface, key: string) => {
    return (target: Object, propertyName: string): void => {
        key = key || propertyName;
        let proxy = target[propertyName];
        service.keys.push(key);

        Object.defineProperty(target, propertyName, {
            get: function() {
                return proxy;
            },
            set: function(value: any) {
                if (!cache[key]) { // first setter handle
                    proxy = WebStorageUtility.get(webStorage, key) || value;
                    cache[key] = true;
                } else { // if there is no value in localStorage, set it to initializer
                    proxy = value;
                    WebStorageUtility.set(webStorage, key, value);
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
};
