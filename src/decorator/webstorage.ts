import {
    CookiesStorageService,
    LocalStorageService,
    SessionStorageService,
    WebStorageServiceInterface
} from '../service';
import { cookiesStorageUtility, localStorageUtility, sessionStorageUtility } from '../utility';
import { WebStorageUtility } from '../utility/webstorage-utility';
import { Cache } from './cache';

export function LocalStorage(key?: string) {
    return WebStorage(localStorageUtility, LocalStorageService, key);
}

export function SessionStorage(key?: string) {
    return WebStorage(sessionStorageUtility, SessionStorageService, key);
}
export function CookieStorage(key?: string) {
    return WebStorage(cookiesStorageUtility, CookiesStorageService, key);
}

function WebStorage(webStorageUtility: WebStorageUtility, service: WebStorageServiceInterface, key: string) {
    return (target: any, propertyName: string): void => {
        key = key || propertyName;

        let cacheItem = Cache.getCacheFor({
            key: key,
            name: propertyName,
            targets: [ target ],
            services: [ service ],
            utilities: [ webStorageUtility ]
        });

        let proxy = cacheItem.getProxy();

        Object.defineProperty(target, propertyName, {
            get: function() {
                return proxy;
            },
            set: function(value: any) { // TODO: handle combined decorators
                proxy = cacheItem.saveValue(value);

            },
        });
        return target;
    }
}
