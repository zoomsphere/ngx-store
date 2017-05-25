import { Config } from '../config';
import { WebStorageUtilityClass } from './webstorage-utility.class';

export const WebStorageUtility: WebStorageUtilityClass = new WebStorageUtilityClass(Config.prefix);
