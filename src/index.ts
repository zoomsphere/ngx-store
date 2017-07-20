import { NgModule } from '@angular/core';
import { CookiesStorageService, LocalStorageService, SessionStorageService } from './service';
import { SharedStorageService } from './service/shared-storage.service';

export { CookieStorage, LocalStorage, SessionStorage, SharedStorage } from './decorator/webstorage'
export { WebStorageService, CookiesStorageService, LocalStorageService, SessionStorageService, SharedStorageService } from './service';
export { WebStorageConfigInterface, WEBSTORAGE_CONFIG } from './config';
export declare class Webstorable {
    save(): void;
}
export type WebstorableObject = Webstorable & Object;
export type WebstorableArray<T> = Webstorable & Array<T>;

@NgModule({
    providers: [
        LocalStorageService,
        SessionStorageService,
        CookiesStorageService,
        SharedStorageService,
    ]
})
export class WebStorageModule {}
