import { WebStorageService } from './webstorage.service';
import { localStorageUtility } from '../utility/index';
import { Injectable } from '@angular/core';

@Injectable()
export class LocalStorageService extends WebStorageService {
    public static keys: Array<string> = [];

    constructor() {
        super(localStorageUtility);
    }
}
