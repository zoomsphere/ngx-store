import { Config } from '../config';
import { WebStorageUtility } from './webstorage-utility';

export const localStorageUtility: WebStorageUtility =
    new WebStorageUtility(localStorage, Config.prefix, Config.previousPrefix);
export const sessionStorageUtility: WebStorageUtility =
    new WebStorageUtility(sessionStorage, Config.prefix, Config.previousPrefix);
