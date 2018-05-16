import { Config, debug } from '../../config/index';
import { NgxStorage } from './storage';
import { StorageName, WebStorageUtility } from '../webstorage.utility';
import { Observable, interval } from 'rxjs';

export interface WebStorage extends Storage {
   setItem(key: string, data: string, expirationDate?: Date): void;
}

export class CookiesStorage extends NgxStorage {
    protected cachedCookieString: string;
    protected cachedItemsMap: Map<string, string>;

    constructor() {
        super();
        this.getAllItems();
        if (Config.cookiesCheckInterval) {
            interval(Config.cookiesCheckInterval)
                .subscribe(() => {
                    if (!this.externalChanges.observers.length) {
                        return; // don't run if there are no set subscriptions
                    }
                    this.getAllItems();
                });
        }
    }

    public get type(): StorageName {
        return 'cookiesStorage';
    }

    public get length(): number {
        return this.getAllKeys().length;
    }

    public key(index: number): string | any {
        return this.getAllKeys()[index];
    }

    public getItem(key: string): string | any {
        return this.getAllItems().get(key);
    }

    public removeItem(key: string): void {
        if (typeof document === 'undefined') return;
        let domain = this.resolveDomain(Config.cookiesScope);
        domain = (domain) ? 'domain=' + domain + ';' : '';
        document.cookie = key + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;' + domain;
        this.cachedItemsMap.delete(key);
    }

    /**
     * @param key
     * @param value
     * @param expirationDate passing null affects in lifetime cookie
     */
    public setItem(key: string, value: string, expirationDate?: Date): void {
        if (typeof document === 'undefined') return;
        let domain = this.resolveDomain(Config.cookiesScope);
        debug.log('Cookies domain:', domain);
        domain = (domain) ? 'domain=' + domain + ';' : '';
        let utcDate = '';
        if (expirationDate instanceof Date) {
            utcDate = expirationDate.toUTCString();
        } else if (expirationDate === null) {
            utcDate = 'Fri, 18 Dec 2099 12:00:00 GMT';
        }
        const expires = utcDate ? '; expires=' + utcDate : '';
        const cookie = key + '=' + value + expires + ';path=/;' + domain;
        debug.log('Cookie`s set instruction:', cookie);
        this.cachedItemsMap.set(key, value);
        document.cookie = cookie;
    }

    public clear(): void {
        this.getAllKeys().forEach(key => this.removeItem(key));
    }

    public forEach(callbackFn: (value: string, key: string) => any): void {
        return this.getAllItems().forEach((value, key) => callbackFn(value, key));
    }

    protected getAllKeys(): Array<string> {
        return Array.from(this.getAllItems().keys());
    }

    // TODO: consider getting cookies from all paths
    protected getAllItems(): Map<string, string> {
        if (this.cachedCookieString === document.cookie) { // No changes
            return this.cachedItemsMap;
        }
        const map = new Map();
        if (typeof document === 'undefined') return map;
        const cookies = document.cookie.split(';');

        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            const eqPos = cookie.indexOf('=');
            const key = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            const value = eqPos > -1 ? cookie.substr(eqPos + 1, cookie.length) : cookie;
            map.set(key, value);
        }
        // detect changes and emit events
        if (this.cachedItemsMap) {
            map.forEach((value, key) => {
                let cachedValue = this.cachedItemsMap.get(key);
                cachedValue = (cachedValue !== undefined) ? cachedValue : null;
                if (value !== cachedValue) {
                    this.emitEvent(
                        key,
                        WebStorageUtility.getGettable(value),
                        WebStorageUtility.getGettable(cachedValue),
                    );
                }
            });
            this.cachedItemsMap.forEach((value, key) => {
                if (!map.has(key)) {
                    this.emitEvent(key, null, WebStorageUtility.getGettable(value));
                }
            });
        }
        this.cachedCookieString = document.cookie;
        return this.cachedItemsMap = map;
    }

    /**
     * domain.com         + path="."          = .domain.com
     * domain.com         + path=".sub."      = .sub.domain.com
     * sub.domain.com     + path="sub."       = sub.domain.com
     * www.sub.domain.com + path="."          = .sub.domain.com
     * localhost          + path=".whatever." = localhost
     * @param path
     */
    protected resolveDomain(path: string): string {
        if (!path) return '';
        const hostname = document.domain;
        if ((hostname.match(/\./g) || []).length < 1) {
            return '';
        }
        const www = (path[0] !== '.' && hostname.indexOf('www.') === 0) ? 'www.' : '';
        return www + path + this.getDomain();
    }

    /**
     * This function determines base domain by setting cookie at the highest level possible
     * @url http://rossscrivener.co.uk/blog/javascript-get-domain-exclude-subdomain
     */
    protected getDomain(): string {
        let i = 0;
        let domain = document.domain;
        const domainParts = domain.split('.');
        const s = '_gd' + (new Date()).getTime();
        while (i < (domainParts.length - 1) && document.cookie.indexOf(s + '=' + s) === -1) {
            domain = domainParts.slice(-1 - (++i)).join('.');
            document.cookie = s + '=' + s + ';domain=' + domain + ';';
        }
        document.cookie = s + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;domain=' + domain + ';';
        return domain;
    }
}

export const cookiesStorage = new CookiesStorage();
