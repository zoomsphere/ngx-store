import {
    CookiesStorageService,
    LocalStorageService,
    SessionStorageService,
    WebStorageServiceInterface
} from '../service';
import { cookiesStorageUtility, localStorageUtility, sessionStorageUtility, sharedStorageUtility } from '../utility';
import { SharedStorageService } from '../service/shared-storage.service';
import { WebStorageUtility } from '../utility/webstorage-utility';
import { Cache } from './cache';

export interface WebStorageDecoratorConfig {
    key?: string;
}
export interface StorageDecoratorConfig {
    mutate?: boolean;
}
export interface LocalStorageDecoratorConfig extends StorageDecoratorConfig { }
export interface SessionStorageDecoratorConfig extends StorageDecoratorConfig { }
export interface CookieStorageDecoratorConfig extends WebStorageDecoratorConfig {
    expires?: Date;
}
export type DecoratorConfig = LocalStorageDecoratorConfig & SessionStorageDecoratorConfig & CookieStorageDecoratorConfig;

export function LocalStorage(config?: LocalStorageDecoratorConfig);
export function LocalStorage(key?: string, config?: LocalStorageDecoratorConfig) {
    return WebStorage(localStorageUtility, LocalStorageService, key, config);
}
export function SessionStorage(config?: SessionStorageDecoratorConfig);
export function SessionStorage(key?: string, config?: SessionStorageDecoratorConfig) {
    return WebStorage(sessionStorageUtility, SessionStorageService, key, config);
}
export function CookieStorage(config?: CookieStorageDecoratorConfig);
export function CookieStorage(key?: string, config?: CookieStorageDecoratorConfig) {
    return WebStorage(cookiesStorageUtility, CookiesStorageService, key, config);
}
export function SharedStorage(config?: WebStorageDecoratorConfig);
export function SharedStorage(key?: string, config?: WebStorageDecoratorConfig) {
    return WebStorage(sharedStorageUtility, SharedStorageService, key, config);
}

function WebStorage(
    webStorageUtility: WebStorageUtility,
    service: WebStorageServiceInterface,
    keyOrConfig: string | DecoratorConfig,
    config: DecoratorConfig = {}
) {
    return (target: any, propertyName: string): void => {
        let key;
        if (typeof keyOrConfig === 'object') {
            key = keyOrConfig.key;
            config = keyOrConfig;
        } else if (typeof keyOrConfig === 'string') {
            key = keyOrConfig;
        }
        key = key || config.key || propertyName;

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
