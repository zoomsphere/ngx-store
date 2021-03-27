// tslint:disable:only-arrow-functions
import { LocalStorageService } from '../service/local-storage.service';
import { SessionStorageService } from '../service/session-storage.service';
import { CookiesStorageService } from '../service/cookies-storage.service';
import { WebStorageServiceInterface } from '../service/webstorage.interface';
import { cookiesStorageUtility, localStorageUtility, sessionStorageUtility, sharedStorageUtility } from '../utility';
import { SharedStorageService } from '../service/shared-storage.service';
import { WebStorageUtility } from '../utility/webstorage.utility';
import { Cache } from './cache';
import {
    CookieStorageDecoratorConfig, DecoratorConfig, LocalStorageDecoratorConfig,
    SessionStorageDecoratorConfig, WebStorageDecoratorConfig
} from '../ngx-store.types';
import { findDescriptor } from '../tools';

export type DecoratorReturn = (target: any, propertyName: string) => void;

export function LocalStorage(keyOrConfig?: string | LocalStorageDecoratorConfig,
                             config?: LocalStorageDecoratorConfig): DecoratorReturn {
    return WebStorage(localStorageUtility, LocalStorageService, keyOrConfig!, config);
}
export function SessionStorage(keyOrConfig?: string | SessionStorageDecoratorConfig,
                               config?: SessionStorageDecoratorConfig): DecoratorReturn {
    return WebStorage(sessionStorageUtility, SessionStorageService, keyOrConfig!, config);
}
export function CookieStorage(keyOrConfig?: string | CookieStorageDecoratorConfig,
                              config?: CookieStorageDecoratorConfig): DecoratorReturn {
    return WebStorage(cookiesStorageUtility, CookiesStorageService, keyOrConfig!, config);
}
export function SharedStorage(keyOrConfig?: string | WebStorageDecoratorConfig,
                              config?: WebStorageDecoratorConfig): DecoratorReturn {
    return WebStorage(sharedStorageUtility, SharedStorageService, keyOrConfig!, config);
}

function WebStorage(
    webStorageUtility: WebStorageUtility,
    service: WebStorageServiceInterface,
    keyOrConfig: string | DecoratorConfig,
    config: DecoratorConfig = {}
): DecoratorReturn {
    return (target: any, propertyName: string): void => {
        let key: string = '';
        if (typeof keyOrConfig === 'object') {
            key = keyOrConfig.key || '';
            config = keyOrConfig;
        } else if (typeof keyOrConfig === 'string') {
            key = keyOrConfig;
        }
        key = key || config.key || propertyName;

        let cacheItem = Cache.getCacheFor({
            key,
            name: propertyName,
            targets: [ target ],
            services: [ service ],
            utilities: [{
                utility: webStorageUtility,
                config,
            }],
        });

        /*if (propertyName === 'arrayOfObjects') {
            console.log('target:', target);
            debugger;
        }
        const prototype = target && Object.getPrototypeOf(target);
        const descriptor = prototype && findDescriptor(prototype, propertyName);
        const hasGetter = descriptor && typeof descriptor.get === 'function';
        const hasSetter = descriptor && typeof descriptor.set === 'function';
        if (hasGetter || hasSetter) {
            target[propertyName] = cacheItem.getProxy(undefined, config);
            return target;
        }*/
        Object.defineProperty(target, propertyName, {
            get: function(): any { // tslint:disable-line
                return cacheItem.getProxy(undefined, config);
            },
            set: function(value: any): void { // tslint:disable-line
                if (!Cache.get(cacheItem.key)) {
                    cacheItem = Cache.getCacheFor(cacheItem);
                }
                cacheItem.addTargets([target]);
                cacheItem.currentTarget = target;
                cacheItem.saveValue(value, config);
            },
            configurable: true,
        });
        return target;
    };
}
