import { WEBSTORAGE_CONFIG } from '../index';
var WebStorageUtility = (function () {
    function WebStorageUtility() {
    }
    WebStorageUtility.generateStorageKey = function (key) {
        return "" + WEBSTORAGE_CONFIG.prefix + key;
    };
    WebStorageUtility.get = function (storage, key) {
        var storageKey = WebStorageUtility.generateStorageKey(key);
        var value = storage.getItem(storageKey);
        return WebStorageUtility.getGettable(value);
    };
    WebStorageUtility.set = function (storage, key, value) {
        var storageKey = WebStorageUtility.generateStorageKey(key);
        storage.setItem(storageKey, WebStorageUtility.getSettable(value));
    };
    WebStorageUtility.remove = function (storage, key) {
        var storageKey = WebStorageUtility.generateStorageKey(key);
        storage.removeItem(storageKey);
    };
    WebStorageUtility.getSettable = function (value) {
        return typeof value === "string" ? value : JSON.stringify(value);
    };
    WebStorageUtility.getGettable = function (value) {
        if (value === 'undefined')
            return undefined;
        try {
            return JSON.parse(value);
        }
        catch (e) {
            return value;
        }
    };
    return WebStorageUtility;
}());
export { WebStorageUtility };
//# sourceMappingURL=webstorage.utility.js.map