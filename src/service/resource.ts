import { WebStorageService } from './webstorage.service';
import { Config } from '../config/config';
const _get = require('lodash.get');
const _set = require('lodash.set');
const _merge = require('lodash.merge');

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
     * Returns default value
     * @returns {T}
     */
    public get defaultValue(): T {
        return this._defaultValue;
    }

    /**
     * Returns current path as a string
     * @returns {string}
     */
    public get path(): string {
        return this.pathString;
    }

    /**
     * Returns currently set prefix
     * @returns {string}
     */
    public get prefix(): string {
        return this._prefix;
    }

    /**
     * Sets path of object property
     * @param {string} path
     * @returns {this}
     */
    public setPath(path: string): this {
        this._path = path.split('.');
        return this;
    }

    /**
     * Appends current path
     * e.g. if path('key') and appendPath('nested'), the path will be "key.nested"
     * @param {string} path
     * @returns {this}
     */
    public appendPath(path: string): this {
        this._path.push(path);
        return this;
    }

    /**
     * Removes last item of path
     * e.g. if path('key.nested') and truncatePath(), the path will be "key"
     * @returns {this}
     */
    public truncatePath(): this {
        this._path.pop();
        return this;
    }

    /**
     * Resets set path
     * @returns {this}
     */
    public resetPath(): this {
        this._path = [];
        return this;
    }

    /**
     * Sets prefix
     * @param {string} prefix
     * @returns {this}
     */
    public setPrefix(prefix: string): this {
        this._prefix = prefix;
        return this;
    }

    /**
     * Moves storage item to new key using given prefix
     * @param {string} prefix
     * @returns {this}
     */
    public changePrefix(prefix: string): this {
        this.service.utility.set(this.key, this.fullValue, {prefix});
        this.service.utility.remove(this.key, {prefix: this._prefix});
        return this.setPrefix(prefix);
    }

    /**
     * Sets default value for both reading and saving operations
     * @param defaultValue
     * @returns {this}
     */
    public setDefaultValue(defaultValue: T): this {
        this._defaultValue = defaultValue;
        const value = this.readValue();
        if (this.isNullOrUndefined(value)) {
            this.save(defaultValue);
        }
        return this;
    }

    /**
     * Creates or overrides value as a new entry or existing object property depending on path
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

    /**
     * Updates existing object property using current path
     * @param {T} value
     * @returns {this}
     */
    public update(value: T): this {
        return this.save(_merge(this.readValue(), value));
    }

    /**
     * Removes item stored under current key
     * @returns {this}
     */
    public remove(): this {
        this.service.utility.remove(this.key);
        return this;
    }

    protected get fullValue(): T {
        return this.considerDefault(this.service.utility.get(this.key, {prefix: this._prefix}));
    }

    protected considerDefault<S>(value: S): S {
        return this.isNullOrUndefined(value) ? this._defaultValue : value;
    }

    protected isNullOrUndefined(value: any): boolean {
        return (value === null || value === undefined);
    }

    protected get pathString(): string {
        return this._path.join('.');
    }

    protected readValue(): T {
        const value = this.service.utility.get(this.key, {prefix: this._prefix});
        if (this.pathString) {
            return _get(value, this.pathString);
        }
        return value;
    }
}
