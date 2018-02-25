import { WebStorageService } from './webstorage.service';
import { Config } from '../config/config';
const _get = require('lodash.get');
const _set = require('lodash.set');

export class Resource {
    protected _defaultValue: any = null;
    protected _path: string;
    protected _prefix = Config.prefix;

    constructor(protected service: WebStorageService, protected readonly key: string) {}

    /**
     * Returns value taking path into account
     * @returns {any}
     */
    public get value(): any {
        const value = this.service.utility.get(this.key, {prefix: this._prefix});
        if (this._path) {
            return this.considerDefault(_get(value, this._path));
        }
        return this.considerDefault(value);
    }

    /**
     * Sets path of object property
     * @param {string} path
     * @returns {this}
     */
    public path(path: string): this {
        this._path = path;
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
    public defaultValue(defaultValue: any): this {
        this._defaultValue = defaultValue;
        return this;
    }

    /**
     * Creates or updates value as new entry or existing object property depending on path
     * @param value
     * @returns {this}
     */
    public save(value: any): this {
        if (this._path) {
            value = _set(this.fullValue, this._path, this.considerDefault(value));
        }
        this.service.utility.set(this.key, this.considerDefault(value), {prefix: this._prefix});
        return this;
    }

    protected get fullValue(): any {
        return this.considerDefault(this.service.utility.get(this.key, {prefix: this._prefix}));
    }

    protected considerDefault<T>(value: T): T {
        return (value === null || value === undefined) ? this._defaultValue : value;
    }
}
