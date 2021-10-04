export interface Webstorable {
  save(): void;
}

export type WebstorableObject = Webstorable & { [prop: string]: any };
export type WebstorableArray<T> = Webstorable & Array<T>;

// TODO create config interface for service methods
export interface WebStorageDecoratorConfig {
  key?: string;
  mutate?: boolean;
}

export interface StorageDecoratorConfig extends WebStorageDecoratorConfig {
  prefix?: string;
}

export interface SessionStorageDecoratorConfig extends StorageDecoratorConfig {
}

export interface LocalStorageDecoratorConfig extends StorageDecoratorConfig {
  migrateKey?: string;
}

export interface CookieStorageDecoratorConfig extends LocalStorageDecoratorConfig {
  expires?: Date;
}

export type DecoratorConfig = CookieStorageDecoratorConfig; // should contain all fields
