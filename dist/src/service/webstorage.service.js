var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { Injectable } from '@angular/core';
import { WebStorageUtility } from '../utility/webstorage.utility';
var WebStorageService = (function () {
    function WebStorageService(storage) {
        this.storage = storage;
    }
    WebStorageService.prototype.get = function (key) {
        return WebStorageUtility.get(this.storage, key);
    };
    WebStorageService.prototype.set = function (key, value) {
        WebStorageUtility.set(this.storage, key, value);
    };
    WebStorageService.prototype.remove = function (key) {
        WebStorageUtility.remove(this.storage, key);
    };
    WebStorageService.prototype.clear = function () {
        for (var _i = 0, _a = this.constructor.keys; _i < _a.length; _i++) {
            var key = _a[_i];
            this.storage.removeItem(key);
        }
    };
    return WebStorageService;
}());
export { WebStorageService };
var LocalStorageService = (function (_super) {
    __extends(LocalStorageService, _super);
    function LocalStorageService() {
        return _super.call(this, localStorage) || this;
    }
    return LocalStorageService;
}(WebStorageService));
export { LocalStorageService };
LocalStorageService.keys = [];
LocalStorageService.decorators = [
    { type: Injectable },
];
/** @nocollapse */
LocalStorageService.ctorParameters = function () { return []; };
var SessionStorageService = (function (_super) {
    __extends(SessionStorageService, _super);
    function SessionStorageService() {
        return _super.call(this, sessionStorage) || this;
    }
    return SessionStorageService;
}(WebStorageService));
export { SessionStorageService };
SessionStorageService.keys = [];
SessionStorageService.decorators = [
    { type: Injectable },
];
/** @nocollapse */
SessionStorageService.ctorParameters = function () { return []; };
//# sourceMappingURL=webstorage.service.js.map