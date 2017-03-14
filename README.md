# Angular2 @LocalStorage

This little Angular2/typescript decorator makes it super easy to save and restore *automatically* a variable state in your
directive (class property) using HTML5' LocalStorage.

## What's new

Things that have been added in this fork:
- added `.save()` method on returned object, used in specific cases to force save object changes
- support for all `Array` methods that change array object's value
- now `WebStorageService.clear()` method removes items created by this repository only
- storage key prefix (`angular2ws_` by default) can be customized by changing `WEBSTORAGE_CONFIG.prefix` property

## Installation

1. Download the library: `npm install --save git+https://github.com/zoomsphere/angular2-localstorage#master`
2. Import the WebStorageModule in your app module:
    ```typescript
    import {Component} from 'angular2/core';
    import {WebStorageModule, LocalStorageService} from 'angular2-localstorage';

    @NgModule({
        import: [WebStorageModule]
    @Component({
        providers: [LocalStorageService]
    })
    export class AppModule {}
    ```

3. If you don't like the default key prefix (`angular2ws_`) or just don't want to use any, then in your `app.module.ts` file add the following:
    ```typescript
    import {WEBSTORAGE_CONFIG} from 'angular2-localstorage';
    WEBSTORAGE_CONFIG.prefix = ''; // no prefix
    WEBSTORAGE_CONFIG.prefix = 'newPrefix_';
    ```
    Note that it's the best to configure this right after installation, because the data saved under keys with previous prefix won't be automatically read anymore - to prevent that you can change keys of already stored data or override them manually.

## How to use

1. Use the `@LocalStorage()` and/or `@SessionStorage()` decorator functions. Here is where the magic happens, decorated variables' values will be restored from the storage when you reload the site!
    ```typescript
    import {LocalStorage, SessionStorage} from 'angular2-localstorage/WebStorage';
    
    class MySuperComponent {
        // it will be stored under ${prefix}viewCounts name
        @LocalStorage() public viewCounts: number = 0;
        // this under name: ${prefix}differentLocalStorageKey
        @LocalStorage('differentLocalStorageKey') protected userName: string = '';
        // and this under ${prefix}itWillBeRemovedAfterBrowserClose in session storage
        @SessionStorage('itWillBeRemovedAfterBrowserClose') private previousUserNames: Array<string> = [];
     
        mySuperMethod(): void {
            this.viewCounts++;
            this.userName = 'some name stored in localstorage';
            this.previousUserNames.push(this.userName);
            for (let userName of this.previousUserNames) {
                // do some stuff
            }
        } 
    }
    ```

2. **Force save changes.** If you need to modify stored object by not a direct assignment, then you can take advantage of `.save()` method to force save introduced changes. Example:
    ```typescript
    import {LocalStorage, SessionStorage, Webstorable} from 'angular2-localstorage';

    // this is needed to satisfy Typescript type checking
    type WebstorableObject = Webstorable & Object; // save() method is declared in the Webstorable interface
    type WebstorableArray = Webstorable & Array<any>;

    class MySuperComponent {
       @LocalStorage() someObject: WebstorableObject = <WebstorableObject>{};
       @SessionStorage() arrayOfSomethings: WebstorableArray = [0,1,2,3,4];
       
       mySuperMethod() {
           this.someObject.a = 1;
           this.someObject['b'] = 2;
           delete this.someObject['c'];
           for (let something of this.arrayOfSomethings) {
               something++;
           }
           // upper changes won't be saved without the lower line
           this.someObject.save();
           this.arrayOfSomethings.save();
       }
    }
    ```
    Alternatively use `Local`(or Session)`StorageService` or make straight assignment by hand.


**Note**: Define always a default value at the property you are using `@LocalStorage`.

**Note**: The localstorage key is per default the property name. Define the first argument of `@LocalStorage` to set different one.

**Note**: Please don't store circular structures as this library uses JSON.stringify to encode before using LocalStorage.

### TODO
- Try to automatically handle all data manipulations using [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)
- Add tests

**Contributions are welcome!**
