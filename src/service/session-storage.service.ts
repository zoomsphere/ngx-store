import { WebStorageService } from './webstorage.service';
import { sessionStorageUtility } from '../utility/index';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class SessionStorageService extends WebStorageService {
    public static keys: Array<string> = [];

    constructor() {
        super(sessionStorageUtility);
        this._changes = Observable.fromEvent(window, 'storage')
            .filter((event: StorageEvent) => event.storageArea === sessionStorage);
    }
}
