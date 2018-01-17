import { NgxStorage } from './storage';
import { StorageName } from '../webstorage.utility';

export class SharedStorage extends NgxStorage {
    protected sharedMap: Map<string, any> = new Map();

    constructor() {
        super();
        this.externalChanges = undefined;
    }

    public get type(): StorageName {
        return 'sharedStorage';
    }

    public get length(): number {
        return this.getAllKeys().length;
    }

    public key(index: number): string | any {
        return this.getAllKeys()[index];
    }

    public getItem(key: string): any {
        const value = this.sharedMap.get(key);
        return (value !== undefined) ? value : null;
    }

    public removeItem(key: string): void {
        this.sharedMap.delete(key);
    }

    public setItem(key: string, value: any): void {
        this.sharedMap.set(key, value);
    }

    public clear(): void {
        this.sharedMap.clear();
    }

    public forEach(func: (value: string, key: any) => any): void {
        return this.sharedMap.forEach((value, key) => func(value, key));
    }

    protected getAllKeys(): Array<string> {
        return Array.from(this.sharedMap.keys());
    }
}

export const sharedStorage = new SharedStorage();
