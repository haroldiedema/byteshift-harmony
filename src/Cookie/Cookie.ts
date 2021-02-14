/* Byteshift Harmony                                                               _         _             __   _ _____
 *    A component-based HTTP server micro-framework                               | |__ _  _| |_ ___  ___ / /  (_) _/ /_
 *                                                                                | '_ \ || |  _/ -_|(_-</ _ \/ / _/ __/
 * (C)2020, Harold Iedema <harold@iedema.me>                                      |_.__/\_, |\__\___/___/_//_/_/_/ \__/
 * See LICENSE for licensing information                                                |__/             H A R M O N Y
 */
'use strict';

const fieldRegExp = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;

export class Cookie
{
    public maxAge: number     = 0;
    public domain: string     = null;
    public path: string       = '/';
    public expires: Date      = null;
    public httpOnly: boolean  = null;
    public secure: boolean    = null;
    public sameSite: SameSite = null;

    public constructor(public name: string, public value: string)
    {
    }

    public serialize(): string
    {
        if (!fieldRegExp.test(this.name)) {
            throw new Error('Failed to serialize cookie "' + this.name + '" due to invalid characters in the name.');
        }
        if (!fieldRegExp.test(this.value)) {
            throw new Error('Failed to serialize cookie "' + this.value + '" due to invalid characters in the value.');
        }

        let str = this.name + '=' + encodeURIComponent(this.value);

        if (this.maxAge) {
            const maxAge = this.maxAge - 0;

            if (isNaN(maxAge) || !isFinite(maxAge)) {
                throw new TypeError('maxAge of cookie "' + this.name + '" is invalid');
            }

            str += '; Max-Age=' + Math.floor(maxAge);
        }

        if (this.domain) {
            if (!fieldRegExp.test(this.domain)) {
                throw new Error('Failed to serialize cookie "' + this.name + '" due to invalid characters in the domain property.');
            }

            str += '; Domain=' + this.domain;
        }

        if (this.path) {
            if (!fieldRegExp.test(this.path)) {
                throw new Error('Failed to serialize cookie "' + this.name + '" due to invalid characters in the path property.');
            }

            str += '; Path=' + this.path;
        }

        if (this.expires) {
            if (! (this.expires instanceof Date)) {
                throw new Error('Failed to serialize cookie "' + this.name + '" because "expires" is expected to be a Date object.');
            }

            str += '; Expires=' + this.expires.toUTCString();
        }

        if (this.httpOnly) {
            str += '; HttpOnly';
        }

        if (this.secure) {
            str += '; Secure';
        }

        if (this.sameSite) {
            switch (this.sameSite) {
                case true:
                case 'strict':
                    str += '; SameSite=Strict';
                    break;
                case 'lax':
                    str += '; SameSite=Lax';
                    break;
                case 'none':
                    str += '; SameSite=None';
                    break;
            }
        }

        return str;
    }
}

type SameSite = true | 'strict' | 'lax' | 'none';
