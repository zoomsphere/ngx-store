# Angular Storage
### Decorators and services for cookies, session- and localStorage
This library adds decorators that make it super easy to *automagically* save and restore variables using HTML5's `localStorage` and `sessionStorage`. It also provides Angular-Injectable Session- and LocalStorageService.


## What's included?
- Decorator functions that are pretty easy to use and configure (see [Decorators config](#decorators-config)):
    + `@LocalStorage()` - to save variable in HTML5 localStorage
    + `@SessionStorage()` - to save variable in HTML5 sessionStorage
    + `@CookieStorage()` - to save variable as a cookie
    + `@SharedStorage()` - to keep variable in temporary memory that can be shared across classes
    + `@TempStorage()` - alias for `SharedStorage`
- Injectable `LocalStorageService`, `SessionStorageService`, `CookiesStorageService` and `SharedStorageService` ([read more here](src/service#angular-storage))
- Possibility of [listening to storage changes](https://github.com/zoomsphere/ngx-store/tree/master/src/service#listening-to-changes)
- Easy configuration (see [#configuration](#configuration) section)
- Compatibility with:
    + all previous versions
    + Angular AoT compiler
    + `angular2-localstorage`
    + [nativescript-localstorage](https://github.com/NathanaelA/nativescript-localstorage)
    + Angular v2, 4 and 5
    + your own project!
- Tests coverage

## CHANGELOG
### v2.0.0 - support for Angular 6 (RxJS v6)
### v1.4.x
- standardized behavior for:
    - more than 1 decorator, e.g. in `@LocalStorage() @CookieStorage() variable: any;` `CookieStorage` (decorator closer to variable) has higher priority, hence the value will be read from cookies only. The cookie value will be saved in `localStorage` regardless of its content to keep consistency.
    - `WebStorageService.clear('all')` - now will remove everything except `ngx-store`'s config (stored in `localStorage`)
- removed deprecated (since v0.5) `WEBSTORAGE_CONFIG`
- `@SharedStorage` has now alias `@TempStorage`
- introduced [builder pattern](https://github.com/zoomsphere/ngx-store/tree/master/src/service#builder-pattern)
- added unit tests coverage
- fixes for storage events


## Upcoming (TODO)
- Storage events for keys removed from outside
- Tests for storage events (accepting PRs)
- Accepting Moment's instances as expiration date (accepting PRs)
- More options for managing cookies
- Support for Set and Map
- Encoding of saved data
- Take configuration from [npm config](https://www.npmjs.com/package/config)'s file (?)
- Automatically handle all data manipulations using [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) (ES6)


## Installation
1. Download the library: `npm i ngx-store --save` or `npm i ngx-store@RC` for latest version
2. Import the WebStorageModule in your `app.module.ts`:
    ```typescript
    import { NgModule } from '@angular/core';
    import { WebStorageModule } from 'ngx-store';

    @NgModule({
      imports: [
        WebStorageModule,
      ],
    })
    export class AppModule {}
    ```


## Configuration
Things you should take into consideration while configuring this module:
- Decorated objects have added `.save()` method to easily force save of made changes (configurable by `mutateObjects`)
- Support for all `Array` methods that change array object's value can be disabled (configurable by `mutateObjects`)
- Object mutation can be troublesome for object comparisons, so you can configure this feature for single field passing [decorator config](#decorators-config)
- You may not use prefix (by setting it to `''`), however we recommend to use it, as it helps avoid conflicts with other libraries (configurable by `prefix`)
- There are 3 ways to clear ngx-stored data:
    + `'all'` - completely clears current Storage
    + `'prefix'` - removes all variables prefixed by ngx-store
    + `'decorators'` - removes only variables created by decorating functions (useful when not using prefix)
    Default behaviour is specified by setting `clearType`, but it's possible to pass this parameter directly into service `clear()` method.
- Examples for `cookiesScope` can be found in [this comment](https://github.com/zoomsphere/ngx-store/blob/master/src/utility/storage/cookies-storage.ts#L125)

As this project uses decorating functions, it is important to provide custom configuration in global variable named `NGXSTORE_CONFIG` before Angular application load. Here are some ways to do it:
1. Add `<script>` in `index.html` (before Angular sources)
    ```html
    <script>
    var NGXSTORE_CONFIG = {
      prefix: 'ngx_',      // default: 'ngx_'
      clearType: 'prefix', // default: 'prefix'
      mutateObjects: true, // default: true
      debugMode: false,    // you can enable debug logs if you ever meet any bug to localize its source
      cookiesScope: '',    // what you pass here will actually prepend base domain
      cookiesCheckInterval: 0, // number in ms describing how often cookies should be checked for changes
      previousPrefix: 'angular2ws_', // you have to set it only if you were using custom prefix in old version ('angular2ws_' is a default value)
      decoratorDefaultToSubject: false // default: false, determines if decorators will create a standard property or an RxJS Subject
    };
    </script>
    ```
2. If you use webpack, you can provide global variable in your `webpack.js` file this way:
    ```javascript
    plugins: [
      new webpack.DefinePlugin({
        NGXSTORE_CONFIG: JSON.stringify({
          prefix: '', // etc
        })
      }),
    ]
    ```


## Decorators config
Decorating functions can take config object with the following fields:
- `key: string` - key under the variable will be stored, default key is the variable name
- `mutate: boolean` - enable or disable object mutation for instance, default depends on global config
- `asSubject: boolean` - makes decorator property an RxJS Subject<T> as opposed to type T, default depends on global config which defaults to false
- `expires: Date` - for `@CookieStorage()` only, specifies expiration date, null = lifetime cookie


## Usage
1. Pretty easy to use decorators. Here is where the real magic happens.
    ```typescript
    import { CookieStorage, LocalStorage, SessionStorage } from 'ngx-store';
    import { Subject } from 'rxjs';

    export class MySuperComponent {
      // it will be stored under ${prefix}viewCounts name
      @LocalStorage() viewCounts: number = 0;
      // it will be used as an RxJS Subject
      @LocalStorage({ asSubject: true, key: 'viewCounts' }) viewCounts$: Subject<number>;
      // this under name: ${prefix}differentLocalStorageKey
      @LocalStorage('differentLocalStorageKey') userName: string = '';
      // it will be stored under ${prefix}itWillBeRemovedAfterBrowserClose in session storage
      @SessionStorage({key: 'itWillBeRemovedAfterBrowserClose'}) previousUserNames: Array<string> = [];
      // it will be read from cookie 'user_id' (can be shared with backend) and saved to localStorage and cookies after change
      @LocalStorage() @CookieStorage({prefix: '', key: 'user_id'}) userId: string = '';
      // it will be stored in a cookie named ${prefix}user_workspaces for 24 hours
      @CookieStorage({key: 'user_workspaces', expires: new Date(new Date().getTime() + 24 * 60 * 60 * 1000)}) userWorkspaces = [];

      constructor() {
        this.viewCounts++;
        this.userName = 'some name stored in localstorage';
        this.previousUserNames.push(this.userName);
        for (let userName of this.previousUserNames) {
          console.log(userName);
        }
        this.previousUserNames.map(userName => userName.split('').reverse().join(''));
      }
    }
    ```

    **Sharing variables across classes:** Decorated variables can be easily shared across different classes, e.g. Angular Components (also after their destruction) without need to create new service for this purpose.
    ```typescript
    import { LocalStorage, SharedStorage } from 'ngx-store';

    export class HomeComponent {
      @SharedStorage() title: string = 'Homepage'; // it will be kept in temp memory until app reload
      @LocalStorage() userNote: string = 'Leave your note here'; // it will be read from and saved to localStorage

      constructor() {
        setTimeout(() => {
          console.log('userNote:', this.userNote); // it should be changed after user's visit to NestedComponent
        }, 5000);
      }
    }

    export class NestedComponent {
      @SharedStorage('title') homeTitle: string = '';
      @LocalStorage() protected userNote: string = '';

      constructor() {
        console.log('homeTitle:', this.homeTitle); // should print 'Homepage'
        console.log('userNote:', this.userNote); // should print userNote set in HomeComponent
        this.userNote = "You've visited NestedComponent!";
      }
    }
    ```

    **Force save changes:** If you need to modify stored object by not a direct assignment, then you can take advantage of `.save()` method to force save made changes. Example:
    ```typescript
    import { CookieStorage, LocalStorage, SessionStorage, WebstorableArray } from 'ngx-store';

    export class MySuperComponent {
      @LocalStorage() someObject: any = { c: 3 };
      @SessionStorage() arrayOfSomethings: WebstorableArray<number> = <any>[0,1,2,3,4];
      @CookieStorage({ mutate: false }) someCookie: {version?: number, content?: string} = {};

      constructor() {
        this.someObject.a = 1;
        this.someObject['b'] = 2;
        delete this.someObject['c'];
        for (let i = 0; i < this.arrayOfSomethings.length; i++) {
          this.arrayOfSomethings[i] += i;
        }
        this.someCookie.version++;
        this.someCookie.content = 'please save me';
        // upper changes won't be saved without the lines below
        this.someObject.save();
        this.arrayOfSomethings.save();
        this.someCookie = this.someCookie; // it looks weird, but also will do the job even without object mutation
       }
    }
    ```

    **Limited lifecycle classes in AoT compilation:** There is a special case when Service or Component in your application containing decorated variable is being destroyed:
    ```typescript
    import { OnDestroy } from '@angular/core';
    import { LocalStorage } from 'ngx-store';

    export class SomeService implements OnDestroy { // implement the interface
        @LocalStorage() destroyedVariable: any = {};

        ngOnDestroy() {} // event empty method is needed to allow ngx-store handle class destruction
    }
    ```

2. Use the [services](src/service#angular-storage) to manage your data:
    ```typescript
    import { CookiesStorageService, LocalStorageService, SessionStorageService, SharedStorageService } from 'ngx-store';

    export class MyService {
      constructor(
        localStorageService: LocalStorageService,
        sessionStorageService: SessionStorageService,
        cookiesStorageService: CookiesStorageService,
        sharedStorageService: SharedStorageService,
      ) {
        console.log('all cookies:');
        cookiesStorageService.utility.forEach((value, key) => console.log(key + '=', value));
      }

      public saveSomeData(object: Object, array: Array<any>) {
        this.localStorageService.set('someObject', object);
        this.sessionStorageService.set('someArray', array);

        this.localStorageService.keys.forEach((key) => {
          console.log(key + ' =', this.localStorageService.get(key));
        });
      }

      public clearSomeData(): void {
        this.localStorageService.clear('decorators'); // removes only variables created by decorating functions
        this.localStorageService.clear('prefix'); // removes variables starting with set prefix (including decorators)
        this.sessionStorageService.clear('all'); // removes all session storage data
      }
    }
    ```

**Note**: Always define default value at the property you are using decorator.

**Note**: Never use `for-in` loop on decorated Arrays without filtering by `.hasOwnProperty()`.

**Note**: Please don't ngx-store circular structures as this library uses JSON.stringify to encode data before saving.

**Note**: When you change prefix from '' (empty string) old values won't be removed automatically to avoid deleting necessary data. You should handle it manually or set clearType to 'all' for some time.

**Contributions are welcome!**
