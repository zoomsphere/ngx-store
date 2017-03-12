"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var webstorage_service_1 = require("./service/webstorage.service");
var webstorage_1 = require("./decorator/webstorage");
exports.WebStorage = webstorage_1.WebStorage;
exports.LocalStorage = webstorage_1.LocalStorage;
exports.SessionStorage = webstorage_1.SessionStorage;
var webstorage_service_2 = require("./service/webstorage.service");
exports.WebStorageService = webstorage_service_2.WebStorageService;
exports.LocalStorageService = webstorage_service_2.LocalStorageService;
exports.SessionStorageService = webstorage_service_2.SessionStorageService;
var webstorage_utility_1 = require("./utility/webstorage.utility");
exports.WebStorageUtility = webstorage_utility_1.WebStorageUtility;
exports.WEBSTORAGE_CONFIG = {
    prefix: 'angular2ws_'
};
var WebStorageModule = (function () {
    function WebStorageModule() {
    }
    return WebStorageModule;
}());
WebStorageModule = __decorate([
    core_1.NgModule({
        providers: [webstorage_service_1.LocalStorageService, webstorage_service_1.SessionStorageService]
    })
], WebStorageModule);
exports.WebStorageModule = WebStorageModule;
//# sourceMappingURL=index.js.map