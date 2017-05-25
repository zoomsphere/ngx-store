import { Config } from '../config';
import { WebStorageUtilityClass } from './webstorage-utility.class';

export const localStorageUtility: WebStorageUtilityClass =
    new WebStorageUtilityClass(localStorage, Config.prefix, Config.previousPrefix);
export const sessionStorageUtility: WebStorageUtilityClass =
    new WebStorageUtilityClass(sessionStorage, Config.prefix, Config.previousPrefix);
