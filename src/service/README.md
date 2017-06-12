# Angular Storage
### Injectable Services
Injectable Angular services included in this library:
- `LocalStorageService`
- `SessionStorageService`
- `CookiesStorageService`

All of them provide common methods:
+ `get(key: string)`: returns JSON-parsed data
+ `set(key: string, value: any)`: sets data in Storage
+ `remove(key: string)` removes variable with given key
+ `clear()`: clears Storage in mode provided by config `clearType` (`'prefix'` by default)
+ `clear('all')`: clears whole Storage
+ `clear(clearType?: 'prefix', prefix?: string)`: clears Storage keys starting by passed `prefix` (or config prefix if not provided)
+ `clear(clearType?: 'decorators', target?: Object)`: clears Storage keys created by decorators, all or only from given target class
+ `config`: getter for module config (read only)
+ `keys`: getter for keys of values stored by ngx-store (determined by prefix and decorators)
+ `utility`: access to [WebStorageUtility](https://github.com/zoomsphere/ngx-store/src/utility/webstorage-utility.ts) class for advanced stuff
