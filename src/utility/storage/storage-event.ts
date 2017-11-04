export class NgxStorageEvent {
    protected static initTimeStamp = Date.now();
    public oldValue?: any;
    public newValue: any;
    public timeStamp = (Date.now() - NgxStorageEvent.initTimeStamp);
    public readonly bubbles = false;
    public readonly cancelBubble = false;
    public readonly cancelable = false;
    public readonly composed = false;
    public readonly currentTarget = window;
    public readonly defaultPrevented = false;
    public readonly evenPhase = 2;
    public readonly isTrusted = true;
    public readonly path = [window];
    public readonly returnValue = true;
    public readonly srcElement = window;
    public readonly target = window;
    public readonly url = window.location.href;

    constructor(public type: string, public key: string, public storageArea: Storage) {
        Object.setPrototypeOf(this, StorageEvent);
    }
}
