import { NgxStorage } from './storage';

export class SharedStorage extends NgxStorage {
    protected sharedMap: Map<string, any> = new Map();

    public get length(): number {
        return this.getAllKeys().length;
    }

    public key(index: number): string | any {
        return this.getAllKeys()[index];
    }

    public getItem(key: string): any {
        let value = this.sharedMap.get(key);
        return (value !== undefined) ? value : null;
    }

    public removeItem(key: string): void {
        this.emitEvent(key, null);
        this.sharedMap.delete(key);
    }

    public setItem(key: string, value: any): void {
        this.emitEvent(key, value);
        this.sharedMap.set(key, value);
    }

    public clear(): void {
        this.emitEvent(null, null);
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
