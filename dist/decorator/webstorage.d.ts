import { Webstorable } from '../index';
export declare function LocalStorage(key?: string): Webstorable;
export declare function SessionStorage(key?: string): Webstorable;
export declare let WebStorage: (webStorage: Storage, key: string) => (target: Object, propertyName: string) => void;
