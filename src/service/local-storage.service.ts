import { WebStorageService } from './webstorage.service';
import { localStorageUtility } from '../utility/index';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { NgxStorageEvent } from '../utility/storage/storage-event';

@Injectable()
export class LocalStorageService extends WebStorageService {
    public static keys: Array<string> = [];

    constructor() {
        super(localStorageUtility);
        this._changes = Observable.fromEvent<NgxStorageEvent>(window, 'storage')
            .filter((event: NgxStorageEvent) => event.storageArea === localStorage)
            .map((event) => {
                Object.defineProperty(event, 'type', {
                    configurable: false,
                    writable: false,
                    enumerable: true,
                    value: localStorageUtility.getStorageName(),
                });
                return event;
            }).merge(localStorageUtility.changes);
    }
}
