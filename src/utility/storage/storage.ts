import { NgxStorageEvent } from './storage-event';
import { Subject } from 'rxjs/Subject';

// TODO: in the future use ES6 Proxy to handle indexers
export abstract class NgxStorage implements Storage {
    [key: string]: any;
    [index: number]: string;
    public changes: Subject<NgxStorageEvent> = new Subject();
    public abstract setItem(key: string, value: any): void;
    public abstract removeItem(key: string): void;
    public abstract getItem(key: string): any;
    public abstract key(index: number);
    public abstract clear(): void;
    public abstract get length();

    protected abstract get type(): string;

    protected emitEvent(key: string, newValue: any) {
        let event = new NgxStorageEvent(this.type, key, this);
        event.oldValue = this.getItem(key);
        event.newValue = newValue;
        this.changes.next(event);
    }
}
