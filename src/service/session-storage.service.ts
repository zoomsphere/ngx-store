import { WebStorageService } from './webstorage.service';
import { sessionStorageUtility } from '../utility/index';
import { Injectable } from '@angular/core';

@Injectable()
export class SessionStorageService extends WebStorageService {
    public static keys: Array<string> = [];

    constructor() {
        super(sessionStorageUtility);
    }
}
