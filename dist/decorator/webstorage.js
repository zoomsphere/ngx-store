"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var webstorage_utility_1 = require("../utility/webstorage.utility");
var webstorage_service_1 = require("../service/webstorage.service");
function LocalStorage(key) {
    return exports.WebStorage(localStorage, webstorage_service_1.LocalStorageService, key);
}
exports.LocalStorage = LocalStorage;
function SessionStorage(key) {
    return exports.WebStorage(sessionStorage, webstorage_service_1.SessionStorageService, key);
}
exports.SessionStorage = SessionStorage;
// initialization cache
var cache = {};
exports.WebStorage = function (webStorage, service, key) {
    return function (target, propertyName) {
        key = key || propertyName;
        var proxy = target[propertyName];
        service.keys.push(key);
        Object.defineProperty(target, propertyName, {
            get: function () {
                return proxy;
            },
            set: function (value) {
                if (!cache[key]) {
                    proxy = webstorage_utility_1.WebStorageUtility.get(webStorage, key) || value;
                    cache[key] = true;
                }
                else {
                    proxy = value;
                    webstorage_utility_1.WebStorageUtility.set(webStorage, key, value);
                }
                // manual method for force save
                if (proxy instanceof Object) {
                    proxy.save = function () {
                        webstorage_utility_1.WebStorageUtility.set(webStorage, key, proxy);
                    };
                }
                // handle methods changing value of array
                if (Array.isArray(proxy)) {
                    proxy.push = function (value) {
                        var result = Array.prototype.push.apply(proxy, arguments);
                        webstorage_utility_1.WebStorageUtility.set(webStorage, key, proxy);
                        return result;
                    };
                    proxy.pop = function () {
                        var result = Array.prototype.pop.apply(proxy, arguments);
                        webstorage_utility_1.WebStorageUtility.set(webStorage, key, proxy);
                        return result;
                    };
                    proxy.shift = function () {
                        var result = Array.prototype.shift.apply(proxy, arguments);
                        webstorage_utility_1.WebStorageUtility.set(webStorage, key, proxy);
                        return result;
                    };
                }
            },
        });
    };
};
//# sourceMappingURL=webstorage.js.map