import { NgModule } from '@angular/core';
import { LocalStorageService, SessionStorageService } from './service/webstorage.service';

export { LocalStorage, SessionStorage } from './decorator/webstorage'
export { WebStorageService, LocalStorageService, SessionStorageService } from './service/webstorage.service';
export { WebStorageUtility } from './utility';
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
