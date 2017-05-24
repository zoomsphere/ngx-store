import { WebStorageConfigInterface } from './config.interface';

const DefaultConfig: WebStorageConfigInterface = {
    prefix: 'angular2_ws', // TODO: change default to 'ngx_'
    clearType: 'decorators', // TODO: change default to 'prefix'
    mutateObjects: true
};

// TODO allow to set configuration in node-config (`config` on npm)
// take configuration provided as a global variable
declare const NGXSTORE_CONFIG: WebStorageConfigInterface;

/**
 * @deprecated define global variable `NGXSTORE_CONFIG` instead
 */
export const WEBSTORAGE_CONFIG = DefaultConfig;

// merge default config, deprecated config and global config all together
export const Config = Object.assign({}, DefaultConfig, WEBSTORAGE_CONFIG, NGXSTORE_CONFIG);
