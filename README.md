# Angular2 @LocalStorage

This little Angular2/typescript decorator makes it super easy to save and restore *automatically* a variable state in your
directive (class property) using HTML5' LocalStorage.

## What's new

Things that have been added in this fork:
- support for `Array` methods that change its value (`push`, `pop` and `shift` to be exact)
- `.save()` method on returned object, used in specific cases to force save object changes

## Use

1. Download the library using npm or github: `npm install --save angular2-localstorage`
2. Import the WebStorageModule in your app module:
    ```typescript
    import {Component} from "angular2/core";
    import {WebStorageModule, LocalStorageService} from "angular2-localstorage";

    @NgModule({
        import: [WebStorageModule]
    @Component({
        providers: [LocalStorageService]
    })
    export class AppModule {}
    ```


3. Use the `LocalStorage` or `SessionStorage` decorator
    ```typescript
    import {LocalStorage, SessionStorage} from "angular2-localstorage/WebStorage";
    
    class MySuperComponent {
        @LocalStorage() public lastSearchQuery:Object = {};
        @LocalStorage('differentLocalStorageKey') public lastSearchQuery:Object = {};
        @SessionStorage('itWillBeRemovedAfterBrowserClose') private lastSearchQueries: Array<{}> = [];
    }
    ```

4. Force save changes
If you need to modify stored object in ways that can't be automatically handled (generally changing object properties or array elements using index signature),
and don't want to use Service, then you can take advantage of `.save()` method to force save introduced changes. Example:
    ```typescript
    import {LocalStorage, Webstorable} from 'angular2-localstorage';

    type WebstorableObject = Webstorable & Object; // save() method is declared in the Webstorable interface

    class MySuperComponent {
       @LocalStorage() someObject: WebstorableObject = <WebstorableObject>{};
       
       constructor() {
           this.someObject.a = 1;
           this.someObject['b'] = 2;
           delete this.someObject['c'];
           // upper changes won't be saved without the lower line
           this.someObject.save();
       }
    }
    ```


**Note**: Define always a default value at the property you are using `@LocalStorage`.

**Note**: The localstorage key is per default the property name. Define the first argument of `@LocalStorage` to set different one.

**Note**: Please don't store circular structures as this library uses JSON.stringify to encode before using LocalStorage.

## Examples

```typescript
@Component({
    selector: 'app-login',
    template: `
<form>
    <div>
        <input type="text" [(ngModel)]="username" placeholder="Username" />
        <input type="password" [(ngModel)]="password" placeholder="Password" />
    </div>
    
    <input type="checkbox" [(ngModel)]="rememberMe" /> Keep me logged in

    <button type="submit">Login</button>
</form>
    `
})
class AppLoginComponent {
    //here happens the magic. `username` is always restored from the localstorage when you reload the site
    @LocalStorage() public username:string = '';
    
    public password:string;
    
    //here happens the magic. `rememberMe` is always restored from the localstorage when you reload the site
    @LocalStorage() public rememberMe:boolean = false;
}
```


```typescript
@Component({
    selector: 'admin-menu',
    template: `
<div *ngFor="#menuItem of menuItems() | mapToIterable; #i = index">
    <h2 (click)="hiddenMenuItems[i] = !!!hiddenMenuItems[i]">
        {{i}}: {{category.label}}
    </h2>
    <div style="padding-left: 15px;" [hidden]="hiddenMenuItems[i]">
        <a href>Some sub menu item 1</a>
        <a href>Some sub menu item 2</a>
        <a href>Some sub menu item 3</a>
    </div>
</div>
    `
})
class AdminMenuComponent {
    public menuItems = [{title: 'Menu1'}, {title: 'Menu2'}, {title: 'Menu3'}];

    //here happens the magic. `hiddenMenuItems` is always restored from the localstorage when you reload the site
    @LocalStorage() public hiddenMenuItems:Array<boolean> = [];
    
    //here happens the magic. `profile` is always restored from the sessionStorage when you reload the site from the current tab/browser. This is perfect for more sensitive information that shouldn't stay once the user closes the browser.
    @SessionStorage() public profile:any = {};
}
```
