import { NgxStorageEvent } from './storage-event';
import { Subject } from 'rxjs/Subject';

export abstract class NgxStorage implements Storage {
    [key: string]: any;
    [index: number]: string;
    public changes: Subject<NgxStorageEvent> = new Subject();
    public abstract getItem(key: string): any;
    public abstract setItem(key: string, value: any): void;
    public abstract removeItem(key: string): void;
    public abstract clear(): void;
    public abstract get length();
    public abstract key(index: number);

    protected emitEvent(key: string, newValue: any) {
        let event = new NgxStorageEvent('sharedStorage', key, this);
        event.oldValue = this.getItem(key);
        event.newValue = newValue;
        this.changes.next(event);
    }
}
