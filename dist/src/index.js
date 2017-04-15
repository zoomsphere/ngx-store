import { NgModule } from '@angular/core';
import { LocalStorageService, SessionStorageService } from './service/webstorage.service';
export { LocalStorage, SessionStorage } from './decorator/webstorage';
export { WebStorageService, LocalStorageService, SessionStorageService } from './service/webstorage.service';
export { WebStorageUtility } from './utility/webstorage.utility';
export var WEBSTORAGE_CONFIG = {
    prefix: 'angular2ws_'
};
var WebStorageModule = (function () {
    function WebStorageModule() {
    }
    return WebStorageModule;
}());
export { WebStorageModule };
WebStorageModule.decorators = [
    { type: NgModule, args: [{
                providers: [LocalStorageService, SessionStorageService]
            },] },
];
/** @nocollapse */
WebStorageModule.ctorParameters = function () { return []; };
//# sourceMappingURL=index.js.map