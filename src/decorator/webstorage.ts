import {
    CookiesStorageService,
    LocalStorageService,
    SessionStorageService,
    WebStorageServiceInterface
} from '../service/index';
import { cookiesStorageUtility, localStorageUtility, sessionStorageUtility, sharedStorageUtility } from '../utility/index';
import { SharedStorageService } from '../service/shared-storage.service';
import { NgxStorageEvent } from '../utility/storage/storage-event';
import { WebStorageUtility } from '../utility/webstorage.utility';
import { Cache } from './cache';
import {
    CookieStorageDecoratorConfig, DecoratorConfig, LocalStorageDecoratorConfig,
    SessionStorageDecoratorConfig, WebStorageDecoratorConfig
} from '../ngx-store.types';
import { Subject } from 'rxjs';
import { filter, withLatestFrom } from 'rxjs/operators';
import { Config } from '../config/config';

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

        if (config.asSubject === undefined) {
            config.asSubject = Config.decoratorDefaultToSubject;
        }

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

        function getCache() {
            return cacheItem.getProxy(undefined, config);
        }

        function setCache(value: any) {
            if (!Cache.get(cacheItem.key)) {
                cacheItem = Cache.getCacheFor(cacheItem);
            }
            cacheItem.addTargets([target]);
            cacheItem.currentTarget = target;
            cacheItem.saveValue(value, config);
        }

        let propertyDescriptor: PropertyDescriptor;
        if (config.asSubject) {
            const subject = new Subject();
            subject.next(getCache());
            subject.subscribe(setCache);
            webStorageUtility.changes.pipe(
                filter(changeEvent => changeEvent.key === cacheItem.key),
                withLatestFrom(subject),
                filter(([changeEvent, subjectValue]) => changeEvent.newValue !== subjectValue)
            ).subscribe(subject);

            propertyDescriptor = { value: subject };
        } else {
            propertyDescriptor = { get: getCache, set: setCache };
        }

        Object.defineProperty(target, propertyName, propertyDescriptor);

        return target;
    };
}
