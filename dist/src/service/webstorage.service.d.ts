export interface WebStorageServiceInterface {
    keys: Array<string>;
    new (): {
        get(key: string): any;
        set(key: string, value: any): void;
        remove(key: string): void;
        clear(): void;
    };
}
export declare abstract class WebStorageService {
    protected storage: Storage;
    static keys: Array<string>;
    constructor(storage: Storage);
    get(key: string): any;
    set(key: string, value: any): void;
    remove(key: string): void;
    clear(): void;
}
export declare class LocalStorageService extends WebStorageService {
    static keys: Array<string>;
    constructor();
}
export declare class SessionStorageService extends WebStorageService {
    static keys: Array<string>;
    constructor();
}
