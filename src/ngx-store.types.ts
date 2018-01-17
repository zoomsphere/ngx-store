export interface Webstorable {
    save(): void;
}
export type WebstorableObject = Webstorable & {[prop: string]: any};
export type WebstorableArray<T> = Webstorable & Array<T>;
