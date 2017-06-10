export class SharedStorage implements Storage {
    [key: string]: any;
    [index: number]: string;
    protected sharedMap: Map<string, any> = new Map();

    public get length(): number {
        return this.getAllKeys().length;
    }

    public key(index: number): string | any {
        return this.getAllKeys()[index];
    }

    public getItem(key: string): any {
        return this.sharedMap.get(key);
    }

    public removeItem(key: string): void {
        this.sharedMap.delete(key);
    }

    public setItem(key: string, data: any): void {
        this.sharedMap.set(key, data);
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
