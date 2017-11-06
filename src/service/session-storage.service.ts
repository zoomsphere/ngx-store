import { WebStorageService } from './webstorage.service';
import { sessionStorageUtility } from '../utility/index';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { NgxStorageEvent } from '../utility/storage/storage-event';
import { ClearType } from '../config/config.interface';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class SessionStorageService extends WebStorageService {
    public static keys: Array<string> = [];
    protected internalChanges: Subject<NgxStorageEvent> = new Subject();

    constructor() {
        super(sessionStorageUtility);
        this._changes = Observable.fromEvent(window, 'storage')
            .filter((event: NgxStorageEvent) => event.storageArea === sessionStorage)
            .merge(this.internalChanges);
    }

    public set(key: string, value: any): void {
        this.internalChanges.next(this.generateEvent(key, value));
        return super.set(key, value);
    }

    public clear(clearType?: ClearType, secondParam?: any): void {
        this.internalChanges.next(this.generateEvent(null, null));
        return super.clear(clearType, secondParam);
    }

    public remove(key: string): void {
        this.internalChanges.next(this.generateEvent(key, null));
        return super.remove(key);
    }
}
