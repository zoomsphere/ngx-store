import { WebStorageService } from './webstorage.service';
import { cookiesStorageUtility } from '../utility/index';
import { Injectable } from '@angular/core';

@Injectable()
export class CookiesStorageService extends WebStorageService {
    public static keys: Array<string> = [];

    constructor() {
        super(cookiesStorageUtility);
    }

    public set(key: string, value: any, expirationDate?: Date): any {
        return this.utility.set(key, value, { expires: expirationDate });
    }
}
