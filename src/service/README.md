# Angular Storage
## Injectable Services
Angular-Injectable services included in this library:
- `LocalStorageService` - for managing of localStorage
- `SessionStorageService` - for managing of sessionStorage
- `CookiesStorageService` - for managing of cookies
- `SharedStorageService` - for managing of shared variables (stored in usual browser's temporary memory)

All of them provide common methods:
+ `get(key: string): any`: returns JSON-parsed data
+ `load(key: string): Resource`: returns an instance of [`Resource`](https://github.com/zoomsphere/ngx-store/src/service/resource.ts) class for given key exposing API based on builder design pattern (see [#Builder pattern](https://github.com/zoomsphere/ngx-store/tree/master/src/service#builder-pattern) section below)
+ `set(key: string, value: T): T`: sets data in Storage
+ `update(key: string, changes: any): any`: updates object stored under `key` by deep merge, throws an error if stored value exists and is not an object
+ `remove(key: string): void`: removes variable with given key
+ `clear(): void`: clears Storage in mode provided by `Config.clearType` (`'prefix'` by default)
+ `clear('all'): void`: clears whole Storage
+ `clear('prefix', prefix?: string): void`: clears Storage keys starting by passed `prefix` (or `Config.prefix` if not provided)
+ `clear('decorators', target?: Object): void`: clears Storage keys created by decorators, all or only from given target class
+ `observe(key?: string, exactMatch?: boolean): Observable<NgxStorageEvent>`: returns an observable emitting [`NgxStorageEvent`](https://github.com/zoomsphere/ngx-store/blob/master/src/utility/storage/storage-event.ts#L1)s (see [#Listening for changes](https://github.com/zoomsphere/ngx-store/tree/master/src/service#listening-for-changes) section below)
+ `config: WebStorageConfigInterface`: getter for module config (read only)
+ `keys: Array<string>`: keys of values stored by `ngx-store` (determined by prefix and decorators)
+ `utility: WebStorageUtility`: access to [`WebStorageUtility`](https://github.com/zoomsphere/ngx-store/src/utility/webstorage-utility.ts) class for advanced usage

## Builder pattern
`WebStorage.load(key: string)` method exposes API based on builder design pattern. Following methods are allowed in a chain:
+ `setPath(path: string)` - sets path of object property, e.g. if we have `{ nested: { property: true }}` under "object" key in localStorage, then `localStorageService.load('object').path('nested.property').value` will be equal to `true`
+ `appendPath(path: string)` - appends current path, e.g. if path('key') and appendPath('nested'), the path will be "key.nested"
+ `truncatePath()` - removes last item of path, e.g. if path('key.nested') and truncatePath(), the path will be "key"
+ `resetPath()` - resets set path
+ `setPrefix(prefix: string)` - sets prefix, e.g. `localStorageService.load('key').prefix('abc_').value` will read value of item stored under "abc_key" key in LS
+ `changePrefix(prefix: string)` - moves storage item to new key using given prefix
+ `setDefaultValue(value: any)` - sets default value for both reading and saving, will be used in case when real value is `null` or `undefined`
+ `save(value: any)` - saves given value in chosen place - as a new entry or an existing object property depending on `path`
+ `update(value: any)` - updates object stored under current path using `lodash.merge`
+ `remove()` - removes item stored under current key
+ there are also "non-chainable" getters for: `value`, `defaultValue`, `path` and `prefix`

See [`Resource`](https://github.com/zoomsphere/ngx-store/src/service/resource.ts) class for details.

#### Code example:
```typescript
this.localStorageService.set('object', { nested: { property: false }});
let objectResource = this.localStorageService.load('object');
console.log(objectResource.path('nested.property').value); // false
console.log(objectResource.path('nested.property').save(true).value); // true
console.log(objectResource.path('nested.new_key').defaultValue(8).save(null).value); // 8
console.log(objectResource.path('nested').value); // { property: true, new_key: 8 }
console.log(objectResource.update({new_key: true})); // { nested: { property: false }, new_key: true }
```
Real-life usage in a class:
```typescript
import { LocalStorageService, NgxResource } from 'ngx-store';

interface ModuleSettings {
    viewType?: string;
    notificationsCount: number;
    displayName: string;
}

class ModuleService {
    constructor(public localStorageService: LocalStorageService) {}
    
    public get settings(): NgxResource<ModuleSettings> {
        return this.localStorageService
            .load(`userSettings`)
            .setPath(`modules`)
            .setDefaultValue({}) // we have to set {} as default value, because numeric `moduleId` would create an array 
            .appendPath(this.moduleId)
            .setDefaultValue({});
    }
    
    public saveModuleSettings(settings: ModuleSettings) {
        this.settings.save(settings);
    }
    
    public updateModuleSettings(settings: Partial<ModuleSettings>) {
        this.settings.update(settings);
    }
}
```

## Listening to changes
`WebstorageService.observe()` method allows to watch storage changes and can take up to 2 parameters:
```typescript
public observe(key?: string, exactMatch?: boolean): Observable<NgxStorageEvent>;
```
`key` specifies filter pattern for `event.key`, by default it's enough to just contain it, but we can easily change the behaviour by passing `exactMatch = true` - in this case prefix is automatically added to the passed key if not included. Returned value is an RxJS Observable of `NgxStorageEvent`, which is just a wrapper of native [`StorageEvent`](https://developer.mozilla.org/en-US/docs/Web/API/StorageEvent) with added `isInternal = true` property for changes made by `ngx-store`, so we can filter out e.g. localStorage events from other tab by this code:
```typescript
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
