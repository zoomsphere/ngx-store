import {NgModule} from "@angular/core";
import {LocalStorageService, SessionStorageService} from "./service/webstorage.service";

export * from './decorator/index';
export * from './service/index';
export * from './utility/index';
export declare class Webstorable {
    save(): void;
}

@NgModule({
    providers: [LocalStorageService, SessionStorageService]
})
export class WebStorageModule {}
