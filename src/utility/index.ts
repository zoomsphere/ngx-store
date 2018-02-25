import { Config } from '../config/index';
import { WebStorageUtility } from './webstorage.utility';
import { cookiesStorage } from './storage/cookies-storage';
import { SharedStorageUtility } from './shared-storage.utility';
import { sharedStorage } from './storage/shared-storage';

export const localStorageUtility: WebStorageUtility =
    new WebStorageUtility(localStorage, Config.prefix, Config.previousPrefix);
export const sessionStorageUtility: WebStorageUtility =
    new WebStorageUtility(sessionStorage, Config.prefix, Config.previousPrefix);
export const cookiesStorageUtility: WebStorageUtility =
    new WebStorageUtility(cookiesStorage, Config.prefix, Config.previousPrefix);
export const sharedStorageUtility: SharedStorageUtility =
    new SharedStorageUtility(sharedStorage, Config.prefix, Config.prefix);
