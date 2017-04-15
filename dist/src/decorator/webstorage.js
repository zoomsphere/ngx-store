import { WebStorageUtility } from '../utility/webstorage.utility';
import { LocalStorageService, SessionStorageService } from '../service/webstorage.service';
export function LocalStorage(key) {
    return WebStorage(localStorage, LocalStorageService, key);
}
export function SessionStorage(key) {
    return WebStorage(sessionStorage, SessionStorageService, key);
}
// initialization cache
var cache = {};
function WebStorage(webStorage, service, key) {
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
                    proxy = WebStorageUtility.get(webStorage, key) || value;
                    cache[key] = true;
                }
                else {
                    proxy = value;
                    WebStorageUtility.set(webStorage, key, value);
                }
                // manual method for force save
                if (proxy instanceof Object) {
                    proxy.save = function () {
                        WebStorageUtility.set(webStorage, key, proxy);
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
                            WebStorageUtility.set(webStorage, key, proxy);
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
}
//# sourceMappingURL=webstorage.js.map