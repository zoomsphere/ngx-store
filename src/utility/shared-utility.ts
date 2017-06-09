import { WebStorageUtility } from './webstorage-utility';
import { SharedStorage } from './storage/shared-storage';

export class SharedStorageUtility extends WebStorageUtility {
    public constructor(storage: SharedStorage, prefix?: string, previousPrefix?: string) {
        super(storage, '', '');
    }

    public getSettable(value: any): any {
        return value;
    }

    public getGettable(value: any): any {
        return value;
    }
}
