"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../index");
var WebStorageUtility = (function () {
    function WebStorageUtility() {
    }
    WebStorageUtility.generateStorageKey = function (key) {
        return "" + index_1.WEBSTORAGE_CONFIG.prefix + key;
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
exports.WebStorageUtility = WebStorageUtility;
//# sourceMappingURL=webstorage.utility.js.map