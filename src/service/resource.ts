import { WebStorageService } from './webstorage.service';
import { Config } from '../config/config';
const _get = require('lodash.get');
const _set = require('lodash.set');

export class Resource<T> {
    protected _defaultValue: any = null;
    protected _path: Array<string> = [];
    protected _prefix = Config.prefix;

    constructor(protected service: WebStorageService, protected readonly key: string) {}

    /**
     * Returns value taking path into account
     * @returns {any}
     */
    public get value(): T {
        return this.considerDefault(this.readValue());
    }

    /**
     * Sets path of object property
     * @param {string} path
     * @returns {this}
     */
    public path(path: string): this {
        this._path = path.split('.');
        return this;
    }

    /**
     * Sets prefix
     * @param {string} prefix
     * @returns {this}
     */
    public prefix(prefix: string): this {
        this._prefix = prefix;
        return this;
    }

    /**
     * Sets default value for both reading and saving operations
     * @param defaultValue
     * @returns {this}
     */
    public defaultValue(defaultValue: T): this {
        this._defaultValue = defaultValue;
        return this;
    }

    /**
     * Creates or updates value as a new entry or existing object property depending on path
     * @param value
     * @returns {this}
     */
    public save(value: T): this {
        if (this.pathString) {
            value = _set(this.fullValue, this.pathString, this.considerDefault(value));
        }
        this.service.utility.set(this.key, this.considerDefault(value), {prefix: this._prefix});
        return this;
    }

    protected get fullValue(): T {
        return this.considerDefault(this.service.utility.get(this.key, {prefix: this._prefix}));
    }

    protected considerDefault<S>(value: S): S {
        return this.isNullOrUndefined(value) ? this._defaultValue : value;
    }

    protected isNullOrUndefined(value: any) {
        return (value === null || value === undefined);
    }

    protected get pathString() {
        return this._path.join('.');
    }

    protected readValue() {
        const value = this.service.utility.get(this.key, {prefix: this._prefix});
        if (this.pathString) {
            return _get(value, this.pathString);
        }
        return value;
    }
}
