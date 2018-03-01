import {
    CookiesStorageService,
    LocalStorageService,
    SessionStorageService,
    WebStorageServiceInterface
} from '../service/index';
import { cookiesStorageUtility, localStorageUtility, sessionStorageUtility, sharedStorageUtility } from '../utility/index';
import { SharedStorageService } from '../service/shared-storage.service';
import { WebStorageUtility } from '../utility/webstorage.utility';
import { Cache } from './cache';
import {
    CookieStorageDecoratorConfig, DecoratorConfig, LocalStorageDecoratorConfig,
    SessionStorageDecoratorConfig, WebStorageDecoratorConfig
} from '../ngx-store.types';

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
        let key: string;
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
            utilities: [{
                utility: webStorageUtility,
                config: config,
            }],
        });

        Object.defineProperty(target, propertyName, {
            get: function() {
                return cacheItem.getProxy(undefined, config);
            },
            set: function(value: any) {
                if (!Cache.get(cacheItem.key)) {
                    cacheItem = Cache.getCacheFor(cacheItem);
                }
                cacheItem.addTargets([target]);
                cacheItem.currentTarget = target;
                cacheItem.saveValue(value, config);
            },
        });
        return target;
    };
}
