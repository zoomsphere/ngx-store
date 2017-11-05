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

    // TODO consider passing parameters in object
    protected emitEvent(key: string, newValue: any, oldValue?: any, isInternal: boolean = true) {
        let event = new NgxStorageEvent(this.type, key, this);
        event.oldValue = (oldValue !== undefined) ? oldValue : this.getItem(key);
        event.newValue = newValue;
        event.isInternal = isInternal;
        this.changes.next(event);
    }
}
