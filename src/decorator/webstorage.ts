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

export function LocalStorage(keyOrConfig?: string | LocalStorageDecoratorConfig,
                             config?: LocalStorageDecoratorConfig) {
    return WebStorage(localStorageUtility, LocalStorageService, keyOrConfig, config);
}
export function SessionStorage(keyOrConfig?: string | SessionStorageDecoratorConfig,
                               config?: SessionStorageDecoratorConfig) {
    return WebStorage(sessionStorageUtility, SessionStorageService, keyOrConfig, config);
}
export function CookieStorage(keyOrConfig?: string | CookieStorageDecoratorConfig,
                              config?: CookieStorageDecoratorConfig) {
    return WebStorage(cookiesStorageUtility, CookiesStorageService, keyOrConfig, config);
}
export function SharedStorage(keyOrConfig?: string | WebStorageDecoratorConfig,
                              config?: WebStorageDecoratorConfig) {
    return WebStorage(sharedStorageUtility, SharedStorageService, keyOrConfig, config);
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
