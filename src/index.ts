import {NgModule} from "@angular/core";
import {LocalStorageService, SessionStorageService} from "./service/webstorage.service";

export { WebStorage, LocalStorage, SessionStorage } from './decorator/webstorage'
export { WebStorageService, LocalStorageService, SessionStorageService } from './service/webstorage.service';
export { WebStorageUtility } from './utility/webstorage.utility';
export declare class Webstorable {
    save(): void;
}

@NgModule({
    providers: [LocalStorageService, SessionStorageService]
})
export class WebStorageModule {}
