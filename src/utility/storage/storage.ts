import { NgxStorageEvent } from './storage-event';
import { Subject } from 'rxjs';
import { StorageName } from '../webstorage.utility';

// TODO: in the future use ES6 Proxy to handle indexers
export abstract class NgxStorage implements Storage {
    [key: string]: any;
    [index: number]: string;
    public externalChanges: Subject<NgxStorageEvent> = new Subject();
    public abstract setItem(key: string, value: any): void;
    public abstract removeItem(key: string): void;
    public abstract getItem(key: string): any;
    public abstract key(index: number);
    public abstract clear(): void;
    public abstract get length(): number;
    public abstract get type(): StorageName;

    protected emitEvent(key: string, newValue: any, oldValue?: any) {
        const event = new NgxStorageEvent(this.type, key, this);
        event.oldValue = (oldValue !== undefined) ? oldValue : this.getItem(key);
        event.newValue = newValue;
        event.isInternal = false;
        this.externalChanges.next(event);
    }
}
