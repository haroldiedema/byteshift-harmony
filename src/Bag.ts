/* Byteshift Harmony                                                               _         _             __   _ _____
 *    A component-based HTTP server micro-framework                               | |__ _  _| |_ ___  ___ / /  (_) _/ /_
 *                                                                                | '_ \ || |  _/ -_|(_-</ _ \/ / _/ __/
 * (C)2020, Harold Iedema <harold@iedema.me>                                      |_.__/\_, |\__\___/___/_//_/_/_/ \__/
 * See LICENSE for licensing information                                                |__/             H A R M O N Y
 */
'use strict';

export class Bag<T>
{
    private keys: { [name: string]: string } = {};
    private data: { [name: string]: T }      = {};

    constructor(obj?: { [name: string]: any })
    {
        if (obj) {
            this.insert(obj);
        }
    }

    /**
     * Returns the amount of entries in this bag.
     *
     * @return {number}
     */
    public get size(): number
    {
        return Object.keys(this.data).length;
    }

    /**
     * Inserts all data from the given object in this bag.
     */
    public insert(obj: { [name: string]: T }): void
    {
        Object.keys(obj).forEach((name) => {
            this.set(name, obj[name]);
        });
    }

    /**
     * Returns the data associated with the given name.
     *
     * @param {string} name
     * @return {*}
     */
    public get(name: string): T
    {
        return this.data[name.toLowerCase()];
    }

    /**
     * Returns true if an item with the given name exists.
     *
     * @param {string} name
     * @return {boolean}
     */
    public has(name: string): boolean
    {
        return this.data[name.toLowerCase()] !== undefined;
    }

    /**
     * Defines a key and stores the given data.
     *
     * @param name
     * @param data
     */
    public set(name: string, data: T): void
    {
        if (typeof this.keys[name] === 'undefined') {
            this.keys[name.toLowerCase()] = name;
        }
        this.data[name.toLowerCase()] = data;
    }

    /**
     * Returns all stored data with their initial defined key names.
     *
     * @return {{[p: string]: any}}
     */
    public get all(): { [name: string]: T }
    {
        const result: { [name: string]: T } = {};

        Object.keys(this.data).forEach((lowerKey: string) => {
            result[this.keys[lowerKey]] = this.data[lowerKey];
        });

        return result;
    }

    /**
     * Invokes the given callback for each element in this bag.
     *
     * @param {(value: T, name: string) => any} callback
     */
    public forEach(callback: (value: T, name: string) => any): void
    {
        Object.keys(this.data).forEach((lowerKey: string) => {
            callback(this.data[lowerKey], this.keys[lowerKey]);
        });
    }

    /**
     * Returns an array of values of every item in this bag.
     */
    public toArray(sortFn?: (a: T, b: T) => 1 | 0 | -1): T[]
    {
        const result = Object.values(this.data);

        return sortFn ? result.sort(sortFn) : result;
    }
}
