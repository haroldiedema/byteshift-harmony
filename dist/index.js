'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

require('reflect-metadata');
var http = require('http');
var https = require('https');
var fs = require('fs');
var path = require('path');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var http__default = /*#__PURE__*/_interopDefaultLegacy(http);
var https__default = /*#__PURE__*/_interopDefaultLegacy(https);
var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);
var path__default = /*#__PURE__*/_interopDefaultLegacy(path);

/* Byteshift Harmony                                                               _         _             __   _ _____
 *    A component-based HTTP server micro-framework                               | |__ _  _| |_ ___  ___ / /  (_) _/ /_
 *                                                                                | '_ \ || |  _/ -_|(_-</ _ \/ / _/ __/
 * (C)2020, Harold Iedema <harold@iedema.me>                                      |_.__/\_, |\__\___/___/_//_/_/_/ \__/
 * See LICENSE for licensing information                                                |__/             H A R M O N Y
 */
class Bag {
    constructor(obj) {
        this.keys = {};
        this.data = {};
        if (obj) {
            this.insert(obj);
        }
    }
    /**
     * Returns the amount of entries in this bag.
     *
     * @return {number}
     */
    get size() {
        return Object.keys(this.data).length;
    }
    /**
     * Inserts all data from the given object in this bag.
     */
    insert(obj) {
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
    get(name) {
        return this.data[name.toLowerCase()];
    }
    /**
     * Returns true if an item with the given name exists.
     *
     * @param {string} name
     * @return {boolean}
     */
    has(name) {
        return this.data[name.toLowerCase()] !== undefined;
    }
    /**
     * Defines a key and stores the given data.
     *
     * @param name
     * @param data
     */
    set(name, data) {
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
    get all() {
        const result = {};
        Object.keys(this.data).forEach((lowerKey) => {
            result[this.keys[lowerKey]] = this.data[lowerKey];
        });
        return result;
    }
    /**
     * Invokes the given callback for each element in this bag.
     *
     * @param {(value: T, name: string) => any} callback
     */
    forEach(callback) {
        Object.keys(this.data).forEach((lowerKey) => {
            callback(this.data[lowerKey], this.keys[lowerKey]);
        });
    }
    /**
     * Returns an array of values of every item in this bag.
     */
    toArray(sortFn) {
        const result = Object.values(this.data);
        return sortFn ? result.sort(sortFn) : result;
    }
}

/* Byteshift Harmony                                                               _         _             __   _ _____
 *    A component-based HTTP server micro-framework                               | |__ _  _| |_ ___  ___ / /  (_) _/ /_
 *                                                                                | '_ \ || |  _/ -_|(_-</ _ \/ / _/ __/
 * (C)2020, Harold Iedema <harold@iedema.me>                                      |_.__/\_, |\__\___/___/_//_/_/_/ \__/
 * See LICENSE for licensing information                                                |__/             H A R M O N Y
 */
const fieldRegExp = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;
class Cookie {
    constructor(name, value) {
        this.name = name;
        this.value = value;
        this.maxAge = 0;
        this.domain = null;
        this.path = '/';
        this.expires = null;
        this.httpOnly = null;
        this.secure = null;
        this.sameSite = null;
    }
    serialize() {
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
            if (!(this.expires instanceof Date)) {
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

/* Byteshift Harmony                                                               _         _             __   _ _____
 *    A component-based HTTP server micro-framework                               | |__ _  _| |_ ___  ___ / /  (_) _/ /_
 *                                                                                | '_ \ || |  _/ -_|(_-</ _ \/ / _/ __/
 * (C)2020, Harold Iedema <harold@iedema.me>                                      |_.__/\_, |\__\___/___/_//_/_/_/ \__/
 * See LICENSE for licensing information                                                |__/             H A R M O N Y
 */
class CookieBag {
    constructor() {
        this._cookies = new Map();
    }
    /**
     * Sets a cookie with the given name and value with a lifetime of the given
     * amount of seconds.
     */
    set(name, value, ttl = (3600 * 24), domain = null, path = null, httpOnly = false, secure = false, sameSite = 'lax') {
        const cookie = new Cookie(name, value);
        cookie.domain = domain;
        cookie.path = path;
        cookie.httpOnly = httpOnly;
        cookie.secure = secure;
        cookie.sameSite = sameSite;
        if (ttl > 0) {
            const maxAge = ttl;
            cookie.expires = new Date((new Date()).getTime() + (maxAge * 1000));
            cookie.maxAge = maxAge;
        }
        this._cookies.set(name, cookie);
    }
    /**
     * Returns header value strings for all cookies currently in the bag.
     *
     * @returns {string[]}
     */
    serialize() {
        const result = [];
        this._cookies.forEach((cookie) => {
            result.push(cookie.serialize());
        });
        return result;
    }
}

/* Byteshift Harmony                                                               _         _             __   _ _____
 *    A component-based HTTP server micro-framework                               | |__ _  _| |_ ___  ___ / /  (_) _/ /_
 *                                                                                | '_ \ || |  _/ -_|(_-</ _ \/ / _/ __/
 * (C)2020, Harold Iedema <harold@iedema.me>                                      |_.__/\_, |\__\___/___/_//_/_/_/ \__/
 * See LICENSE for licensing information                                                |__/             H A R M O N Y
 */
class Response {
    constructor(content, statusCode = exports.HttpStatus.OK, contentType = 'text/plain') {
        this._code = exports.HttpStatus.OK;
        this._content = '';
        this._isSent = false;
        this._headers = new Bag();
        this._cookies = new CookieBag();
        this.content = content;
        this.contentType = contentType;
        this.statusCode = statusCode;
    }
    /**
     * Returns the cookie bag associated with this response.
     *
     * @returns {CookieBag}
     */
    get cookies() {
        return this._cookies;
    }
    /**
     * Returns the header bag associated with this response.
     *
     * @returns {Bag<string>}
     */
    get headers() {
        return this._headers;
    }
    /**
     * Sets the HTTP status code of this response.
     *
     * @param {number} code
     */
    set statusCode(code) {
        this._code = code;
    }
    get statusCode() {
        return this._code;
    }
    /**
     * Sets the Content-Type header of the response.
     *
     * @param {string} contentType
     */
    set contentType(contentType) {
        this._headers.set('Content-Type', contentType);
    }
    /**
     * Sets the content of this response to be sent to the client.
     *
     * @param {string | Buffer} content
     */
    set content(content) {
        this._content = content;
    }
    get content() {
        return this._content;
    }
    /**
     * Returns true if this response is sent to the client.
     *
     * @returns {boolean}
     */
    get isSent() {
        return this._isSent;
    }
    /**
     * Sends this request to the client.
     */
    send(response) {
        if (this._isSent) {
            throw new Error('This response was already sent.');
        }
        this._isSent = true;
        // Write cookie headers.
        const cookies = this._cookies.serialize();
        for (let cookieString of cookies) {
            response.setHeader('Set-Cookie', cookieString);
        }
        // Write HTTP status & headers.
        response.writeHead(this._code, this._headers.all);
        // Write response & finalize the request.
        response.write(this._content);
        response.end();
    }
}
(function (HttpStatus) {
    HttpStatus[HttpStatus["CONTINUE"] = 100] = "CONTINUE";
    HttpStatus[HttpStatus["SWITCHING_PROTOCOLS"] = 101] = "SWITCHING_PROTOCOLS";
    HttpStatus[HttpStatus["PROCESSING"] = 102] = "PROCESSING";
    HttpStatus[HttpStatus["EARLY_HINTS"] = 103] = "EARLY_HINTS";
    HttpStatus[HttpStatus["OK"] = 200] = "OK";
    HttpStatus[HttpStatus["CREATED"] = 201] = "CREATED";
    HttpStatus[HttpStatus["ACCEPTED"] = 202] = "ACCEPTED";
    HttpStatus[HttpStatus["NON_AUTHORITATIVE_INFORMATION"] = 203] = "NON_AUTHORITATIVE_INFORMATION";
    HttpStatus[HttpStatus["NO_CONTENT"] = 204] = "NO_CONTENT";
    HttpStatus[HttpStatus["RESET_CONTENT"] = 205] = "RESET_CONTENT";
    HttpStatus[HttpStatus["PARTIAL_CONTENT"] = 206] = "PARTIAL_CONTENT";
    HttpStatus[HttpStatus["MULTI_STATUS"] = 207] = "MULTI_STATUS";
    HttpStatus[HttpStatus["ALREADY_REPORTED"] = 208] = "ALREADY_REPORTED";
    HttpStatus[HttpStatus["IM_USED"] = 226] = "IM_USED";
    HttpStatus[HttpStatus["MULTIPLE_CHOICES"] = 300] = "MULTIPLE_CHOICES";
    HttpStatus[HttpStatus["MOVED_PERMANENTLY"] = 301] = "MOVED_PERMANENTLY";
    HttpStatus[HttpStatus["FOUND"] = 302] = "FOUND";
    HttpStatus[HttpStatus["SEE_OTHER"] = 303] = "SEE_OTHER";
    HttpStatus[HttpStatus["NOT_MODIFIED"] = 304] = "NOT_MODIFIED";
    HttpStatus[HttpStatus["USE_PROXY"] = 305] = "USE_PROXY";
    HttpStatus[HttpStatus["RESERVED"] = 306] = "RESERVED";
    HttpStatus[HttpStatus["TEMPORARY_REDIRECT"] = 307] = "TEMPORARY_REDIRECT";
    HttpStatus[HttpStatus["PERMANENTLY_REDIRECT"] = 308] = "PERMANENTLY_REDIRECT";
    HttpStatus[HttpStatus["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    HttpStatus[HttpStatus["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
    HttpStatus[HttpStatus["PAYMENT_REQUIRED"] = 402] = "PAYMENT_REQUIRED";
    HttpStatus[HttpStatus["FORBIDDEN"] = 403] = "FORBIDDEN";
    HttpStatus[HttpStatus["NOT_FOUND"] = 404] = "NOT_FOUND";
    HttpStatus[HttpStatus["METHOD_NOT_ALLOWED"] = 405] = "METHOD_NOT_ALLOWED";
    HttpStatus[HttpStatus["NOT_ACCEPTABLE"] = 406] = "NOT_ACCEPTABLE";
    HttpStatus[HttpStatus["PROXY_AUTHENTICATION_REQUIRED"] = 407] = "PROXY_AUTHENTICATION_REQUIRED";
    HttpStatus[HttpStatus["REQUEST_TIMEOUT"] = 408] = "REQUEST_TIMEOUT";
    HttpStatus[HttpStatus["CONFLICT"] = 409] = "CONFLICT";
    HttpStatus[HttpStatus["GONE"] = 410] = "GONE";
    HttpStatus[HttpStatus["LENGTH_REQUIRED"] = 411] = "LENGTH_REQUIRED";
    HttpStatus[HttpStatus["PRECONDITION_FAILED"] = 412] = "PRECONDITION_FAILED";
    HttpStatus[HttpStatus["REQUEST_ENTITY_TOO_LARGE"] = 413] = "REQUEST_ENTITY_TOO_LARGE";
    HttpStatus[HttpStatus["REQUEST_URI_TOO_LONG"] = 414] = "REQUEST_URI_TOO_LONG";
    HttpStatus[HttpStatus["UNSUPPORTED_MEDIA_TYPE"] = 415] = "UNSUPPORTED_MEDIA_TYPE";
    HttpStatus[HttpStatus["REQUESTED_RANGE_NOT_SATISFIABLE"] = 416] = "REQUESTED_RANGE_NOT_SATISFIABLE";
    HttpStatus[HttpStatus["EXPECTATION_FAILED"] = 417] = "EXPECTATION_FAILED";
    HttpStatus[HttpStatus["I_AM_A_TEAPOT"] = 418] = "I_AM_A_TEAPOT";
    HttpStatus[HttpStatus["MISDIRECTED_REQUEST"] = 421] = "MISDIRECTED_REQUEST";
    HttpStatus[HttpStatus["UNPROCESSABLE_ENTITY"] = 422] = "UNPROCESSABLE_ENTITY";
    HttpStatus[HttpStatus["LOCKED"] = 423] = "LOCKED";
    HttpStatus[HttpStatus["FAILED_DEPENDENCY"] = 424] = "FAILED_DEPENDENCY";
    HttpStatus[HttpStatus["TOO_EARLY"] = 425] = "TOO_EARLY";
    HttpStatus[HttpStatus["UPGRADE_REQUIRED"] = 426] = "UPGRADE_REQUIRED";
    HttpStatus[HttpStatus["PRECONDITION_REQUIRED"] = 428] = "PRECONDITION_REQUIRED";
    HttpStatus[HttpStatus["TOO_MANY_REQUESTS"] = 429] = "TOO_MANY_REQUESTS";
    HttpStatus[HttpStatus["REQUEST_HEADER_FIELDS_TOO_LARGE"] = 431] = "REQUEST_HEADER_FIELDS_TOO_LARGE";
    HttpStatus[HttpStatus["UNAVAILABLE_FOR_LEGAL_REASONS"] = 451] = "UNAVAILABLE_FOR_LEGAL_REASONS";
    HttpStatus[HttpStatus["INTERNAL_SERVER_ERROR"] = 500] = "INTERNAL_SERVER_ERROR";
    HttpStatus[HttpStatus["NOT_IMPLEMENTED"] = 501] = "NOT_IMPLEMENTED";
    HttpStatus[HttpStatus["BAD_GATEWAY"] = 502] = "BAD_GATEWAY";
    HttpStatus[HttpStatus["SERVICE_UNAVAILABLE"] = 503] = "SERVICE_UNAVAILABLE";
    HttpStatus[HttpStatus["GATEWAY_TIMEOUT"] = 504] = "GATEWAY_TIMEOUT";
    HttpStatus[HttpStatus["VERSION_NOT_SUPPORTED"] = 505] = "VERSION_NOT_SUPPORTED";
    HttpStatus[HttpStatus["VARIANT_ALSO_NEGOTIATES_EXPERIMENTAL"] = 506] = "VARIANT_ALSO_NEGOTIATES_EXPERIMENTAL";
    HttpStatus[HttpStatus["INSUFFICIENT_STORAGE"] = 507] = "INSUFFICIENT_STORAGE";
    HttpStatus[HttpStatus["LOOP_DETECTED"] = 508] = "LOOP_DETECTED";
    HttpStatus[HttpStatus["NOT_EXTENDED"] = 510] = "NOT_EXTENDED";
    HttpStatus[HttpStatus["NETWORK_AUTHENTICATION_REQUIRED"] = 511] = "NETWORK_AUTHENTICATION_REQUIRED";
})(exports.HttpStatus || (exports.HttpStatus = {}));

/* Byteshift Harmony                                                               _         _             __   _ _____
 *    A component-based HTTP server micro-framework                               | |__ _  _| |_ ___  ___ / /  (_) _/ /_
 *                                                                                | '_ \ || |  _/ -_|(_-</ _ \/ / _/ __/
 * (C)2020, Harold Iedema <harold@iedema.me>                                      |_.__/\_, |\__\___/___/_//_/_/_/ \__/
 * See LICENSE for licensing information                                                |__/             H A R M O N Y
 */
class ResponseAwareEvent {
    setResponse(response) {
        this.response = response;
    }
    hasResponse() {
        return this.response instanceof Response;
    }
    getResponse() {
        return this.response;
    }
}

/* Byteshift Harmony                                                               _         _             __   _ _____
 *    A component-based HTTP server micro-framework                               | |__ _  _| |_ ___  ___ / /  (_) _/ /_
 *                                                                                | '_ \ || |  _/ -_|(_-</ _ \/ / _/ __/
 * (C)2020, Harold Iedema <harold@iedema.me>                                      |_.__/\_, |\__\___/___/_//_/_/_/ \__/
 * See LICENSE for licensing information                                                |__/             H A R M O N Y
 */
class ErrorEvent extends ResponseAwareEvent {
    constructor(error, request, controller, methodName) {
        super();
        this.error = error;
        this.request = request;
        this.controller = controller;
        this.methodName = methodName;
    }
}

/* Byteshift Harmony                                                               _         _             __   _ _____
 *    A component-based HTTP server micro-framework                               | |__ _  _| |_ ___  ___ / /  (_) _/ /_
 *                                                                                | '_ \ || |  _/ -_|(_-</ _ \/ / _/ __/
 * (C)2020, Harold Iedema <harold@iedema.me>                                      |_.__/\_, |\__\___/___/_//_/_/_/ \__/
 * See LICENSE for licensing information                                                |__/             H A R M O N Y
 */
class RenderTemplateEvent extends ResponseAwareEvent {
    constructor(options, request, session, templateFile, data) {
        super();
        this.options = options;
        this.request = request;
        this.session = session;
        this.templateFile = templateFile;
        this.data = data;
    }
}

/* Byteshift Harmony                                                               _         _             __   _ _____
 *    A component-based HTTP server micro-framework                               | |__ _  _| |_ ___  ___ / /  (_) _/ /_
 *                                                                                | '_ \ || |  _/ -_|(_-</ _ \/ / _/ __/
 * (C)2020, Harold Iedema <harold@iedema.me>                                      |_.__/\_, |\__\___/___/_//_/_/_/ \__/
 * See LICENSE for licensing information                                                |__/             H A R M O N Y
 */
class RequestEvent extends ResponseAwareEvent {
    constructor(request, route) {
        super();
        this.request = request;
        this.route = route;
    }
}

/* Byteshift Harmony                                                               _         _             __   _ _____
 *    A component-based HTTP server micro-framework                               | |__ _  _| |_ ___  ___ / /  (_) _/ /_
 *                                                                                | '_ \ || |  _/ -_|(_-</ _ \/ / _/ __/
 * (C)2020, Harold Iedema <harold@iedema.me>                                      |_.__/\_, |\__\___/___/_//_/_/_/ \__/
 * See LICENSE for licensing information                                                |__/             H A R M O N Y
 */
class ResponseEvent {
    constructor(request, route, response) {
        this.request = request;
        this.route = route;
        this.response = response;
    }
}

/* Byteshift Harmony                                                               _         _             __   _ _____
 *    A component-based HTTP server micro-framework                               | |__ _  _| |_ ___  ___ / /  (_) _/ /_
 *                                                                                | '_ \ || |  _/ -_|(_-</ _ \/ / _/ __/
 * (C)2020, Harold Iedema <harold@iedema.me>                                      |_.__/\_, |\__\___/___/_//_/_/_/ \__/
 * See LICENSE for licensing information                                                |__/             H A R M O N Y
 */
class StaticRequestEvent extends ResponseAwareEvent {
    constructor(request, fileName, mimeType) {
        super();
        this.request = request;
        this.fileName = fileName;
        this.mimeType = mimeType;
    }
}

/* Byteshift Harmony                                                               _         _             __   _ _____
 *    A component-based HTTP server micro-framework                               | |__ _  _| |_ ___  ___ / /  (_) _/ /_
 *                                                                                | '_ \ || |  _/ -_|(_-</ _ \/ / _/ __/
 * (C)2020, Harold Iedema <harold@iedema.me>                                      |_.__/\_, |\__\___/___/_//_/_/_/ \__/
 * See LICENSE for licensing information                                                |__/             H A R M O N Y
 */
class StaticResponseEvent {
    constructor(request, response, fileName, mimeType) {
        this.request = request;
        this.response = response;
        this.fileName = fileName;
        this.mimeType = mimeType;
    }
}

/* Byteshift Harmony                                                               _         _             __   _ _____
 *    A component-based HTTP server micro-framework                               | |__ _  _| |_ ___  ___ / /  (_) _/ /_
 *                                                                                | '_ \ || |  _/ -_|(_-</ _ \/ / _/ __/
 * (C)2020, Harold Iedema <harold@iedema.me>                                      |_.__/\_, |\__\___/___/_//_/_/_/ \__/
 * See LICENSE for licensing information                                                |__/             H A R M O N Y
 */
const optionalParam = /\((.*?)\)/g;
const namedParam = /(\(\?)?:\w+/g;
// eslint-disable-next-line no-useless-escape
const escapeRegExp = /[\-{}\[\]+?.,\\^$|#\s]/g;
const splatParam = /\*/g;
class Request {
    constructor(r) {
        this.r = r;
        // const u = url.parse(r.url, true, true);
        const u = new URL(r.url, 'http://localhost/');
        const q = {};
        u.searchParams.forEach((v, k) => q[k] = v);
        this._clientIp = r.socket.remoteAddress;
        this._method = r.method.toUpperCase();
        this._path = u.pathname;
        this._headers = new Bag(r.headers);
        this._cookies = new Bag(r.headers.cookie ? this._parseCookies(r.headers.cookie) : {});
        this._query = new Bag(q);
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
    get(name) {
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
    get clientIp() {
        return this._clientIp;
    }
    /**
     * Returns the request path.
     *
     * @return {string}
     */
    get path() {
        return this._path;
    }
    /**
     * Returns the HTTP method in upper-case string representation.
     *
     * @return {string}
     */
    get method() {
        return this._method;
    }
    /**
     * Returns the cookie bag.
     *
     * @return {Bag}
     */
    get cookies() {
        return this._cookies;
    }
    /**
     * Returns the headers bag.
     *
     * @return {Bag}
     */
    get headers() {
        return this._headers;
    }
    /**
     * Returns the query parameters bag.
     *
     * @return {Bag}
     */
    get query() {
        return this._query;
    }
    /**
     * Returns the route parameters bag.
     *
     * @returns {Bag<string>}
     */
    get parameters() {
        return this._parameters;
    }
    /**
     * Returns true if the given route matches this request.
     *
     * @param {IRoute} route
     * @return {boolean}
     */
    isMatchingRoute(route) {
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
        result = result.slice(1, -1);
        // Store the params in the parameter bag.
        result.reduce((obj, val, index) => {
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
    _parsePattern(pattern) {
        let names = [];
        pattern = pattern
            .replace(escapeRegExp, '\\$&')
            .replace(optionalParam, '(?:$1)?')
            .replace(namedParam, function (match, optional) {
            names.push(match.slice(1));
            return optional ? match : '([^/?]+)';
        })
            .replace(splatParam, function () {
            names.push('path');
            return '([^?]*?)';
        });
        return {
            regExp: new RegExp('^' + pattern + '(?:\\?([\\s\\S]*))?$'),
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
    _parseCookies(cookieString) {
        if (typeof cookieString !== 'string') {
            return {};
        }
        const obj = {}, pairs = cookieString.split(/; */);
        for (let i = 0; i < pairs.length; i++) {
            let pair = pairs[i], parts = pair.indexOf('=');
            if (parts < 1) {
                continue;
            }
            let key = pair.substr(0, parts).trim(), val = pair.substr(++parts, pair.length).trim();
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

/* Byteshift Harmony                                                               _         _             __   _ _____
 *    A component-based HTTP server micro-framework                               | |__ _  _| |_ ___  ___ / /  (_) _/ /_
 *                                                                                | '_ \ || |  _/ -_|(_-</ _ \/ / _/ __/
 * (C)2020, Harold Iedema <harold@iedema.me>                                      |_.__/\_, |\__\___/___/_//_/_/_/ \__/
 * See LICENSE for licensing information                                                |__/             H A R M O N Y
 */
class HtmlResponse extends Response {
    constructor(html, statusCode = exports.HttpStatus.OK, pretty = true) {
        super(html, statusCode, 'text/html');
    }
}

/* Byteshift Harmony                                                               _         _             __   _ _____
 *    A component-based HTTP server micro-framework                               | |__ _  _| |_ ___  ___ / /  (_) _/ /_
 *                                                                                | '_ \ || |  _/ -_|(_-</ _ \/ / _/ __/
 * (C)2020, Harold Iedema <harold@iedema.me>                                      |_.__/\_, |\__\___/___/_//_/_/_/ \__/
 * See LICENSE for licensing information                                                |__/             H A R M O N Y
 */
class JsonResponse extends Response {
    constructor(data, statusCode = exports.HttpStatus.OK, pretty = true) {
        const json = pretty ? JSON.stringify(data, null, 4) : JSON.stringify(data);
        super(json, statusCode, 'application/json');
    }
}

/* Byteshift Harmony                                                               _         _             __   _ _____
 *    A component-based HTTP server micro-framework                               | |__ _  _| |_ ___  ___ / /  (_) _/ /_
 *                                                                                | '_ \ || |  _/ -_|(_-</ _ \/ / _/ __/
 * (C)2020, Harold Iedema <harold@iedema.me>                                      |_.__/\_, |\__\___/___/_//_/_/_/ \__/
 * See LICENSE for licensing information                                                |__/             H A R M O N Y
 */
function Route(path, options) {
    options = options || {};
    return function (target, methodName, descriptor) {
        if (typeof target.__ROUTES__ === 'undefined') {
            target.__ROUTES__ = {};
        }
        if (typeof target.__ROUTES__[methodName] === 'undefined') {
            target.__ROUTES__[methodName] = [];
        }
        // Extract method signature.
        const methodArgs = [];
        const paramTypes = Reflect.getMetadata('design:paramtypes', target, methodName);
        const paramRegEx = /^(\w+)\(([A-Za-z0-9_,\s]+)\)/i.exec(target[methodName].toString());
        const paramNames = (paramRegEx && paramRegEx[2]) ? paramRegEx[2].split(',').map(n => n.trim()) : [];
        if (paramNames) {
            for (let i = 0; i < paramNames.length; i++) {
                methodArgs.push({
                    name: paramNames[i],
                    type: paramTypes[i],
                });
            }
        }
        target.__ROUTES__[methodName].push({
            path: path,
            method: options.method || 'GET',
            signature: methodArgs,
        });
    };
}

/* Byteshift Harmony                                                               _         _             __   _ _____
 *    A component-based HTTP server micro-framework                               | |__ _  _| |_ ___  ___ / /  (_) _/ /_
 *                                                                                | '_ \ || |  _/ -_|(_-</ _ \/ / _/ __/
 * (C)2020, Harold Iedema <harold@iedema.me>                                      |_.__/\_, |\__\___/___/_//_/_/_/ \__/
 * See LICENSE for licensing information                                                |__/             H A R M O N Y
 */
class Router {
    constructor() {
        this.routes = [];
    }
    /**
     * Registers the given controller.
     */
    registerController(controller) {
        if (typeof controller.prototype.__ROUTES__ === 'undefined') {
            console.warn('Given controller has no registered routes.');
            return;
        }
        Object.keys(controller.prototype.__ROUTES__).forEach((methodName) => {
            const routeList = controller.prototype.__ROUTES__[methodName];
            routeList.forEach((route) => {
                const m = Array.isArray(route.method) ? route.method : [route.method];
                m.forEach((method) => {
                    this.routes.push({
                        path: route.path,
                        method: method,
                        signature: route.signature,
                        _controller: [controller, methodName],
                    });
                });
            });
        });
    }
    /**
     * Returns a controller method by the given path, or undefined if it does not exist.
     *
     * @param {Request} request
     */
    findByRequest(request) {
        const route = this.routes.find((route) => request.isMatchingRoute(route));
        if (!route) {
            return undefined;
        }
        return route;
    }
}

/* Byteshift Harmony                                                               _         _             __   _ _____
 *    A component-based HTTP server micro-framework                               | |__ _  _| |_ ___  ___ / /  (_) _/ /_
 *                                                                                | '_ \ || |  _/ -_|(_-</ _ \/ / _/ __/
 * (C)2020, Harold Iedema <harold@iedema.me>                                      |_.__/\_, |\__\___/___/_//_/_/_/ \__/
 * See LICENSE for licensing information                                                |__/             H A R M O N Y
 */
class ServerError extends Error {
    constructor(title, message, statusCode) {
        super(message);
        this.title = title;
        this.message = message;
        this.statusCode = statusCode;
    }
}

/* Byteshift Harmony                                                               _         _             __   _ _____
 *    A component-based HTTP server micro-framework                               | |__ _  _| |_ ___  ___ / /  (_) _/ /_
 *                                                                                | '_ \ || |  _/ -_|(_-</ _ \/ / _/ __/
 * (C)2020, Harold Iedema <harold@iedema.me>                                      |_.__/\_, |\__\___/___/_//_/_/_/ \__/
 * See LICENSE for licensing information                                                |__/             H A R M O N Y
 */
class InternalServerError extends ServerError {
    constructor(message = 'An internal server error occurred.') {
        super('Internal Server Error', message, exports.HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

/* Byteshift Harmony                                                               _         _             __   _ _____
 *    A component-based HTTP server micro-framework                               | |__ _  _| |_ ___  ___ / /  (_) _/ /_
 *                                                                                | '_ \ || |  _/ -_|(_-</ _ \/ / _/ __/
 * (C)2020, Harold Iedema <harold@iedema.me>                                      |_.__/\_, |\__\___/___/_//_/_/_/ \__/
 * See LICENSE for licensing information                                                |__/             H A R M O N Y
 */
class NotFoundError extends ServerError {
    constructor(message = 'The requested resource could not be found.') {
        super('Not Found', message, exports.HttpStatus.NOT_FOUND);
    }
}

var template = "<!DOCTYPE html>\n<html>\n<head>\n    <title>Error</title>\n    <meta charset=\"UTF-8\">\n    <style type=\"text/css\">\n    body, html {\n        font-family: Arial, sans-serif;\n        font-size: 14px;\n        color: #272727;\n        background: #eee;\n        display: flex;\n        flex-direction: column;\n        justify-content: center;\n        align-items: center;\n        width: 100%;\n        height: 100%;\n        padding: 0;\n        margin: 0;\n    }\n\n    * { box-sizing: border-box; }\n\n    main {\n        width: 800px;\n        border: 1px solid #dadade;\n        border-radius: 6px;\n        background: #fff;\n        box-shadow: rgba(50, 50, 93, 0.25) 0 13px 27px -5px, rgba(0, 0, 0, 0.3) 0 8px 16px -8px;\n        overflow: hidden;\n    }\n\n    img {\n        margin-bottom: 10px;\n    }\n\n    header {\n        display: flex;\n        flex-direction: column;\n        align-items: flex-start;\n        justify-content: flex-start;\n        background: #444;\n        color: #fff;\n    }\n\n    header > .title {\n        width: 100%;\n        font-family: \"Arial\", sans-serif;\n        font-weight: lighter;\n        font-size: 48px;\n        padding: 10px;\n        text-align: center;\n    }\n    footer {\n        padding: 5px;\n        width: 100%;\n        background: #eee;\n        color: #777;\n        font-weight: lighter;\n        font-size: 14px;\n        text-align: center;\n    }\n    section {\n        padding: 20px;\n        text-align: center;\n        font-size: 16px;\n    }\n\n    section > pre {\n        padding: 20px;\n        background: #333;\n        color: #eee;\n        text-align: left;\n        width: 100%;\n        white-space: pre-wrap;\n        font-size: 13px;\n    }\n    </style>\n</head>\n<body>\n<img id=\"logo\" src=\"data:image/png;base64,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\" alt=\"\">\n<main>\n    <header>\n        <div class=\"title\">Something went wrong</div>\n    </header>\n    <section>\n        {{ message }}\n        <pre>{{ trace }}</pre>\n    </section>\n    <footer>\n        {{ title }}\n    </footer>\n</main>\n</body>\n</html>\n";

/* Byteshift Harmony                                                               _         _             __   _ _____
 *    A component-based HTTP server micro-framework                               | |__ _  _| |_ ___  ___ / /  (_) _/ /_
 *                                                                                | '_ \ || |  _/ -_|(_-</ _ \/ / _/ __/
 * (C)2020, Harold Iedema <harold@iedema.me>                                      |_.__/\_, |\__\___/___/_//_/_/_/ \__/
 * See LICENSE for licensing information                                                |__/             H A R M O N Y
 */
class HarmonyErrorPage {
    /**
     * @param {ErrorEvent} event
     * @returns {boolean | void}
     */
    onServerError(event) {
        let html = template;
        let title = event.error.title || event.error.constructor.name;
        if (event.error.statusCode) {
            title = '<span> ' + event.error.statusCode + '</span> - ' + title;
        }
        html = html.replace('{{ title }}', title);
        html = html.replace('{{ message }}', event.error.message);
        html = html.replace('{{ trace }}', event.error.stack);
        event.setResponse(new HtmlResponse(html, exports.HttpStatus.NOT_FOUND));
    }
}

/* Byteshift Harmony                                                               _         _             __   _ _____
 *    A component-based HTTP server micro-framework                               | |__ _  _| |_ ___  ___ / /  (_) _/ /_
 *                                                                                | '_ \ || |  _/ -_|(_-</ _ \/ / _/ __/
 * (C)2020, Harold Iedema <harold@iedema.me>                                      |_.__/\_, |\__\___/___/_//_/_/_/ \__/
 * See LICENSE for licensing information                                                |__/             H A R M O N Y
 */
class InMemoryStorage {
    constructor() {
        this.storage = new Map();
    }
    /**
     * @inheritDoc
     */
    delete(name) {
        this.storage.delete(name);
    }
    /**
     * @inheritDoc
     */
    gc() {
        const now = new Date().getTime(), toPurge = [];
        this.storage.forEach((item, name) => {
            if (now > item.ttl) {
                toPurge.push(name);
            }
        });
        toPurge.forEach((name) => this.storage.delete(name));
    }
    /**
     * @inheritDoc
     */
    get(name) {
        return this.storage.has(name) ? this.storage.get(name).data : undefined;
    }
    /**
     * @inheritDoc
     */
    set(name, value) {
        // Store session data for 24h.
        this.storage.set(name, { data: value, ttl: (new Date()).getTime() + (86400 * 1000) });
    }
}

/* Byteshift Harmony                                                               _         _             __   _ _____
 *    A component-based HTTP server micro-framework                               | |__ _  _| |_ ___  ___ / /  (_) _/ /_
 *                                                                                | '_ \ || |  _/ -_|(_-</ _ \/ / _/ __/
 * (C)2020, Harold Iedema <harold@iedema.me>                                      |_.__/\_, |\__\___/___/_//_/_/_/ \__/
 * See LICENSE for licensing information                                                |__/             H A R M O N Y
 */
class Session {
    constructor(sessionData) {
        try {
            this.data = JSON.parse(sessionData) || {};
        }
        catch (e) {
            this.data = {};
        }
    }
    /**
     * Returns true if a stored item with the given key exists in the session.
     *
     * @param {string} key
     * @returns {boolean}
     */
    has(key) {
        return typeof this.data[key] !== 'undefined';
    }
    /**
     * Retrieves a value associated with the given key from the session.
     *
     * @param {string} key
     * @param {any}    defaultValue
     * @returns {any}
     */
    get(key, defaultValue = undefined) {
        return this.has(key) ? this.data[key] : defaultValue;
    }
    /**
     * Stores the given value by the specified key in the session.
     *
     * @param {string} key
     * @param {any}    value
     */
    set(key, value) {
        this.data[key] = value;
    }
    /**
     * Deletes a stored item from the session with the given key.
     *
     * @param {string} key
     */
    delete(key) {
        delete this.data[key];
    }
    /**
     * Returns a JSON-string representation of the data in this session.
     *
     * @returns {string}
     */
    toString() {
        return JSON.stringify(this.data);
    }
}

/* Byteshift Harmony                                                               _         _             __   _ _____
 *    A component-based HTTP server micro-framework                               | |__ _  _| |_ ___  ___ / /  (_) _/ /_
 *                                                                                | '_ \ || |  _/ -_|(_-</ _ \/ / _/ __/
 * (C)2020, Harold Iedema <harold@iedema.me>                                      |_.__/\_, |\__\___/___/_//_/_/_/ \__/
 * See LICENSE for licensing information                                                |__/             H A R M O N Y
 */
/**
 * Creates or restores and saves user session data during request and
 * response events.
 */
class SessionManager {
    constructor(sessionStorage, cookieName) {
        this.sessionStorage = sessionStorage;
        this.cookieName = cookieName;
        this.sessionData = new Map();
    }
    /**
     * Invoked when a request was received from the browser.
     *
     * @param {RequestEvent} event
     */
    onRequest(event) {
        const _id = event.request.cookies.get(this.cookieName);
        this.sessionData.set(event.request, new Session(_id ? this.sessionStorage.get(_id) : '{}'));
    }
    /**
     * Invoked right before the response is sent back to the browser.
     *
     * @param {ResponseEvent} event
     */
    onResponse(event) {
        const sessionId = event.request.cookies.get(this.cookieName) || this.generateSessionId();
        this.sessionStorage.set(sessionId, this.sessionData.get(event.request).toString());
        event.response.cookies.set(this.cookieName, sessionId, 0);
    }
    /**
     * Returns a Session instance by the given request.
     *
     * @param {Request} request
     * @returns {Session | undefined}
     */
    getSessionByRequest(request) {
        return this.sessionData.get(request);
    }
    /**
     * Returns a random session id.
     *
     * @returns {string}
     * @private
     */
    generateSessionId() {
        return [...Array(64)].map(_ => (~~(Math.random() * 36)).toString(36)).join('');
    }
}

/* Byteshift Harmony                                                               _         _             __   _ _____
 *    A component-based HTTP server micro-framework                               | |__ _  _| |_ ___  ___ / /  (_) _/ /_
 *                                                                                | '_ \ || |  _/ -_|(_-</ _ \/ / _/ __/
 * (C)2020, Harold Iedema <harold@iedema.me>                                      |_.__/\_, |\__\___/___/_//_/_/_/ \__/
 * See LICENSE for licensing information                                                |__/             H A R M O N Y
 */
class StaticAssetHandler {
    constructor(directories, lookupMimeType) {
        this.directories = directories;
        this.requestEventListeners = [];
        this.responseEventListeners = [];
        this.defaultMimeTypes = {
            txt: 'text/plain',
            html: 'text/html',
            js: 'text/javascript',
            css: 'text/css',
            gif: 'image/gif',
            png: 'image/png',
            svg: 'image/svg',
            json: 'application/json',
        };
        if (!lookupMimeType) {
            lookupMimeType = (fileExtension) => {
                return this.defaultMimeTypes[fileExtension] || 'application/octet-stream';
            };
        }
        this.lookupMimeType = lookupMimeType;
    }
    /**
     * Registers a static request event listener.
     *
     * @param {StaticRequestEventListener} listener
     */
    registerStaticRequestEventListener(listener) {
        this.requestEventListeners.push(listener);
        this.requestEventListeners = this.requestEventListeners.sort((a, b) => a.priority > b.priority ? -1 : 1);
    }
    /**
     * Registers a static response event listener.
     *
     * @param {StaticResponseEventListener} listener
     */
    registerStaticResponseEventListener(listener) {
        this.responseEventListeners.push(listener);
        this.responseEventListeners = this.responseEventListeners.sort((a, b) => a.priority > b.priority ? -1 : 1);
    }
    /**
     * Serves static assets based on the request path.
     *
     * This method is invoked when an error occurs. We'll listen to a
     * NotFoundError in particular, since this error is thrown when a request
     * was made but no matching route could be found. In this case we'll try
     * to lookup a file that matches the request path and serve its contents
     * if we found one.
     *
     * @param {ErrorEvent} event
     */
    async onErrorEvent(event) {
        // Abort if this isn't a Not found error.
        if (!(event.error instanceof NotFoundError)) {
            return;
        }
        const fileName = this.lookup(event.request.path);
        // Abort if the file does not exist.
        if (!fileName) {
            return;
        }
        const mimeType = await this.lookupMimeType(path__default['default'].extname(fileName).replace(/^\./, '').toLowerCase());
        // Run static request event listeners.
        const requestEvent = new StaticRequestEvent(event.request, fileName, mimeType);
        let cancelLoop = false;
        for (let listener of this.requestEventListeners) {
            cancelLoop = false === await listener.callback(requestEvent);
            if (requestEvent.hasResponse() && !event.hasResponse()) {
                event.setResponse(requestEvent.getResponse());
            }
            if (cancelLoop) {
                break;
            }
        }
        // Build the response based on the file contents & mime-type.
        const response = new Response(fs__default['default'].readFileSync(fileName), exports.HttpStatus.OK, mimeType);
        // Run static response event listeners.
        const responseEvent = new StaticResponseEvent(event.request, response, fileName, mimeType);
        cancelLoop = false;
        for (let listener of this.responseEventListeners) {
            cancelLoop = false === await listener.callback(responseEvent);
            if (requestEvent.hasResponse() && !event.hasResponse()) {
                event.setResponse(requestEvent.getResponse());
            }
            if (cancelLoop) {
                break;
            }
        }
        // If we still don't have a response yet coming from attached event
        // listeners, we'll set the original one based on the file itself.
        if (!event.hasResponse()) {
            event.setResponse(response);
        }
    }
    /**
     * Looks up the absolute path of a file that matches the given name,
     * or undefined if no file could be found.
     *
     * @param {string} name
     * @returns {string | undefined}
     * @private
     */
    lookup(name) {
        for (let directory of this.directories) {
            let fileName = path__default['default'].resolve(directory, name.replace(/^\//, ''));
            // Security measurement: Ensure the resolved file name is contained
            // within a public directory, and not above it. If a user tries to
            // fetch a file from a parent directory, we'll just pretend it
            // doesn't exist.
            if (false === fileName.toLowerCase().startsWith(directory.toLowerCase())) {
                continue;
            }
            if (fs__default['default'].existsSync(fileName) && !fs__default['default'].statSync(fileName).isDirectory()) {
                return fileName;
            }
        }
        return undefined;
    }
}

/* Byteshift Harmony                                                               _         _             __   _ _____
 *    A component-based HTTP server micro-framework                               | |__ _  _| |_ ___  ___ / /  (_) _/ /_
 *                                                                                | '_ \ || |  _/ -_|(_-</ _ \/ / _/ __/
 * (C)2020, Harold Iedema <harold@iedema.me>                                      |_.__/\_, |\__\___/___/_//_/_/_/ \__/
 * See LICENSE for licensing information                                                |__/             H A R M O N Y
 */
class TemplateManager {
    constructor(templateDirectories) {
        this.templateDirectories = templateDirectories;
        this.renderEventListeners = [];
    }
    /**
     * Registers a template render event listener.
     *
     * This callback is invoked after a controller method has been executed and
     * returned an object with data to be passed to a template. The callback is
     * responsible for rendering the template based on the given file name and
     * optional data object.
     *
     * If the callback returns void, the next listener in the list will be
     * executed. If the callback returns a string, that string is used as
     * response and no further render event listeners will be executed.
     *
     * @param listener
     */
    registerRenderEventListener(listener) {
        this.renderEventListeners.push(listener);
        this.renderEventListeners = this.renderEventListeners.sort((a, b) => a.priority > b.priority ? -1 : 1);
    }
    /**
     * Finds the actual template file by the given name and invokes the
     * registered render template event listeners.
     */
    async render(request, session, template, data) {
        data = data || {};
        const fileName = this.findTemplateFile(template.name);
        if (!fileName) {
            throw new NotFoundError('The template "' + template.name + '" could not be found. Looked in "' + this.templateDirectories.join('", "') + '".');
        }
        const event = new RenderTemplateEvent(template.options, request, session, fileName, data);
        for (let listener of this.renderEventListeners) {
            await listener.callback(event);
            if (event.hasResponse()) {
                return event.getResponse();
            }
        }
        throw new InternalServerError('No available template renderer is able to render "' + template.name + '".');
    }
    /**
     * Returns the absolute path to the template file with the given name.
     *
     * @param {string} name
     * @returns {string | undefined}
     * @private
     */
    findTemplateFile(name) {
        for (let directory of this.templateDirectories) {
            const fileName = path__default['default'].resolve(directory, name);
            if (fs.existsSync(fileName)) {
                return fileName;
            }
        }
        return undefined;
    }
}

/* Byteshift Harmony                                                               _         _             __   _ _____
 *    A component-based HTTP server micro-framework                               | |__ _  _| |_ ___  ___ / /  (_) _/ /_
 *                                                                                | '_ \ || |  _/ -_|(_-</ _ \/ / _/ __/
 * (C)2020, Harold Iedema <harold@iedema.me>                                      |_.__/\_, |\__\___/___/_//_/_/_/ \__/
 * See LICENSE for licensing information                                                |__/             H A R M O N Y
 */
class Harmony {
    constructor(options) {
        this.options = options;
        this.errorEventListeners = [];
        this.requestEventListeners = [];
        this.responseEventListeners = [];
        this.router = new Router();
        this.server = options.enableHttps
            ? https__default['default'].createServer(options.httpsOptions, this.handle.bind(this))
            : http__default['default'].createServer(this.handle.bind(this));
        // Register default error page handler with the lowest priority.
        this.registerErrorEventListener((new HarmonyErrorPage()).onServerError, -Infinity);
        // Register controllers.
        if (options.controllers) {
            options.controllers.forEach((controllerClass) => this.registerController(controllerClass));
        }
        // Register event listeners.
        if (options.errorEventListeners) {
            options.errorEventListeners.forEach(e => this.registerErrorEventListener(e.callback, e.priority));
        }
        if (options.requestEventListeners) {
            options.requestEventListeners.forEach(e => this.registerRequestEventListener(e.callback, e.priority));
        }
        if (options.responseEventListeners) {
            options.responseEventListeners.forEach(e => this.registerResponseEventListener(e.callback, e.priority));
        }
        // Session management.
        if (options.enableSession) {
            options.session = options.session || {};
            this.sessionManager = new SessionManager(options.session.storage || new InMemoryStorage(), options.session.cookieName || 'HARMONY_SID');
            // Make sure the request event listener is executed first, to allow
            // other event listeners to access session data if necessary.
            this.registerRequestEventListener((e => this.sessionManager.onRequest(e)), Infinity);
            // Let the response event listener run last to allow other event
            // listeners to modify the session data if necessary.
            this.registerResponseEventListener((e => this.sessionManager.onResponse(e)), -Infinity);
        }
        // Handle static assets.
        options.static = options.static || {};
        if (options.static.publicDirectories && options.static.publicDirectories.length > 0) {
            this.staticAssetHandler = new StaticAssetHandler(options.static.publicDirectories, options.static.lookupMimeType);
            // The static asset handler hooks to caught "NotFoundError" errors.
            // To ensure no other listener falsely intercepts this as an actual
            // error, we'll give the static asset handler the highest priority.
            this.registerErrorEventListener(e => this.staticAssetHandler.onErrorEvent(e), Infinity);
            // Register event handlers for static resources.
            if (Array.isArray(options.static.staticRequestEventListeners) && options.static.staticRequestEventListeners.length > 0) {
                options.static.staticRequestEventListeners.forEach((listener) => {
                    this.staticAssetHandler.registerStaticRequestEventListener(listener);
                });
            }
            if (Array.isArray(options.static.staticResponseEventListeners) && options.static.staticResponseEventListeners.length > 0) {
                options.static.staticResponseEventListeners.forEach((listener) => {
                    this.staticAssetHandler.registerStaticResponseEventListener(listener);
                });
            }
        }
        // Handle methods annotated with the @Template decorator.
        if (options.templating && options.templating.templateDirectories) {
            this.templateManager = new TemplateManager(options.templating.templateDirectories);
            if (Array.isArray(options.templating.renderEventListeners) && options.templating.renderEventListeners.length > 0) {
                options.templating.renderEventListeners.forEach((listener) => {
                    this.templateManager.registerRenderEventListener(listener);
                });
            }
        }
    }
    /**
     * Starts the HTTP server.
     */
    start() {
        this.server.listen(this.options.port || 8000);
    }
    /**
     * Embeds the given plugin in this Harmony server instance.
     *
     * @param {IHarmonyPlugin} plugin
     */
    use(plugin) {
        plugin.install(this);
    }
    /**
     * Registers a Controller class.
     *
     * The given class must contain at least one @Route annotation on a method
     * that defines a route.
     *
     * @param controller
     */
    registerController(controller) {
        this.router.registerController(controller);
    }
    /**
     * Registers an error event listener.
     */
    registerErrorEventListener(callback, priority = 0) {
        this.errorEventListeners.push({ callback: callback, priority: priority });
        this.errorEventListeners = this.errorEventListeners.sort((a, b) => a.priority > b.priority ? -1 : 1);
    }
    /**
     * Registers a request event listener.
     */
    registerRequestEventListener(callback, priority = 0) {
        this.requestEventListeners.push({ callback: callback, priority: priority });
        this.requestEventListeners = this.requestEventListeners.sort((a, b) => a.priority > b.priority ? -1 : 1);
    }
    /**
     * Registers a response event listener.
     */
    registerResponseEventListener(callback, priority = 0) {
        this.responseEventListeners.push({ callback: callback, priority: priority });
        this.responseEventListeners = this.responseEventListeners.sort((a, b) => a.priority > b.priority ? -1 : 1);
    }
    /**
     * Registers a static request event listener.
     */
    registerStaticRequestEventListener(callback, priority = 0) {
        if (typeof this.staticAssetHandler === 'undefined') {
            throw new Error('Unable to register a static request event listener because static resource handling is disabled. Please ensure at least one public directory is configured.');
        }
        this.staticAssetHandler.registerStaticRequestEventListener({ callback, priority });
    }
    /**
     * Registers a static response event listener.
     */
    registerStaticResponseEventListener(callback, priority = 0) {
        if (typeof this.staticAssetHandler === 'undefined') {
            throw new Error('Unable to register a static response event listener because static resource handling is disabled. Please ensure at least one public directory is configured.');
        }
        this.staticAssetHandler.registerStaticResponseEventListener({ callback, priority });
    }
    /**
     * Registers a render template event listener.
     */
    registerRenderTemplateListener(callback, priority = 0) {
        if (typeof this.templateManager === 'undefined') {
            throw new Error('Unable to register a render template event listener because templating is currently disabled. Please ensure that at least one template directory is configured.');
        }
        this.templateManager.registerRenderEventListener({ callback, priority });
    }
    /**
     * Handles an incoming HTTP request.
     *
     * @param {http.IncomingMessage} req
     * @param {http.ServerResponse} res
     */
    async handle(req, res) {
        const request = new Request(req), route = this.router.findByRequest(request);
        let controller;
        try {
            if (!route) {
                throw new NotFoundError();
            }
            controller = this.options.serviceContainer
                ? this.options.serviceContainer.get(route._controller[0])
                : new route._controller[0]();
            if (typeof controller[route._controller[1]] !== 'function') {
                throw new InternalServerError('Method "' + route._controller[1] + '" is not an accessible method in this controller.');
            }
            // Fire the 'request' event to allow external services to listen
            // for incoming requests before the controller method is fired.
            // This would allow firewall type of functionality to exist, or
            // generic services that serve static content.
            const requestEvent = new RequestEvent(request, route);
            let stopPropagation = false, response;
            for (let listener of this.requestEventListeners) {
                stopPropagation = false === await listener.callback(requestEvent);
                if (!response && requestEvent.hasResponse() && !requestEvent.getResponse().isSent) {
                    response = requestEvent.getResponse();
                }
                if (stopPropagation) {
                    break;
                }
            }
            // Only handle the controller action if a request listener did not
            // send a response yet.
            if (!response) {
                // Handle the actual controller method.
                response = await this.handleControllerAction(controller, route._controller[1], route, request);
                // A controller method must return a Response object, unless it
                // is annotated with the @Template decorator.
                if (!(response instanceof Response)) {
                    if (controller.__TEMPLATES__ && controller.__TEMPLATES__[route._controller[1]]) {
                        const session = this.sessionManager ? this.sessionManager.getSessionByRequest(request) : undefined;
                        response = await this.templateManager.render(request, session, controller.__TEMPLATES__[route._controller[1]], response);
                    }
                    // Do we have a response now?
                    if (!(response instanceof Response)) {
                        throw new InternalServerError('Method "' + route._controller[1] + '" did not return a Response object.');
                    }
                }
            }
            // Fire the 'response' event to allow external services to modify
            // the returned response. For example, setting specific cookies or
            // other headers.
            const responseEvent = new ResponseEvent(request, route, response);
            for (let listener of this.responseEventListeners) {
                if (false === listener.callback(responseEvent)) {
                    break;
                }
            }
            if (!response.isSent) {
                response.send(res);
            }
        }
        catch (e) {
            // Fire the 'error' event to allow external services to listen act
            // on certain types of errors, for example rendering a custom 404
            // or 500 page.
            const errorEvent = new ErrorEvent(e, request, controller, route ? route._controller[1] : undefined);
            let hasSentResponse = false;
            for (let listener of this.errorEventListeners) {
                const stopPropagation = false === await listener.callback(errorEvent);
                // Send the response if the listener defined one and if we
                // haven't already sent one to the client.
                if (false === hasSentResponse && errorEvent.hasResponse()) {
                    const response = errorEvent.getResponse();
                    if (false === response.isSent) {
                        response.send(res);
                        hasSentResponse = true;
                    }
                }
                // Stop propagating if the listener returned false explicitly.
                if (stopPropagation) {
                    return;
                }
            }
        }
    }
    /**
     * Handles the controller method.
     *
     * @param controller
     * @param {string} method
     * @param {IRoute} route
     * @param {Request} request
     * @returns {Promise<Response>}
     * @private
     */
    async handleControllerAction(controller, method, route, request) {
        const fn = controller[method];
        const args = [];
        const params = Object.values(request.parameters.all);
        for (let i = 0; i < route.signature.length; i++) {
            const methodArg = route.signature[i];
            if (methodArg.type === Request) {
                args.push(request);
                params.unshift(null);
            }
            else if (methodArg.type === Session) {
                if (!this.sessionManager) {
                    throw new InternalServerError('Controller attempted to access Session, but sessions are disabled.');
                }
                args.push(this.sessionManager.getSessionByRequest(request));
                params.unshift(null);
            }
            else {
                args.push(params[i]);
            }
        }
        return await fn(...args);
    }
}

/* Byteshift Harmony                                                               _         _             __   _ _____
 *    A component-based HTTP server micro-framework                               | |__ _  _| |_ ___  ___ / /  (_) _/ /_
 *                                                                                | '_ \ || |  _/ -_|(_-</ _ \/ / _/ __/
 * (C)2020, Harold Iedema <harold@iedema.me>                                      |_.__/\_, |\__\___/___/_//_/_/_/ \__/
 * See LICENSE for licensing information                                                |__/             H A R M O N Y
 */
function Template(name, options) {
    options = options || {};
    return function (target, methodName, descriptor) {
        if (typeof target.__TEMPLATES__ === 'undefined') {
            const __TEMPLATES__ = {};
            Object.defineProperty(target, '__TEMPLATES__', {
                configurable: false,
                enumerable: false,
                get() {
                    return __TEMPLATES__;
                }
            });
        }
        if (typeof target.__TEMPLATES__[methodName] !== 'undefined') {
            throw new Error('Multiple @Template annotations found for method "' + methodName + '".');
        }
        target.__TEMPLATES__[methodName] = { name, options };
    };
}

exports.Bag = Bag;
exports.Cookie = Cookie;
exports.CookieBag = CookieBag;
exports.ErrorEvent = ErrorEvent;
exports.Harmony = Harmony;
exports.HtmlResponse = HtmlResponse;
exports.JsonResponse = JsonResponse;
exports.RenderTemplateEvent = RenderTemplateEvent;
exports.Request = Request;
exports.RequestEvent = RequestEvent;
exports.Response = Response;
exports.ResponseEvent = ResponseEvent;
exports.Route = Route;
exports.Router = Router;
exports.Session = Session;
exports.StaticRequestEvent = StaticRequestEvent;
exports.StaticResponseEvent = StaticResponseEvent;
exports.Template = Template;
//# sourceMappingURL=index.js.map
