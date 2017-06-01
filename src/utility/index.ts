import { Config } from '../config';
import { WebStorageUtility } from './webstorage-utility';
import { cookiesStorage } from './cookies-storage';

export const localStorageUtility: WebStorageUtility =
    new WebStorageUtility(localStorage, Config.prefix, Config.previousPrefix);
export const sessionStorageUtility: WebStorageUtility =
    new WebStorageUtility(sessionStorage, Config.prefix, Config.previousPrefix);
export const cookiesStorageUtility: WebStorageUtility =
    new WebStorageUtility(cookiesStorage, Config.prefix, Config.previousPrefix);
