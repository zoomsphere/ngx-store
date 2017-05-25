# Angular Storage
## Decorators and services for your needs

This library adds decorators that make it super easy to *automagically* save and restore variables using HTML5's `localStorage` and `sessionStorage`. It also provides Angular-Injectable Session- and LocalStorageService.

## What's included? 
- `@LocalStorage()` and `@SessionStorage()` decorator functions
- Injectable `LocalStorageService` and `SessionStorageService` providing the following methods:
    + `get(key: string)`: gets JSON-parsed data from HTML5 Storage
    + `set(key: string, value: any)`: sets data in HTML5 Storage
    + `remove(key: string)` removes variable with given key
    + `clear()`: clears Storage out of variables with set prefix
    + `keys`: getter for keys of stored values
    + `config`: getter for module config
- Objects read from Storage have added `.save()` method to easily force save of made changes (configurable by `mutateObjects`)
- saving support for all `Array` methods that change array object's value (configurable by `mutateObjects`)
- Easy configuration of what you want (see [#configuration](#configuration) section)

## Upcoming (TODO)
- Handle data saved with previous prefix after its change
- Encoding of saved data
- Tests coverage
- Cookies fallback
- Automatically handle all data manipulations using [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) (?)
- Take configuration from [npm config](https://www.npmjs.com/package/config)'s file (?)
- Handle out of memory issues
- `Storage` polyfill for NativeScript (?)

## Installation
1. Download the library: `npm install --save ngx-store`
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
As this project uses decorating functions, it's important to provide custom configuration in `NGXSTORE_CONFIG` before Angular application load. Here are some ways to do it:
1. Add `<script>` in `index.html` (before Angular sources)
    ```html
    <script>
    var NGXSTORE_CONFIG = {
      prefix: 'myApp.',    // default: ngx_
      clearType: 'prefix', // possible values: decorators, prefix, all
      mutateObjects: true  // defines whether Array methods shall be modified to handle changes automatically and .save() method shall be added to stored objects
    };
    </script>
    ```
2. If you use webpack, you can provide global variable in your `webpack.js` file:
    ```javascript
    plugins: [ 
      new webpack.DefinePlugin({
        NGXSTORE_CONFIG: JSON.stringify({
          prefix: '' // etc
        })
      }),
    ]
    ```


## How to use?
1. Perfectly looking but sometimes tricky: Use the `@LocalStorage()` and/or `@SessionStorage()` decorator functions. Here is where the magic happens, decorated variables are restored when user reloads the site!
    ```typescript
    import {LocalStorage, SessionStorage} from 'ngx-store';
    
    export class MySuperComponent {
      // it will be stored under ${prefix}viewCounts name
      @LocalStorage() public viewCounts: number = 0;
      // this under name: ${prefix}differentLocalStorageKey
      @LocalStorage('differentLocalStorageKey') protected userName: string = '';
      // and this under ${prefix}itWillBeRemovedAfterBrowserClose in session storage
      @SessionStorage('itWillBeRemovedAfterBrowserClose') private previousUserNames: Array<string> = [];
     
      constructor() {
        this.viewCounts++;
        this.userName = 'some name stored in localstorage';
        this.previousUserNames.push(this.userName);
        for (let userName of this.previousUserNames) {
          // do some stuff
        }
      }
    }
    ```

    **Force save changes:** If you need to modify stored object by not a direct assignment, then you can take advantage of `.save()` method to force save introduced changes. Example:
    ```typescript
    import { LocalStorage, SessionStorage, Webstorable } from 'ngx-store';

    // this is needed to satisfy Typescript type checking
    type WebstorableObject = Webstorable & Object; // save() method is declared in the Webstorable interface
    type WebstorableArray = Webstorable & Array<any>;

    export class MySuperComponent {
      @LocalStorage() someObject: WebstorableObject = <WebstorableObject>{};
      @SessionStorage() arrayOfSomethings: WebstorableArray = [0,1,2,3,4];
       
      constructor() {
        this.someObject.a = 1;
        this.someObject['b'] = 2;
        delete this.someObject['c'];
        for (let something of this.arrayOfSomethings) {
          something++;
        }
        // upper changes won't be saved without the lines below
        this.someObject.save();
        this.arrayOfSomethings.save();
        this.someObject = this.someObject; // it can be considered as a bad code, but also will do the job
       }
    }
    ```
    
2. Standard way: Use `LocalStorageService` and / or `SessionStorageService`:
    ```typescript
    import { LocalStorageService, SessionStorageService } from 'ngx-store';
 
    export class MyService {
      constructor(
        localStorageService: LocalStorageService,
        sessionStorageService: SessionStorageService,
      ) {}
   
      public saveSomeData(object: Object, array: Array<any>) {
        this.localStorageService.setItem('someObject', object);
        this.sessionStorageService.setItem('someArray', array);
        
        this.localStorageService.keys.forEach((key) => {
          console.log(key + ' =', this.localStorageService.getItem(key));
        });
      }
   
      public clearSomeData(): void {
        this.localStorageService.clear('decorators'); // removes only variables created by decorating functions
        this.localStorageService.clear('prefix'); // removes variables starting with set prefix (including decorators)
        this.sessionStorageService.clear('all'); // removes all session storage data
      }
    }
    ```

3. Combine both ways and have fun!

**Note**: Define always a default value at the property you are using decorator.

**Note**: Please don't store circular structures as this library uses JSON.stringify to encode before using LocalStorage.


**Contributions are welcome!**
