# Angular Storage
## Injectable Services
Angular-Injectable services included in this library:
- `LocalStorageService` - for managing of localStorage
- `SessionStorageService` - for managing of sessionStorage
- `CookiesStorageService` - for managing of cookies
- `SharedStorageService` - for managing of shared variables (stored in usual browser's temporary memory)

All of them provide common methods:
+ `get(key: string): any`: returns JSON-parsed data
+ `set(key: string, value: T): T`: sets data in Storage
+ `update(key: string, changes: any): any`: updates object stored under `key` by deep merge, throws an error if stored value exists and is not an object
+ `remove(key: string): void` removes variable with given key
+ `clear(): void`: clears Storage in mode provided by `Config.clearType` (`'prefix'` by default)
+ `clear('all'): void`: clears whole Storage
+ `clear('prefix', prefix?: string): void`: clears Storage keys starting by passed `prefix` (or `Config.prefix` if not provided)
+ `clear('decorators', target?: Object): void`: clears Storage keys created by decorators, all or only from given target class
+ `observe(key?: string, exactMatch?: boolean): Observable<NgxStorageEvent>`: returns an observable emitting [`NgxStorageEvent`](https://github.com/zoomsphere/ngx-store/blob/master/src/utility/storage/storage-event.ts#L1)s (see [#Listening for changes](https://github.com/zoomsphere/ngx-store/tree/master/src/service#listening-for-changes) section below)
+ `config: WebStorageConfigInterface`: getter for module config (read only)
+ `keys: Array<string>`: keys of values stored by `ngx-store` (determined by prefix and decorators)
+ `utility: WebStorageUtility`: access to [`WebStorageUtility`](https://github.com/zoomsphere/ngx-store/src/utility/webstorage-utility.ts) class for advanced usage

## Listening for changes
`WebstorageService.observe()` method allows to watch storage changes and can take up to 2 parameters:
```
public observe(key?: string, exactMatch?: boolean): Observable<NgxStorageEvent>;
```
`key` specifies filter pattern for `event.key`, by default it's enough to just contain it, but we can easily change the behaviour by passing `exactMatch = true` - in this case prefix is automatically added to the passed key if not included. Returned value is an RxJS Observable of `NgxStorageEvent`, which is just a wrapper of native [`StorageEvent`](https://developer.mozilla.org/en-US/docs/Web/API/StorageEvent) with added `isInternal = true` property, so we can filter out e.g. localStorage events from other tab by this code:
```
this.localStorageService.observe()
  .filter(event => !event.isInternal)
  .subscribe((event) => {
    // events here are equal like would be in:
    // window.addEventListener('storage', (event) => {});
    // excluding sessionStorage events
    // and event.type will be set to 'localStorage' (instead of 'storage')
  });
```
In order to listen for changes in cookies constantly (i.e. if they can get changed from server side or external library), we have to specify `Config.cookiesCheckInterval`.  It's recommended setting it to 1000 ms as it will be fast enough in most of cases and doesn't cause noticeably CPU usage.
