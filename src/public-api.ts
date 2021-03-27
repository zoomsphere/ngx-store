/*
 * Public API Surface of ngx-store
 */

// Public classes.
export { CookieStorage, LocalStorage, SessionStorage, SharedStorage, SharedStorage as TempStorage } from './lib/decorator/webstorage';
export { WebStorageService } from './lib/service/webstorage.service';
export { CookiesStorageService, CookiesStorageService as CookieStorageService } from './lib/service/cookies-storage.service';
export { SharedStorageService, SharedStorageService as TempStorageService } from './lib/service/shared-storage.service';
export { LocalStorageService } from './lib/service/local-storage.service';
export { SessionStorageService } from './lib/service/session-storage.service';
export { WebStorageConfigInterface } from './lib/config/config.interface';
export { Webstorable, WebstorableArray, WebstorableObject } from './lib/ngx-store.types';
export { NgxStorageEvent } from './lib/utility/storage/storage-event';
export { Resource as NgxResource } from './lib/service/resource';
export { NgxStoreModule, NgxStoreModule as WebStorageModule } from './lib/ngx-store.module';
export * from './lib/ngx-store.types';
