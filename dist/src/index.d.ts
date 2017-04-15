export { LocalStorage, SessionStorage } from './decorator/webstorage';
export { WebStorageService, LocalStorageService, SessionStorageService } from './service/webstorage.service';
export { WebStorageUtility } from './utility/webstorage.utility';
export declare class Webstorable {
    save(): void;
}
export declare let WEBSTORAGE_CONFIG: {
    prefix: string;
};
export declare class WebStorageModule {
}
