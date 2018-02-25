import { WebStorageUtility } from './webstorage.utility';

export class SharedStorageUtility extends WebStorageUtility {
    public getSettable(value: any): any {
        return value;
    }

    public getGettable(value: any): any {
        return value;
    }
}
