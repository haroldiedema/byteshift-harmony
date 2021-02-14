/* Byteshift Harmony                                                               _         _             __   _ _____
 *    A component-based HTTP server micro-framework                               | |__ _  _| |_ ___  ___ / /  (_) _/ /_
 *                                                                                | '_ \ || |  _/ -_|(_-</ _ \/ / _/ __/
 * (C)2020, Harold Iedema <harold@iedema.me>                                      |_.__/\_, |\__\___/___/_//_/_/_/ \__/
 * See LICENSE for licensing information                                                |__/             H A R M O N Y
 */
'use strict';

import {Bag}             from './Bag';
import {IRoute}          from './Router/Router';
import {IncomingMessage} from 'http';

const optionalParam = /\((.*?)\)/g;
const namedParam    = /(\(\?)?:\w+/g;
// eslint-disable-next-line no-useless-escape
const escapeRegExp  = /[\-{}\[\]+?.,\\^$|#\s]/g;
const splatParam    = /\*/g;

export class Request
{
    private readonly _clientIp: string;
    private readonly _method: string;
    private readonly _parameters: Bag<any>;
    private readonly _headers: Bag<string>;
    private readonly _cookies: Bag<string>;
    private readonly _query: Bag<string | number>;
    private readonly _path: string;

    public constructor(private r: IncomingMessage)
    {
        // const u = url.parse(r.url, true, true);
        const u: URL                     = new URL(r.url, 'http://localhost/');
        const q: { [name: string]: any } = {};

        u.searchParams.forEach((v, k) => q[k] = v);

        this._clientIp   = r.socket.remoteAddress;
        this._method     = r.method.toUpperCase();
        this._path       = u.pathname;
        this._headers    = new Bag(r.headers);
        this._cookies    = new Bag(r.headers.cookie ? this._parseCookies(r.headers.cookie) : {});
        this._query      = new Bag(q);
        this._parameters = new Bag();
    }

    /**
     * Returns a value from one of the available bags in the following order:
     *  - cookies
     *  - headers
     *  - parameters (derived from path)
     *  - query parameters
     *
     * @param {string} name
     * @return {*}
     */
    public get(name: string): any
    {
        if (this._cookies.has(name)) {
            return this._cookies.get(name);
        }
        if (this._headers.has(name)) {
            return this._headers.get(name);
        }
        if (this._parameters.has(name)) {
            return this._parameters.get(name);
        }
        if (this._query.has(name)) {
            return this._query.get(name);
        }

        return undefined;
    }

    /**
     * Returns the IP address of the client.
     *
     * @return {string}
     */
    public get clientIp(): string
    {
        return this._clientIp;
    }

    /**
     * Returns the request path.
     *
     * @return {string}
     */
    public get path(): string
    {
        return this._path;
    }

    /**
     * Returns the HTTP method in upper-case string representation.
     *
     * @return {string}
     */
    public get method(): string
    {
        return this._method;
    }

    /**
     * Returns the cookie bag.
     *
     * @return {Bag}
     */
    public get cookies(): Bag<string>
    {
        return this._cookies;
    }

    /**
     * Returns the headers bag.
     *
     * @return {Bag}
     */
    public get headers(): Bag<string>
    {
        return this._headers;
    }

    /**
     * Returns the query parameters bag.
     *
     * @return {Bag}
     */
    public get query(): Bag<string | number>
    {
        return this._query;
    }

    /**
     * Returns the route parameters bag.
     *
     * @returns {Bag<string>}
     */
    public get parameters(): Bag<string>
    {
        return this._parameters;
    }

    /**
     * Returns true if the given route matches this request.
     *
     * @param {IRoute} route
     * @return {boolean}
     */
    public isMatchingRoute(route: IRoute): boolean
    {
        if (this.method !== route.method) {
            return false;
        }

        if (!route._matcher) {
            route._matcher = this._parsePattern(route.path);
        }

        let result = route._matcher.regExp.exec(this.path);
        if (!result) {
            return false;
        }
        result = <any>result.slice(1, -1);

        // Store the params in the parameter bag.
        result.reduce((obj: any, val: string, index: number) => {
            if (val) {
                this._parameters.set(route._matcher.namedParams[index], val);
            }
            return obj;
        }, {});

        return true;
    }

    /**
     * @param {string} pattern
     * @return {{regExp: RegExp, namedParams: string[]}}
     * @private
     */
    private _parsePattern(pattern: string)
    {
        let names: string[] = [];

        pattern = pattern
            .replace(escapeRegExp, '\\$&')
            .replace(optionalParam, '(?:$1)?')
            .replace(namedParam, function(match, optional) {
                names.push(match.slice(1));
                return optional ? match : '([^/?]+)';
            })
            .replace(splatParam, function() {
                names.push('path');
                return '([^?]*?)';
            });

        return {
            regExp:      new RegExp('^' + pattern + '(?:\\?([\\s\\S]*))?$'),
            namedParams: names,
        };
    }

    /**
     * Parses a cookie header into a key-value object.
     *
     * @param {string} cookieString
     * @returns {{[p: string]: string}}
     * @private
     */
    private _parseCookies(cookieString: string): { [name: string]: string }
    {
        if (typeof cookieString !== 'string') {
            return {};
        }

        const obj: { [name: string]: any } = {},
              pairs                        = cookieString.split(/; */);

        for (let i = 0; i < pairs.length; i++) {
            let pair  = pairs[i],
                parts = pair.indexOf('=');

            if (parts < 1) {
                continue;
            }

            let key = pair.substr(0, parts).trim(),
                val = pair.substr(++parts, pair.length).trim();

            if ('"' == val[0]) {
                val = val.slice(1, -1);
            }

            if (undefined == obj[key]) {
                obj[key] = decodeURIComponent(val);
            }
        }

        return obj;
    }
}
