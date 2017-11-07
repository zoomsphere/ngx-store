# Angular Storage
### Injectable Services
Injectable Angular services included in this library:
- `LocalStorageService`
- `SessionStorageService`
- `CookiesStorageService`
- `SharedStorageService`

All of them provide common methods:
+ `get(key: string)`: returns JSON-parsed data
+ `set(key: string, value: any)`: sets data in Storage
+ `remove(key: string)` removes variable with given key
+ `clear()`: clears Storage in mode provided by config `clearType` (`'prefix'` by default)
+ `clear('all')`: clears whole Storage
+ `clear(clearType?: 'prefix', prefix?: string)`: clears Storage keys starting by passed `prefix` (or config prefix if not provided)
+ `clear(clearType?: 'decorators', target?: Object)`: clears Storage keys created by decorators, all or only from given target class
+ `observe(key?: string, exactMatch?: boolean)`: returns an observable emitting [`NgxStorageEvent`](https://github.com/zoomsphere/ngx-store/blob/master/src/utility/storage/storage-event.ts#L1)s (see [#Listening for changes](https://github.com/zoomsphere/ngx-store/tree/master/src/service#listening-for-changes) section below)
+ `config`: getter for module config (read only)
+ `keys`: getter for keys of values stored by ngx-store (determined by prefix and decorators)
+ `utility`: access to [`WebStorageUtility`](https://github.com/zoomsphere/ngx-store/src/utility/webstorage-utility.ts) class for advanced stuff

## Listening for changes
`WebstorageService.observe()` method allow to watch storage changes and can take 2 parameters:
```
public observe(key?: string, exactMatch?: boolean): Observable<NgxStorageEvent>;
```
`key` specifies filter pattern for `event.key`, by default it's enough to just contain it, but we can easily change the behaviour by passing `exactMatch = true` - in this case prefix is automatically added to the passed key if not included. Returned value is an RxJS Observable of `NgxStorageEvent`, which is just a wrap for native [`StorageEvent`](https://developer.mozilla.org/en-US/docs/Web/API/StorageEvent) with added `isInternal = true` property, so we can filter out e.g. localStorage events from other tab by this code:
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
In order to listen for changes in cookies constantly (i.e. if they can get changed by server or external library), we have to specify `Config.cookiesCheckInterval`.  It's recommended setting it to 1000 ms as it will be fast enough in most of cases and doesn't cause noticeably CPU usage. These changes are being detected only if there is active subscription to `CookiesStorageService.observe()`.
