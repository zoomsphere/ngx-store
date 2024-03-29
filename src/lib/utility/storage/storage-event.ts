export class NgxStorageEvent<T = any> implements Omit<StorageEvent, 'oldValue' | 'newValue'> {
  protected static initTimeStamp = Date.now();
  public oldValue!: T;
  public newValue!: T;
  public NONE: any;
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
  public readonly srcElement = window as any;
  public readonly target = window;
  public readonly url = window.location.href;
  public isInternal = true;

  constructor(public type: string, public key: string, public storageArea: Storage) {
  }

  /**
   * Methods below exist only to satisfy TypeScript compiler
   */
  // tslint:disable:typedef
  public get initEvent() {
    return StorageEvent.prototype.initEvent.bind(this);
  }

  public get preventDefault() {
    return StorageEvent.prototype.preventDefault.bind(this);
  }

  public get stopImmediatePropagation() {
    return StorageEvent.prototype.stopImmediatePropagation.bind(this);
  }

  public get stopPropagation() {
    return StorageEvent.prototype.stopPropagation.bind(this);
  }

  public get composedPath() {
    return StorageEvent.prototype.composedPath.bind(this);
  }

  public get AT_TARGET() {
    return StorageEvent.prototype.AT_TARGET;
  }

  public get BUBBLING_PHASE() {
    return StorageEvent.prototype.BUBBLING_PHASE;
  }

  public get CAPTURING_PHASE() {
    return StorageEvent.prototype.BUBBLING_PHASE;
  }
}
