import { cookiesStorage } from '../utility/storage/cookies-storage';
import { WebStorageService } from './webstorage.service';
import { cookiesStorageUtility } from '../utility/index';
import { merge } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class CookiesStorageService extends WebStorageService {
    public static keys: Array<string> = [];

    constructor() {
        super(cookiesStorageUtility);
        this._changes =
             merge(cookiesStorage.externalChanges.asObservable(),
                   cookiesStorageUtility.changes);
    }

    public set<T>(key: string, value: T, expirationDate?: Date): T {
        return this.utility.set(key, value, { expires: expirationDate });
    }
}
