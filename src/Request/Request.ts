/* Byteshift Harmony                                                               _         _             __   _ _____
 *    A component-based HTTP server micro-framework                               | |__ _  _| |_ ___  ___ / /  (_) _/ /_
 *                                                                                | '_ \ || |  _/ -_|(_-</ _ \/ / _/ __/
 * (C)2020, Harold Iedema <harold@iedema.me>                                      |_.__/\_, |\__\___/___/_//_/_/_/ \__/
 * See LICENSE for licensing information                                                |__/             H A R M O N Y
 */
'use strict';

import {TLSSocket}      from 'tls';
import {Bag}            from '../Bag';
import {Profile}        from '../Profiler/Profile';
import {IRoute}         from '../Router/Router';
import {RawHttpRequest} from '../Server/RawHttpRequest';
import {IUploadedFile}  from './IUploadedFile';
import {RequestBody}    from './RequestBody';

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
    private readonly _post: Bag<string | string[]>;
    private readonly _files: Bag<IUploadedFile | IUploadedFile[]>;
    private readonly _body: Buffer;
    private readonly _isSecure: boolean;
    private readonly _profile: Profile;

    public constructor(private r: RawHttpRequest, body: RequestBody, profile: Profile = null)
    {
        const u: URL                     = new URL(r.url, 'http://localhost/');
        const q: { [name: string]: any } = {};

        u.searchParams.forEach((v, k) => q[k] = v);

        this._clientIp   = r.headers['x-forwarded-for'] as string || r.socket.remoteAddress;
        this._method     = r.method.toUpperCase();
        this._path       = u.pathname.replace(/(\/)$/g, '') || '/';
        this._headers    = new Bag(r.headers);
        this._cookies    = new Bag(r.headers.cookie ? this._parseCookies(r.headers.cookie) : {});
        this._query      = new Bag(q);
        this._parameters = new Bag();
        this._post       = body.fields;
        this._files      = body.files;
        this._body       = body.raw;
        this._isSecure   = (r.socket instanceof TLSSocket) && r.socket.encrypted;
        this._profile    = profile;
    }

    /**
     * Returns a value from one of the available bags in the following order:
     *  - post fields
     *  - files
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
        if (this._post.has(name)) {
            return this._post.get(name);
        }
        if (this._files.has(name)) {
            return this._files.get(name);
        }
        if (this._headers.has(name)) {
            return this._headers.get(name);
        }
        if (this._cookies.has(name)) {
            return this._cookies.get(name);
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
     * Starts a profile measurement with the given name.
     *
     * Call {@link Request.stopProfileMeasurement} to finalize the measurement
     * and store it in the profile so it can be seen in the profiler timeline.
     *
     * @param {string} name
     * @returns {this}
     */
    public startProfileMeasurement(name: string): this
    {
        if (this._profile instanceof Profile) {
            this._profile.start(name);
        }

        return this;
    }

    /**
     * Stops the time measurement of the event with the given name.
     *
     * @param {string} name
     * @returns {this}
     */
    public stopProfileMeasurement(name: string): this
    {
        if (this._profile instanceof Profile) {
            this._profile.stop(name);
        }

        return this;
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
     * Returns true if the incoming request came from a secure (HTTPS/TLS)
     * connection.
     *
     * @returns {boolean}
     */
    public get isSecure(): boolean
    {
        return this._isSecure;
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
     * Returns the POST-fields bag.
     *
     * @returns {Bag<string | string[]>}
     */
    public get post(): Bag<string | string[]>
    {
        return this._post;
    }

    /**
     * Returns the files bag.
     *
     * @returns {Bag<IUploadedFile | IUploadedFile[]>}
     */
    public get files(): Bag<IUploadedFile | IUploadedFile[]>
    {
        return this._files;
    }

    /**
     * Returns the request body as parsed JSON content.
     *
     * @returns {any}
     */
    public get json(): any
    {
        try {
            return JSON.parse(this._body.toString());
        } catch (e) {
            return null;
        }
    }

    /**
     * Returns the raw request body as a buffer.
     *
     * @returns {string}
     */
    public get body(): Buffer
    {
        return this._body;
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
