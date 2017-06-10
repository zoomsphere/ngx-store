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
+ `clear(clearType: 'decorators' | 'prefix' | 'all')`: clears Storage in provided mode, uses config `clearType` (`prefix`) by default if no parameter provided
+ `config`: getter for module config (read only)
+ `keys`: getter for keys of values stored by ngx-store (determined by prefix and decorators)
+ `utility`: access to [WebStorageUtility](https://github.com/zoomsphere/ngx-store/src/utility/webstorage-utility.ts) class for advanced stuff
