export interface Webstorable {
    save(): void;
}
export type WebstorableObject = Webstorable & {[prop: string]: any};
export type WebstorableArray<T> = Webstorable & Array<T>;

// TODO create config interface for service methods
export interface WebStorageDecoratorConfig {
    key?: string;
}
export interface StorageDecoratorConfig extends WebStorageDecoratorConfig {
    prefix?: string;
    mutate?: boolean;
}
export interface LocalStorageDecoratorConfig extends StorageDecoratorConfig { }
export interface SessionStorageDecoratorConfig extends StorageDecoratorConfig { }
export interface CookieStorageDecoratorConfig extends StorageDecoratorConfig {
    expires?: Date;
}
export type DecoratorConfig = CookieStorageDecoratorConfig; // should contain all fields
