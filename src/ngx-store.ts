// Public classes.
// export { SumService } from '../src3/services/sum.service';
// export { ArithmeticModule } from '../src3/modules/arithmetic.module';
import { NgModule } from '@angular/core';
import { WebStorageService, CookiesStorageService, LocalStorageService, SessionStorageService, SharedStorageService } from './service/index';

export { CookieStorage, LocalStorage, SessionStorage, SharedStorage } from './decorator/webstorage';
export { WebStorageService, CookiesStorageService, LocalStorageService, SessionStorageService, SharedStorageService };
export { WebStorageConfigInterface, WEBSTORAGE_CONFIG } from './config/index';
export { Webstorable, WebstorableArray, WebstorableObject } from './ngx-store.types';
// export { WebstorableObject, WebstorableArray };
export { NgxStorageEvent } from './utility/storage/storage-event';

@NgModule({
    providers: [
        LocalStorageService,
        SessionStorageService,
        CookiesStorageService,
        SharedStorageService,
    ]
})
export class WebStorageModule {}
