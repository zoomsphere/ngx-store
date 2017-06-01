import { WebStorageConfigInterface } from '../config/config.interface';

export interface WebStorageServiceInterface {
    keys: Array<string>;
    new(): {
        keys: Array<string>;
        config: WebStorageConfigInterface;
        get(key: string): any;
        set(key: string, value: any): void;
        remove(key: string): void;
        clear(): void;
    }
}
