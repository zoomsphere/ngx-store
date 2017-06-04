export type StorageName = 'LocalStorage' | 'SessionStorage' | 'CookiesStorage';

export class WebStorageUtility {
    protected _prefix: string = '';
    protected _storage: Storage;

    public static getSettable(value: any): string {
        return typeof value === 'string' ? value : JSON.stringify(value);
    }

    public static getGettable(value: string): any {
        if (value === 'undefined') return null;
        try {
            return JSON.parse(value);
        } catch(e) {
            return value;
        }
    }

    public constructor(storage: Storage, prefix: string, previousPrefix?: string) {
        this._storage = storage;
        this._prefix = prefix;

        // handle previousPrefix for backward-compatibility and safe config changes below
        if (prefix === previousPrefix) return;
        if (previousPrefix === null) return;
        if (previousPrefix === undefined) return;
        this.forEach(key => {
            // ignore config settings when previousPrefix = ''
            if (key.startsWith(previousPrefix) && !key.startsWith('NGX-STORE_')) {
                let nameWithoutPrefix = this.trimPrefix(key);
                this.set(nameWithoutPrefix, this._storage.getItem(key));

                if (previousPrefix !== '') {
                    this._storage.removeItem(key);
                }
            }
        });
    }

    public get prefix(): string {
        return this._prefix;
    }

    public get keys(): Array<string> {
        let keys = [];
        this.forEach(key => keys.push(key));
        return keys;
    }

    public getStorageKey(key: string): string {
        return `${this._prefix}${key}`;
    }

    public getStorageName(): StorageName {
        let storageName: any = this._storage.constructor.name;
        if (storageName === 'Storage') {
            storageName = (this._storage === localStorage) ? 'LocalStorage' : 'SessionStorage';
        }
        return storageName;
    }

    public get(key: string): any {
        let storageKey = this.getStorageKey(key);
        let value = this._storage.getItem(storageKey);
        return WebStorageUtility.getGettable(value);
    }

    public set(key: string, value: any): any {
        let storageKey = this.getStorageKey(key);
        let storable = WebStorageUtility.getSettable(value);
        this._storage.setItem(storageKey, storable);
        return value;
    }

    // TODO return true if item existed and false otherwise (?)
    public remove(key: string): void {
        let storageKey = this.getStorageKey(key);
        this._storage.removeItem(storageKey);
    }

    public clear() {
        this._storage.clear();
    }

    public forEach(func: (key: string, value: any) => any): void {
        if (typeof this._storage.forEach === 'function') {
            return this._storage.forEach((key, value) => func(key, this.getGettable(value)));
        }
        for (let key in this._storage) {
            func(key, this.getGettable(this._storage[key]));
        }
    }

    public getSettable(value: any): string {
        return WebStorageUtility.getSettable(value);
    }

    public getGettable(value: string): any {
        return WebStorageUtility.getGettable(value);
    }

    public trimPrefix(key: string): string {
       return key.replace(this.prefix, '');
    }
}
