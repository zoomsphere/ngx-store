export class NgxStorageEvent implements StorageEvent {
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
    public readonly eventPhase = 2;
    public readonly isTrusted = true;
    public readonly path = [window];
    public readonly returnValue = true;
    public readonly srcElement = <any>window;
    public readonly target = window;
    public readonly url = window.location.href;
    public isInternal = true;

    constructor(public type: string, public key: string, public storageArea: Storage) {
        setTimeout(() => Object.setPrototypeOf(this, new StorageEvent(type)));
    }

    /**
     * Methods below exist only to satisfy TypeScript compiler
     */

    public get scoped() {
        return undefined;
    };

    public get initEvent() {
        return undefined;
    };

    public get preventDefault() {
        return undefined;
    }

    public get stopImmediatePropagation() {
        return undefined;
    }

    public get stopPropagation() {
        return undefined;
    }

    public get deepPath() {
        return undefined;
    }

    public get AT_TARGET() {
        return undefined;
    }

    public get BUBBLING_PHASE() {
        return undefined;
    }

    public get CAPTURING_PHASE() {
        return undefined;
    }
}
