import { WebStorageConfigInterface } from './config.interface';
import { ConfigHelper } from './config.helper';

// TODO allow to set different config for local and session storage
// TODO check if NGXSTORE_CONFIG implements WebStorageConfigInterface
// TODO allow to set configuration in node-config (`config` on npm)

const DefaultConfig: WebStorageConfigInterface = {
    prefix: 'ngx_',
    previousPrefix: 'angular2ws_',
    clearType: 'prefix',
    mutateObjects: true,
};

// take configuration provided as a global variable
declare const NGXSTORE_CONFIG: WebStorageConfigInterface;

let ConfigFills: WebStorageConfigInterface = {};
let localStoragePrefix = ConfigHelper.getItem('prefix');
if (localStoragePrefix) {
    ConfigFills.previousPrefix = localStoragePrefix;
} else if (NGXSTORE_CONFIG && NGXSTORE_CONFIG.previousPrefix !== undefined) {
    ConfigFills.previousPrefix = NGXSTORE_CONFIG.previousPrefix;
} else {
    ConfigFills.previousPrefix = DefaultConfig.previousPrefix;
}

/**
 * @deprecated define global variable `NGXSTORE_CONFIG` instead
 */
export let WEBSTORAGE_CONFIG = DefaultConfig;

// merge default config, deprecated config and global config all together
export const Config: WebStorageConfigInterface =
    Object.assign({}, DefaultConfig, WEBSTORAGE_CONFIG, NGXSTORE_CONFIG, ConfigFills);

ConfigHelper.setItem('prefix', Config.prefix);
