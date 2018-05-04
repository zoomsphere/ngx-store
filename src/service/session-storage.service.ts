import { WebStorageService } from './webstorage.service';
import { sessionStorageUtility } from '../utility/index';
import { Injectable } from '@angular/core';
import { Observable, fromEvent, merge } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { NgxStorageEvent } from '../utility/storage/storage-event';

@Injectable()
export class SessionStorageService extends WebStorageService {
    public static keys: Array<string> = [];

    constructor() {
        super(sessionStorageUtility);
        this._changes =
            merge(fromEvent<NgxStorageEvent>(window, 'storage')
                  .pipe(
                      filter((event: NgxStorageEvent) => event.storageArea === sessionStorage),
                      map((event: NgxStorageEvent) => this.mapNativeEvent(event))
                  ),
                  sessionStorageUtility.changes);
    }
}
