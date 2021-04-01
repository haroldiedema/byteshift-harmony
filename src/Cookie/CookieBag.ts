/* Byteshift Harmony                                                               _         _             __   _ _____
 *    A component-based HTTP server micro-framework                               | |__ _  _| |_ ___  ___ / /  (_) _/ /_
 *                                                                                | '_ \ || |  _/ -_|(_-</ _ \/ / _/ __/
 * (C)2020, Harold Iedema <harold@iedema.me>                                      |_.__/\_, |\__\___/___/_//_/_/_/ \__/
 * See LICENSE for licensing information                                                |__/             H A R M O N Y
 */
'use strict';

import {Cookie} from './Cookie';

export class CookieBag
{
    private _cookies: Map<string, Cookie> = new Map();

    constructor()
    {
    }

    /**
     * Sets a cookie with the given name and value with a lifetime of the given
     * amount of seconds.
     */
    public set(
        name: string,
        value: string,
        ttl: number                                = (3600 * 24),
        domain: string                             = null,
        path: string                               = '/',
        httpOnly: boolean                          = false,
        secure: boolean                            = false,
        sameSite: true | 'strict' | 'lax' | 'none' = 'lax',
    )
    {
        const cookie = new Cookie(name, value);

        cookie.domain   = domain;
        cookie.path     = path;
        cookie.httpOnly = httpOnly;
        cookie.secure   = secure;
        cookie.sameSite = sameSite;

        // Calculate TTL.
        const now    = new Date();
        if (ttl > 0) {
            const maxAge   = ttl;

            cookie.expires = new Date((new Date()).getTime() + (maxAge * 1000));
            cookie.maxAge  = maxAge;
        }

        this._cookies.set(name, cookie);
    }

    /**
     * Returns header value strings for all cookies currently in the bag.
     *
     * @returns {string[]}
     */
    public serialize(): string[]
    {
        const result: string[] = [];
        this._cookies.forEach((cookie: Cookie) => {
            result.push(cookie.serialize());
        });

        return result;
    }
}
