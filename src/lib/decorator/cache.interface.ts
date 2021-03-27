import { WebStorageServiceInterface } from '../service/webstorage.interface';
import { WebStorageUtility } from '../utility/webstorage.utility';
import { DecoratorConfig } from '../ngx-store.types';

export interface CacheItemInterface {
  key: string;
  name: string;
  targets: Array<object>;
  services: Array<WebStorageServiceInterface>;
  utilities: Array<UtilityEntry>;
}

export interface UtilityEntry {
  utility: WebStorageUtility;
  config?: DecoratorConfig;
}
