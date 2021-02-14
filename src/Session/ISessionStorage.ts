/* Byteshift Harmony                                                               _         _             __   _ _____
 *    A component-based HTTP server micro-framework                               | |__ _  _| |_ ___  ___ / /  (_) _/ /_
 *                                                                                | '_ \ || |  _/ -_|(_-</ _ \/ / _/ __/
 * (C)2020, Harold Iedema <harold@iedema.me>                                      |_.__/\_, |\__\___/___/_//_/_/_/ \__/
 * See LICENSE for licensing information                                                |__/             H A R M O N Y
 */
'use strict';

export interface ISessionStorage
{
    /**
     * Retrieves an item from the session storage.
     *
     * @param {string} name
     * @returns {string}
     */
    get(name: string): string | undefined;

    /**
     * Stores an item to the session storage.
     *
     * @param {string} name
     * @param {string} value
     */
    set(name: string, value: string): void;

    /**
     * Deletes an item from the session storage.
     *
     * @param {string} name
     */
    delete(name: string): void;

    /**
     * Purges any expired session data from the storage.
     */
    gc(): void;
}
