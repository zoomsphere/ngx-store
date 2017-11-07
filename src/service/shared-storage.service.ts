import { WebStorageService } from './webstorage.service';
import { sharedStorageUtility } from '../utility/index';
import { Injectable } from '@angular/core';
import { sharedStorage } from '../utility/storage/shared-storage';

@Injectable()
export class SharedStorageService extends WebStorageService {
    public static keys: Array<string> = [];

    constructor() {
        super(sharedStorageUtility);
        this._changes = sharedStorageUtility.changes;
    }
}
