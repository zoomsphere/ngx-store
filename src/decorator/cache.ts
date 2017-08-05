import { CacheItem, CacheItemInterface } from './cache-item';
import { debug } from '../config/config';

export class Cache {
    public static items: Map<string, CacheItem> = new Map();

    public static getCacheFor(cacheCandidate: CacheItemInterface): CacheItem {
        let cacheItem = this.get(cacheCandidate.key);
        if (!cacheItem) {
            debug.log('Created new CacheItem for ' + cacheCandidate.name);
            cacheItem = new CacheItem(cacheCandidate);
            this.set(cacheItem);
            return cacheItem;
        }
        debug.log('Loaded prior CacheItem of ' + cacheItem.name);
        cacheItem.addTargets(cacheCandidate.targets);
        cacheItem.addServices(cacheCandidate.services);
        cacheItem.addUtilities(cacheCandidate.utilities);
        this.set(cacheItem);
        return cacheItem;
    }

    public static remove(cacheItem: CacheItem): boolean {
        return this.items.delete(cacheItem.key);
    }

    public static get(key: string): CacheItem {
        return this.items.get(key);
    }

    protected static set(cacheItem: CacheItem): void {
        if (!this.get(cacheItem.key)) {
            debug.log('CacheItem for ' + cacheItem.key, cacheItem);
        }
        this.items.set(cacheItem.key, cacheItem);
    }
}
