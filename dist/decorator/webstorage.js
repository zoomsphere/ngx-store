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
                    var methodsToOverwrite = [
                        'join', 'pop', 'push', 'reverse', 'shift', 'unshift', 'splice',
                        'filter', 'forEach', 'map', 'fill', 'sort', 'copyWithin'
                    ];
                    var _loop_1 = function (method) {
                        proxy[method] = function (value) {
                            var result = Array.prototype[method].apply(proxy, arguments);
                            webstorage_utility_1.WebStorageUtility.set(webStorage, key, proxy);
                            return result;
                        };
                    };
                    for (var _i = 0, methodsToOverwrite_1 = methodsToOverwrite; _i < methodsToOverwrite_1.length; _i++) {
                        var method = methodsToOverwrite_1[_i];
                        _loop_1(method);
                    }
                }
            },
        });
    };
};
//# sourceMappingURL=webstorage.js.map