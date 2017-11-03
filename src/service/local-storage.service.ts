import { WebStorageService } from './webstorage.service';
import { localStorageUtility } from '../utility/index';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class LocalStorageService extends WebStorageService {
    public static keys: Array<string> = [];

    constructor() {
        super(localStorageUtility);
        this._changes = Observable.fromEvent(window, 'storage')
            .filter((event: StorageEvent) => event.storageArea === localStorage);
    }
}
