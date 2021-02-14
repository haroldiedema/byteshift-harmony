/* Byteshift Harmony                                                               _         _             __   _ _____
 *    A component-based HTTP server micro-framework                               | |__ _  _| |_ ___  ___ / /  (_) _/ /_
 *                                                                                | '_ \ || |  _/ -_|(_-</ _ \/ / _/ __/
 * (C)2020, Harold Iedema <harold@iedema.me>                                      |_.__/\_, |\__\___/___/_//_/_/_/ \__/
 * See LICENSE for licensing information                                                |__/             H A R M O N Y
 */
'use strict';

export class Session
{
    private readonly data: { [name: string]: any };

    constructor(sessionData: string)
    {
        try {
            this.data = JSON.parse(sessionData) || {};
        } catch (e) {
            this.data = {};
        }
    }

    /**
     * Returns true if a stored item with the given key exists in the session.
     *
     * @param {string} key
     * @returns {boolean}
     */
    public has(key: string): boolean
    {
        return typeof this.data[key] !== 'undefined';
    }

    /**
     * Retrieves a value associated with the given key from the session.
     *
     * @param {string} key
     * @param {any}    defaultValue
     * @returns {any}
     */
    public get(key: string, defaultValue: any = undefined): any
    {
        return this.has(key) ? this.data[key] : defaultValue;
    }

    /**
     * Stores the given value by the specified key in the session.
     *
     * @param {string} key
     * @param {any}    value
     */
    public set(key: string, value: any): void
    {
        this.data[key] = value;
    }

    /**
     * Deletes a stored item from the session with the given key.
     *
     * @param {string} key
     */
    public delete(key: string): void
    {
        delete this.data[key];
    }

    /**
     * Returns a JSON-string representation of the data in this session.
     *
     * @returns {string}
     */
    public toString(): string
    {
        return JSON.stringify(this.data);
    }
}
