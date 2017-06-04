import { NgModule } from '@angular/core';
import { LocalStorageService, SessionStorageService } from './service';

export { CookieStorage, LocalStorage, SessionStorage } from './decorator/webstorage'
export { WebStorageService, CookiesStorageService, LocalStorageService, SessionStorageService } from './service';
export { WebStorageConfigInterface, WEBSTORAGE_CONFIG } from './config';
export declare class Webstorable {
    save(): void;
}

@NgModule({
    providers: [
        LocalStorageService,
        SessionStorageService,
    ]
})
export class WebStorageModule {}
