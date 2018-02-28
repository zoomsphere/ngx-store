// Public classes.
import { NgModule } from '@angular/core';
import { WebStorageService, CookiesStorageService, LocalStorageService, SessionStorageService, SharedStorageService } from './service/index';

export { CookieStorage, LocalStorage, SessionStorage, SharedStorage, SharedStorage as TempStorage } from './decorator/webstorage';
export { WebStorageService, CookiesStorageService, LocalStorageService, SessionStorageService, SharedStorageService, SharedStorageService as TempStorageService } from './service/index';
export { WebStorageConfigInterface } from './config/index';
export { Webstorable, WebstorableArray, WebstorableObject } from './ngx-store.types';
export { NgxStorageEvent } from './utility/storage/storage-event';
export { Resource as NgxResource } from './service/resource';

@NgModule({
    providers: [
        LocalStorageService,
        SessionStorageService,
        CookiesStorageService,
        SharedStorageService,
    ]
})
export class WebStorageModule {}
