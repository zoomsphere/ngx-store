import { WebStorageConfigInterface } from './config.interface';
import { ConfigHelper } from './config.helper';
import { Debugger } from 'ts-debug';

// TODO allow to set different config for local and session storage
// TODO check if NGXSTORE_CONFIG implements WebStorageConfigInterface
// TODO allow to set configuration in node-config (`config` on npm)

export { CONFIG_PREFIX } from './config.helper';

const DefaultConfig: WebStorageConfigInterface = {
    prefix: 'ngx_',
    previousPrefix: 'angular2ws_',
    clearType: 'prefix',
    mutateObjects: true,
    cookiesScope: '',
    cookiesCheckInterval: 0,
    debugMode: false,
};

// take configuration provided as a global variable
declare const NGXSTORE_CONFIG: WebStorageConfigInterface;

let ConfigFills: WebStorageConfigInterface = {};
const localStoragePrefix = ConfigHelper.getItem('prefix');

if (typeof NGXSTORE_CONFIG === 'object') {
    ConfigFills = Object.assign({}, NGXSTORE_CONFIG);
}

if (localStoragePrefix !== undefined && localStoragePrefix !== null) {
    ConfigFills.previousPrefix = localStoragePrefix;
} else if (ConfigFills.previousPrefix === undefined) {
    ConfigFills.previousPrefix = DefaultConfig.previousPrefix;
}

// merge default config, deprecated config and global config all together
export const Config: WebStorageConfigInterface =
    Object.assign({}, DefaultConfig, ConfigFills);

export const debug = new Debugger(console, Config.debugMode, '[ngx-store] ');
ConfigHelper.setItem('prefix', Config.prefix);
