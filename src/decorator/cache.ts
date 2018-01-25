import { CacheItem, CacheItemInterface } from './cache-item';
import { debug } from '../config/config';

export class Cache {
    public static items: Map<string, CacheItem> = new Map();

    public static getCacheFor(cacheCandidate: CacheItemInterface): CacheItem {
        let cacheItem = Cache.get(cacheCandidate.key);
        if (!cacheItem) {
            cacheItem = new CacheItem(cacheCandidate);
            debug.log(`Created new CacheItem for ${cacheCandidate.name} for ${cacheItem.utilities[0].utility.getStorageName()}`);
            Cache.set(cacheItem);
            return cacheItem;
        }
        debug.log(`Loaded prior CacheItem of ${cacheItem.name} for ${cacheCandidate.utilities[0].utility.getStorageName()}`);
        cacheItem.addTargets(cacheCandidate.targets);
        cacheItem.addServices(cacheCandidate.services);
        cacheItem.addUtilities(cacheCandidate.utilities);
        Cache.set(cacheItem);
        return cacheItem;
    }

    public static remove(cacheItem: CacheItem): boolean {
        return Cache.items.delete(cacheItem.key);
    }

    public static get(key: string): CacheItem {
        return Cache.items.get(key);
    }

    protected static set(cacheItem: CacheItem): void {
        if (!Cache.get(cacheItem.key)) {
            debug.log('CacheItem for ' + cacheItem.key, cacheItem);
        }
        Cache.items.set(cacheItem.key, cacheItem);
    }
}
