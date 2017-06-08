import {
    CookiesStorageService,
    LocalStorageService,
    SessionStorageService,
    WebStorageServiceInterface
} from '../service';
import { cookiesStorageUtility, localStorageUtility, sessionStorageUtility } from '../utility';
import { WebStorageUtility } from '../utility/webstorage-utility';
import { Cache } from './cache';

export interface WebStorageDecoratorConfig {
    mutate?: boolean;
}
export interface LocalStorageDecoratorConfig extends WebStorageDecoratorConfig { }
export interface SessionStorageDecoratorConfig extends WebStorageDecoratorConfig { }
export interface CookieStorageDecoratorConfig extends WebStorageDecoratorConfig {
    expires?: Date;
}
export type DecoratorConfig = LocalStorageDecoratorConfig & SessionStorageDecoratorConfig & CookieStorageDecoratorConfig;

export function LocalStorage(key?: string, config?: LocalStorageDecoratorConfig) {
    return WebStorage(localStorageUtility, LocalStorageService, key, config);
}
export function SessionStorage(key?: string, config?: SessionStorageDecoratorConfig) {
    return WebStorage(sessionStorageUtility, SessionStorageService, key, config);
}
export function CookieStorage(key?: string, config?: CookieStorageDecoratorConfig) {
    return WebStorage(cookiesStorageUtility, CookiesStorageService, key, config);
}

function WebStorage(
    webStorageUtility: WebStorageUtility,
    service: WebStorageServiceInterface,
    key: string,
    config: DecoratorConfig = {}
) {
    return (target: any, propertyName: string): void => {
        key = key || propertyName;

        let cacheItem = Cache.getCacheFor({
            key: key,
            name: propertyName,
            targets: [ target ],
            services: [ service ],
            utilities: [ webStorageUtility ]
        });

        let proxy = cacheItem.getProxy(undefined, config);

        Object.defineProperty(target, propertyName, {
            get: function() {
                return proxy;
            },
            set: function(value: any) {
                proxy = cacheItem.saveValue(value, config);
            },
        });
        return target;
    }
}
