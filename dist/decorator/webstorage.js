"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var webstorage_utility_1 = require("../utility/webstorage.utility");
function LocalStorage(key) {
    return exports.WebStorage(localStorage, key);
}
exports.LocalStorage = LocalStorage;
function SessionStorage(key) {
    return exports.WebStorage(sessionStorage, key);
}
exports.SessionStorage = SessionStorage;
// initialization cache
var cache = {};
exports.WebStorage = function (webStorage, key) {
    return function (target, propertyName) {
        key = key || propertyName;
        var proxy = target[propertyName];
        var storedValue = webstorage_utility_1.WebStorageUtility.get(webStorage, key);
        Object.defineProperty(target, propertyName, {
            get: function () {
                return proxy;
            },
            set: function (value) {
                if (!cache[key] && storedValue) {
                    proxy = storedValue;
                }
                else {
                    proxy = value;
                    webstorage_utility_1.WebStorageUtility.set(webStorage, key, value);
                }
                cache[key] = true;
                // manual method for force save
                proxy.save = function () {
                    webstorage_utility_1.WebStorageUtility.set(webStorage, key, proxy);
                };
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