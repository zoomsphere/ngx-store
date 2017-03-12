import { WebStorageServiceInterface } from '../service/webstorage.service';
export declare function LocalStorage(key?: string): (target: Object, propertyName: string) => void;
export declare function SessionStorage(key?: string): (target: Object, propertyName: string) => void;
export declare let WebStorage: (webStorage: Storage, service: WebStorageServiceInterface, key: string) => (target: Object, propertyName: string) => void;
