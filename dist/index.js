'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var zlib = require('zlib');
var tls = require('tls');
require('reflect-metadata');
var https = require('https');
var querystring = require('querystring');
var http = require('http');
var http2 = require('http2');
var fs = require('fs');
var path = require('path');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

function _interopNamespace(e) {
    if (e && e.__esModule) return e;
    var n = Object.create(null);
    if (e) {
        Object.keys(e).forEach(function (k) {
            if (k !== 'default') {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () { return e[k]; }
                });
            }
        });
    }
    n["default"] = e;
    return Object.freeze(n);
}

var zlib__namespace = /*#__PURE__*/_interopNamespace(zlib);
var https__default = /*#__PURE__*/_interopDefaultLegacy(https);
var querystring__namespace = /*#__PURE__*/_interopNamespace(querystring);
var http__default = /*#__PURE__*/_interopDefaultLegacy(http);
var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);
var fs__namespace = /*#__PURE__*/_interopNamespace(fs);
var path__default = /*#__PURE__*/_interopDefaultLegacy(path);

/* Byteshift Harmony                                                               _         _             __   _ _____
 *    A component-based HTTP server micro-framework                               | |__ _  _| |_ ___  ___ / /  (_) _/ /_
 *                                                                                | '_ \ || |  _/ -_|(_-</ _ \/ / _/ __/
 * (C)2020, Harold Iedema <harold@iedema.me>                                      |_.__/\_, |\__\___/___/_//_/_/_/ \__/
 * See LICENSE for licensing information                                                |__/             H A R M O N Y
 */
class Bag {
    keys = {};
    data = {};
    constructor(obj) {
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
    name;
    value;
    maxAge = 0;
    domain = null;
    path = '/';
    expires = null;
    httpOnly = null;
    secure = null;
    sameSite = null;
    constructor(name, value) {
        this.name = name;
        this.value = value;
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
    _cookies = new Map();
    constructor() {
    }
    /**
     * Sets a cookie with the given name and value with a lifetime of the given
     * amount of seconds.
     */
    set(name, value, ttl = (3600 * 24), domain = null, path = '/', httpOnly = false, secure = false, sameSite = 'lax') {
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
class ServerError extends Error {
    title;
    message;
    statusCode;
    constructor(title, message, statusCode) {
        super(message);
        this.title = title;
        this.message = message;
        this.statusCode = statusCode;
    }
}

class Compression {
    static gzip = 'gzip';
    static deflate = 'deflate';
    static brotli = 'br';
    static send(request, response, status, headers, content, options) {
        if (!options.enabled) {
            return this.sendUncompressed(response, status, headers, content);
        }
        const encoding = Compression.selectEncoding(request.headers.get('Accept-Encoding') || '');
        const minSize = options.minSize || 1024;
        if (content.length < minSize || !encoding) {
            return this.sendUncompressed(response, status, headers, content);
        }
        switch (encoding) {
            case this.brotli:
                return this.sendBrotli(response, status, headers, content);
            case this.gzip:
                return this.sendGzip(response, status, headers, content);
            case this.deflate:
                return this.sendDeflate(response, status, headers, content);
            default:
                return this.sendUncompressed(response, status, headers, content);
        }
    }
    static sendUncompressed(response, status, headers, content) {
        response.writeHead(status, headers);
        response.write(content);
        response.end();
    }
    static sendGzip(response, status, headers, content) {
        zlib__namespace.gzip(content, (err, compressed) => {
            if (err) {
                return Compression.sendUncompressed(response, status, headers, content);
            }
            headers['Content-Encoding'] = this.gzip;
            headers['Content-Length'] = String(compressed.length);
            headers['Vary'] = 'Accept-Encoding';
            response.writeHead(status, headers);
            response.write(compressed);
            response.end();
        });
    }
    static sendBrotli(response, status, headers, content) {
        zlib__namespace.brotliCompress(content, (err, compressed) => {
            if (err) {
                return Compression.sendUncompressed(response, status, headers, content);
            }
            headers['Content-Encoding'] = this.brotli;
            headers['Content-Length'] = String(compressed.length);
            headers['Vary'] = 'Accept-Encoding';
            response.writeHead(status, headers);
            response.write(compressed);
            response.end();
        });
    }
    static sendDeflate(response, status, headers, content) {
        zlib__namespace.deflate(content, (err, compressed) => {
            if (err) {
                return Compression.sendUncompressed(response, status, headers, content);
            }
            headers['Content-Encoding'] = this.deflate;
            headers['Content-Length'] = String(compressed.length);
            headers['Vary'] = 'Accept-Encoding';
            response.writeHead(status, headers);
            response.write(compressed);
            response.end();
        });
    }
    static selectEncoding(acceptEncoding) {
        if (acceptEncoding.includes(this.brotli)) {
            return this.brotli;
        }
        if (acceptEncoding.includes(this.gzip)) {
            return this.gzip;
        }
        if (acceptEncoding.includes(this.deflate)) {
            return this.deflate;
        }
        return null;
    }
}

/* Byteshift Harmony                                                               _         _             __   _ _____
 *    A component-based HTTP server micro-framework                               | |__ _  _| |_ ___  ___ / /  (_) _/ /_
 *                                                                                | '_ \ || |  _/ -_|(_-</ _ \/ / _/ __/
 * (C)2020, Harold Iedema <harold@iedema.me>                                      |_.__/\_, |\__\___/___/_//_/_/_/ \__/
 * See LICENSE for licensing information                                                |__/             H A R M O N Y
 */
class Response {
    _code = exports.HttpStatus.OK;
    _content = '';
    _isSent = false;
    _headers = new Bag();
    _cookies = new CookieBag();
    constructor(content, statusCode = exports.HttpStatus.OK, contentType = 'text/plain') {
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
    send(request, response, compressionOptions) {
        // Abort if the native response was already sent. This will occur
        // solely when an error is triggered that has been internally caught.
        if (response.headersSent) {
            this._isSent = true;
            return;
        }
        if (this._isSent) {
            throw new Error('This response was already sent.');
        }
        this._isSent = true;
        // Write cookie headers.
        const cookies = this._cookies.serialize();
        for (let cookieString of cookies) {
            this.headers.set('Set-Cookie', cookieString);
        }
        // Check for compression support.
        const buffer = Buffer.isBuffer(this._content) ? this._content : Buffer.from(this._content);
        // Write response & finalize the request.
        Compression.send(request, response, this._code, this._headers.all, buffer, compressionOptions);
    }
}
exports.HttpStatus = void 0;
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
class AccessDeniedError extends ServerError {
    constructor(message = 'Access to the requested resource is denied.') {
        super('Access denied', message, exports.HttpStatus.FORBIDDEN);
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

/* Byteshift Harmony                                                               _         _             __   _ _____
 *    A component-based HTTP server micro-framework                               | |__ _  _| |_ ___  ___ / /  (_) _/ /_
 *                                                                                | '_ \ || |  _/ -_|(_-</ _ \/ / _/ __/
 * (C)2020, Harold Iedema <harold@iedema.me>                                      |_.__/\_, |\__\___/___/_//_/_/_/ \__/
 * See LICENSE for licensing information                                                |__/             H A R M O N Y
 */
class ResponseAwareEvent {
    response;
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
    error;
    request;
    controller;
    methodName;
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
    options;
    request;
    session;
    templateFile;
    data;
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
    request;
    route;
    session;
    constructor(request, route, session) {
        super();
        this.request = request;
        this.route = route;
        this.session = session;
    }
}

/* Byteshift Harmony                                                               _         _             __   _ _____
 *    A component-based HTTP server micro-framework                               | |__ _  _| |_ ___  ___ / /  (_) _/ /_
 *                                                                                | '_ \ || |  _/ -_|(_-</ _ \/ / _/ __/
 * (C)2020, Harold Iedema <harold@iedema.me>                                      |_.__/\_, |\__\___/___/_//_/_/_/ \__/
 * See LICENSE for licensing information                                                |__/             H A R M O N Y
 */
class ResponseEvent {
    request;
    route;
    response;
    session;
    constructor(request, route, response, session) {
        this.request = request;
        this.route = route;
        this.response = response;
        this.session = session;
    }
}

/* Byteshift Harmony                                                               _         _             __   _ _____
 *    A component-based HTTP server micro-framework                               | |__ _  _| |_ ___  ___ / /  (_) _/ /_
 *                                                                                | '_ \ || |  _/ -_|(_-</ _ \/ / _/ __/
 * (C)2020, Harold Iedema <harold@iedema.me>                                      |_.__/\_, |\__\___/___/_//_/_/_/ \__/
 * See LICENSE for licensing information                                                |__/             H A R M O N Y
 */
class StaticRequestEvent extends ResponseAwareEvent {
    request;
    fileName;
    mimeType;
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
    request;
    response;
    fileName;
    mimeType;
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
class UpgradeEvent {
    request;
    socket;
    session;
    constructor(request, socket, session) {
        this.request = request;
        this.socket = socket;
        this.session = session;
    }
}

/* Byteshift Harmony                                                               _         _             __   _ _____
 *    A component-based HTTP server micro-framework                               | |__ _  _| |_ ___  ___ / /  (_) _/ /_
 *                                                                                | '_ \ || |  _/ -_|(_-</ _ \/ / _/ __/
 * (C)2020, Harold Iedema <harold@iedema.me>                                      |_.__/\_, |\__\___/___/_//_/_/_/ \__/
 * See LICENSE for licensing information                                                |__/             H A R M O N Y
 */
class Profile {
    request;
    id;
    name;
    createdAt = new Date();
    timings = new Map();
    hRequest;
    hRoute;
    hResponse;
    activeMeasurements = new Map();
    constructor(request) {
        this.request = request;
        this.id = `h${[...Array(8)].map(() => (~~(Math.random() * 36)).toString(36)).join('')}`;
        this.name = request.url;
    }
    /**
     * Returns the response HTTP status code.
     *
     * @returns {number}
     */
    get statusCode() {
        return this.hResponse?.statusCode ?? 0;
    }
    /**
     * Returns a list of uploaded files, indexed by POST field name.
     *
     * @returns {{fieldName: string, files: IUploadedFile[]}[]}
     */
    get files() {
        if (!this.hRequest || this.hRequest.files.size === 0) {
            return [];
        }
        const result = [];
        Object.keys(this.hRequest.files.all).forEach((fieldName) => {
            let files = this.hRequest.files.get(fieldName);
            if (!Array.isArray(files)) {
                files = [files];
            }
            result.push({ fieldName: fieldName, files: files });
        });
        return result;
    }
    /**
     * Starts measuring the time of an event with the given name.
     *
     * Call {@link Profile.stop} to calculate the time needed for this event
     * and store it.
     *
     * @param {string} name
     */
    start(name) {
        this.activeMeasurements.set(name, this.getHrTime());
    }
    /**
     * Stops the time measurement of the event with the given name and stores
     * the result in this profile.
     *
     * @param {string} name
     */
    stop(name) {
        if (!this.activeMeasurements.has(name)) {
            return;
        }
        this.timings.set(name, {
            name: name,
            startedAt: this.activeMeasurements.get(name),
            time: this.getHrTime() - this.activeMeasurements.get(name),
        });
        this.activeMeasurements.delete(name);
    }
    /**
     * Returns the total time of every event captured in this profile.
     *
     * @returns {number}
     */
    get totalTime() {
        let total = 0;
        for (const timing of this.timing) {
            total += timing.time;
        }
        return total;
    }
    /**
     * Returns timing information captured in this profile.
     *
     * @returns {Timing[]}
     */
    get timing() {
        return Array.from(this.timings.values());
    }
    /**
     * Returns the current time in microseconds.
     *
     * @returns {number}
     * @private
     */
    getHrTime() {
        const hrTime = process.hrtime();
        return hrTime[0] * 1000000 + hrTime[1] / 1000;
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
    r;
    _clientIp;
    _method;
    _parameters;
    _headers;
    _cookies;
    _query;
    _path;
    _post;
    _files;
    _body;
    _isSecure;
    _profile;
    constructor(r, body, profile = null) {
        this.r = r;
        const u = new URL(r.url, 'http://localhost/');
        const q = {};
        u.searchParams.forEach((v, k) => q[k] = v);
        this._clientIp = r.headers['x-forwarded-for'] || r.socket.remoteAddress;
        this._method = r.method.toUpperCase();
        this._path = u.pathname.replace(/(\/)$/g, '') || '/';
        this._headers = new Bag(r.headers);
        this._cookies = new Bag(r.headers.cookie ? this._parseCookies(r.headers.cookie) : {});
        this._query = new Bag(q);
        this._parameters = new Bag();
        this._post = body.fields;
        this._files = body.files;
        this._body = body.raw;
        this._isSecure = (r.socket instanceof tls.TLSSocket) && r.socket.encrypted;
        this._profile = profile;
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
    get(name) {
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
    startProfileMeasurement(name) {
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
    stopProfileMeasurement(name) {
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
    get clientIp() {
        return this._clientIp;
    }
    /**
     * Returns true if the incoming request came from a secure (HTTPS/TLS)
     * connection.
     *
     * @returns {boolean}
     */
    get isSecure() {
        return this._isSecure;
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
     * Returns the POST-fields bag.
     *
     * @returns {Bag<string | string[]>}
     */
    get post() {
        return this._post;
    }
    /**
     * Returns the files bag.
     *
     * @returns {Bag<IUploadedFile | IUploadedFile[]>}
     */
    get files() {
        return this._files;
    }
    /**
     * Returns the request body as parsed JSON content.
     *
     * @returns {any}
     */
    get json() {
        try {
            return JSON.parse(this._body.toString());
        }
        catch (e) {
            return null;
        }
    }
    /**
     * Returns the raw request body as a buffer.
     *
     * @returns {string}
     */
    get body() {
        return this._body;
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
const HarmonyElements = {
    factories: new Map(),
};

/* Byteshift Harmony                                                               _         _             __   _ _____
 *    A component-based HTTP server micro-framework                               | |__ _  _| |_ ___  ___ / /  (_) _/ /_
 *                                                                                | '_ \ || |  _/ -_|(_-</ _ \/ / _/ __/
 * (C)2020, Harold Iedema <harold@iedema.me>                                      |_.__/\_, |\__\___/___/_//_/_/_/ \__/
 * See LICENSE for licensing information                                                |__/             H A R M O N Y
 */
class Node {
    tagName;
    attributes;
    children;
    /**
     * A set of void HTML element that don't require closing.
     *
     * @type {Set<string>}
     * @private
     */
    voidElements = new Set([
        'area', 'base', 'col', 'command',
        'meta', 'link', 'img', 'br', 'hr',
        'embed', 'param', 'source', 'track',
        'wbr',
    ]);
    /**
     * A reference to our parent node.
     *
     * @type {Node}
     */
    parentNode = null;
    /**
     * A unique identifier for this node.
     *
     * @type {string}
     */
    key;
    /**
     * A set of scripts added to the final output.
     *
     * @type {string[]}
     * @private
     */
    scripts = [];
    constructor(tagName, attributes, children) {
        this.tagName = tagName;
        this.attributes = attributes;
        this.children = children;
        for (const child of children) {
            if (Array.isArray(child)) {
                for (const innerChild of child) {
                    innerChild.parentNode = this;
                }
            }
            else if (child instanceof Node) {
                child.parentNode = this;
            }
        }
        this.key = `h${[...Array(8)].map(() => (~~(Math.random() * 36)).toString(36)).join('')}`;
    }
    /**
     * Returns the root node.
     *
     * @returns {Node}
     */
    get rootNode() {
        if (!this.parentNode) {
            return this;
        }
        return this.parentNode;
    }
    /**
     * Returns true of this node represents a void element.
     *
     * @returns {boolean}
     * @private
     */
    get isVoidElement() {
        return this.voidElements.has(this.tagName);
    }
    /**
     * Renders the HTML content of this node.
     *
     * @returns {string}
     */
    render() {
        const children = [];
        for (const child of this.children.flat(100)) {
            if (Array.isArray(child)) {
                for (const innerChild of child) {
                    if (innerChild instanceof Node) {
                        children.push(innerChild.render());
                    }
                    else {
                        children.push(innerChild);
                    }
                }
            }
            else if (child instanceof Node) {
                children.push(child.render());
            }
            else {
                children.push(child);
            }
        }
        const tagName = this.toKebabCase(this.tagName);
        const attributes = this.serializeAttributes(this.attributes);
        if (this.rootNode !== this) {
            this.rootNode.scripts.push(...this.scripts);
        }
        if (this.isVoidElement) {
            return this.finalizeOutput(`<${tagName}${attributes}>`);
        }
        if (HarmonyElements.factories.has(this.tagName)) {
            const htmlOrNode = HarmonyElements.factories.get(this.tagName)(this.attributes, children.flat(100).join(''));
            if (htmlOrNode instanceof Node) {
                htmlOrNode.parentNode = this;
                return this.finalizeOutput(htmlOrNode.render());
            }
            return this.finalizeOutput(htmlOrNode);
        }
        return this.finalizeOutput(`<${tagName} ${this.key}${attributes}>${children.flat(100).join('')}</${tagName}>`);
    }
    finalizeOutput(html) {
        const output = [html];
        if (!this.parentNode) {
            output.push(`<script type="text/javascript">`, ...this.scripts, `</script>`);
        }
        return output.join('\n');
    }
    /**
     * Converts the given camelCase or PascalCase string to kebab-case.
     *
     * @param {string} str
     * @returns {string}
     * @private
     */
    toKebabCase(str) {
        // Special case.
        if (str === 'colSpan') {
            return 'colspan';
        }
        if (str === 'htmlFor') {
            return 'for';
        }
        return str.replace(/[A-Z]+(?![a-z])|[A-Z]/g, ($, ofs) => (ofs ? '-' : '') + $.toLowerCase());
    }
    /**
     * Creates the contents of a style-attribute based on the given object.
     *
     * @param {{[p: string]: string}} styles
     * @returns {string}
     */
    createStyleAttributeOf(styles) {
        const result = [];
        Object.keys(styles).forEach((key) => {
            result.push(`${this.toKebabCase(key)}: ${styles[key]}`);
        });
        return result.join(';');
    }
    /**
     * Serialize attributes object into a string that fits into an HTML-tag.
     *
     * @param {{[p: string]: any}} attributes
     * @returns {string}
     */
    serializeAttributes(attributes) {
        if (!attributes) {
            return '';
        }
        const result = [];
        Object.keys(attributes || {}).forEach((attr) => {
            let name = this.toKebabCase(attr), value = attributes[attr];
            if (name === 'style') {
                value = this.createStyleAttributeOf(value);
            }
            if (name === 'class' && typeof value === 'object') {
                value = this.getClassStringOf(value);
            }
            if (typeof value === 'boolean') {
                if (value) {
                    result.push(name);
                }
            }
            else if (typeof value === 'function') {
                if (name.startsWith('on')) {
                    const eventName = this.getEventNameOfAttribute(name);
                    this.scripts.push(`document.querySelector('[${this.key}]').addEventListener('${eventName}', ${value.toString()});`);
                }
                else {
                    throw new Error(`Cannot embed native javascript unless it is being bound to an event.`);
                }
            }
            else {
                result.push(`${name}="${value.toString()}"`);
            }
        });
        return result.length > 0 ? (' ' + result.join(' ')) : '';
    }
    /**
     * Returns a string suitable for a "class"-attribute based on the given
     * object.
     *
     * @param {{[p: string]: boolean}} obj
     * @returns {string}
     * @private
     */
    getClassStringOf(obj) {
        const result = [];
        Object.keys(obj).forEach((name) => {
            if (obj[name]) {
                result.push(name);
            }
        });
        return result.join(' ');
    }
    /**
     * Returns an event name for using in {@link document.addEventListener}
     * based on the given attribute name.
     *
     * @param {string} name
     * @returns {string}
     * @private
     */
    getEventNameOfAttribute(name) {
        return `${name.substr(3).split('-').join('').toLowerCase()}`;
    }
}

/* Byteshift Harmony                                                               _         _             __   _ _____
 *    A component-based HTTP server micro-framework                               | |__ _  _| |_ ___  ___ / /  (_) _/ /_
 *                                                                                | '_ \ || |  _/ -_|(_-</ _ \/ / _/ __/
 * (C)2020, Harold Iedema <harold@iedema.me>                                      |_.__/\_, |\__\___/___/_//_/_/_/ \__/
 * See LICENSE for licensing information                                                |__/             H A R M O N Y
 */
class HtmlResponse extends Response {
    constructor(html, statusCode = exports.HttpStatus.OK) {
        if (html instanceof Node) {
            html = html.render();
        }
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
class RedirectResponse extends Response {
    constructor(url, statusCode = exports.HttpStatus.TEMPORARY_REDIRECT) {
        super('', statusCode);
        this.headers.set('Location', url);
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
        const paramRegEx = /^[\w]+?\s?(\w+)\(([A-Za-z0-9_,=\s]+)\)[\s]+{/i.exec(target[methodName].toString());
        const paramNames = ((paramRegEx && paramRegEx[2]) ? paramRegEx[2].split(',').map(n => n.trim()) : [])
            .map((p) => p.split('=')[0].trim());
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
    routes = [];
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
class RawHttpRequest {
    r;
    /**
     * The request method as a string. Read-only. Examples: `'GET'`, `'DELETE'`.
     *
     * @type {string}
     */
    method;
    /**
     * Request URL string. This contains only the URL that is present in the
     * actual HTTP request. If the request is:
     *
     * ```http
     * GET /status?name=ryan HTTP/1.1
     * Accept: text/plain
     * ```
     *
     * Then `request.url` will be:
     *
     * ```js
     * '/status?name=ryan'
     * ```
     *
     * To parse the url into its parts, `new URL()` can be used:
     *
     * ```console
     * $ node
     * > new URL('/status?name=ryan', 'http://example.com')
     * URL {
     *   href: 'http://example.com/status?name=ryan',
     *   origin: 'http://example.com',
     *   protocol: 'http:',
     *   username: '',
     *   password: '',
     *   host: 'example.com',
     *   hostname: 'example.com',
     *   port: '',
     *   pathname: '/status',
     *   search: '?name=ryan',
     *   searchParams: URLSearchParams { 'name' => 'ryan' },
     *   hash: ''
     * }
     * ```
     */
    url;
    /**
     * The request/response headers object.
     *
     * Key-value pairs of header names and values. Header names are lower-cased.
     *
     * ```js
     * // Prints something like:
     * //
     * // { 'user-agent': 'curl/7.22.0',
     * //   host: '127.0.0.1:8000',
     * //   accept: '*' }
     * console.log(request.headers);
     * ```
     *
     * See `HTTP/2 Headers Object`.
     *
     * In HTTP/2, the request path, host name, protocol, and method are represented as
     * special headers prefixed with the `:` character (e.g. `':path'`). These special
     * headers will be included in the `request.headers` object. Care must be taken not
     * to inadvertently modify these special headers or errors may occur. For instance,
     * removing all headers from the request will cause errors to occur:
     *
     * ```js
     * removeAllHeaders(request.headers);
     * assert(request.url);   // Fails because the :path header has been removed
     * ```
     */
    headers;
    /**
     * Returns a `Proxy` object that acts as a `net.Socket` (or `tls.TLSSocket`)
     * but applies getters, setters, and methods based on HTTP/2 logic.
     *
     * `destroyed`, `readable`, and `writable` properties will be retrieved from
     * and set on `request.stream`.
     *
     * `destroy`, `emit`, `end`, `on` and `once` methods will be called on
     * `request.stream`.
     *
     * `setTimeout` method will be called on `request.stream.session`.
     *
     * `pause`, `read`, `resume`, and `write` will throw an error with code
     * `ERR_HTTP2_NO_SOCKET_MANIPULATION`. See `Http2Session and Sockets` for
     * more information.
     *
     * All other interactions will be routed directly to the socket. With TLS
     * support, use `request.socket.getPeerCertificate()` to obtain the client's
     * authentication details.
     */
    socket;
    constructor(r) {
        this.r = r;
        this.method = r.http1 ? r.http1.method : r.http2.method;
        this.url = r.http1 ? r.http1.url : r.http2.url;
        this.headers = r.http1 ? r.http1.headers : r.http2.headers;
        this.socket = r.http1 ? r.http1.socket : r.http2.socket;
    }
    on(eventName, callback) {
        this.r.http1
            ? this.r.http1.on(eventName, callback)
            : this.r.http2.on(eventName, callback);
        return this;
    }
}

/* Byteshift Harmony                                                               _         _             __   _ _____
 *    A component-based HTTP server micro-framework                               | |__ _  _| |_ ___  ___ / /  (_) _/ /_
 *                                                                                | '_ \ || |  _/ -_|(_-</ _ \/ / _/ __/
 * (C)2020, Harold Iedema <harold@iedema.me>                                      |_.__/\_, |\__\___/___/_//_/_/_/ \__/
 * See LICENSE for licensing information                                                |__/             H A R M O N Y
 */
class RawHttpResponse {
    r;
    constructor(r) {
        this.r = r;
    }
    /**
     * Sets a single header value for the header object.
     *
     * @param {string} name
     * @param {number|string|ReadonlyArray<string>} value Header value
     */
    setHeader(name, value) {
        this.r.http1 ? this.r.http1.setHeader(name, value) : this.r.http2.setHeader(name, value);
        return this;
    }
    /**
     * Writes the given chunk to the response stream.
     *
     * @param chunk
     * @param {(error: (Error | null | undefined)) => void} callback
     * @returns {this}
     */
    write(chunk, callback) {
        this.r.http1 ? this.r.http1.write(chunk, callback) : this.r.http2.write(chunk, callback);
        return this;
    }
    /**
     * Returns true if headers were already sent to the client.
     *
     * @returns {boolean}
     */
    get headersSent() {
        return this.r.http1 ? this.r.http1.headersSent : this.r.http2.headersSent;
    }
    /**
     * Writes the HTTP header to the client.
     *
     * @param {HttpStatus} statusCode
     * @param {OutgoingHttpHeaders} headers
     * @returns {this}
     */
    writeHead(statusCode, headers) {
        this.r.http1 ? this.r.http1.writeHead(statusCode, headers) : this.r.http2.writeHead(statusCode, headers);
        return this;
    }
    end(cb) {
        this.r.http1 ? this.r.http1.end(cb) : this.r.http2.end(cb);
        return this;
    }
}

var template = "<!DOCTYPE html>\n<html>\n<head>\n    <title>Error</title>\n    <meta charset=\"UTF-8\">\n    <style type=\"text/css\">\n    body, html {\n        font-family: Arial, sans-serif;\n        font-size: 14px;\n        color: #272727;\n        background: #eee;\n        display: flex;\n        flex-direction: column;\n        justify-content: center;\n        align-items: center;\n        width: 100%;\n        height: 100%;\n        padding: 0;\n        margin: 0;\n    }\n\n    * { box-sizing: border-box; }\n\n    main {\n        width: 800px;\n        border: 1px solid #dadade;\n        border-radius: 6px;\n        background: #fff;\n        box-shadow: rgba(50, 50, 93, 0.25) 0 13px 27px -5px, rgba(0, 0, 0, 0.3) 0 8px 16px -8px;\n        overflow: hidden;\n    }\n\n    img {\n        margin-bottom: 10px;\n    }\n\n    header {\n        display: flex;\n        flex-direction: column;\n        align-items: flex-start;\n        justify-content: flex-start;\n        background: #444;\n        color: #fff;\n    }\n\n    header > .title {\n        width: 100%;\n        font-family: \"Arial\", sans-serif;\n        font-weight: lighter;\n        font-size: 48px;\n        padding: 10px;\n        text-align: center;\n    }\n    footer {\n        padding: 5px;\n        width: 100%;\n        background: #eee;\n        color: #777;\n        font-weight: lighter;\n        font-size: 14px;\n        text-align: center;\n    }\n    section {\n        padding: 20px;\n        text-align: center;\n        font-size: 16px;\n    }\n\n    section > pre {\n        padding: 20px;\n        background: #333;\n        color: #eee;\n        text-align: left;\n        width: 100%;\n        white-space: pre-wrap;\n        font-size: 13px;\n    }\n    </style>\n</head>\n<body>\n<img id=\"logo\" src=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAATcAAABDCAYAAAD55kJRAAAMHklEQVR4nO2di5EiOQyGe682ATYELgQuBDYENgQmBKgOoAtCGEIYQoAQIISZEJgQuGLOvvP6LFm2JdMGfVVdU7uAu9uP35L8+tb9w7zrupX5S+Eb8Xsuk67rNl3XLQnf3Xddt+667sP/oO/7WzoXQhq33/4ahuHc9/2i67q32/8Nw/BnIM2VebbjMAw/+77fmPyIcR6G4S8nfQq3Z9r3fT81v5lFfvPD/LXv/GMYhs/AOxxM+a2HYdj2fX8yab8Mw7Bz/i3xTsFnUhRprtcreIc/jOi8JQhbLm9EYbtxa1gH4LMJMY2pSSflN7nkpL8kio3//NR7+d+TzgNFGRXfjQDUaPyp4jk1jf+MfOfPYRhC1p21xKji8RvDMKyN5eintxuG4QX5adAyBLB5HkvTWqtcfFlyhDzYuxZ63/dz0+GkvKOi3I3vI+/RpxFxi2FdJSuA077vYTtWUZSH4XulF7mJzDHDeosJ73vf99jnX8I4DMOx7/u946ZKQRHPX8YqssK77Psectftd1PeOcZr3/evWJ7dYm7C+aQo4tQStxu/EgYUuPjXLR2G4ReUpuN21mRnxB5znVdmcEVRlERi4pYzKgpxs1RezOVycz3fM9OMxdxqu9zkeJR57qCF5IwIh4QPeucD0TImxdwUpXX+0BJUFOURqemWShCLP31ZOIlztkogx9yIrrDOHVOUTFq03KgN/sPEtWogJUJb8zcnff83KpTK03GzIK7AVYMpcv+agw+KojTGbYUCdGnMTVGUh6T1mJuijIGlGZmfIt6GGybZaZigDs/kltoNArB3vjrfyVq+pTwFdpAKq0fY9U7cnKFV7HI9Sl5gk8otM2J6X1PA7IL6Rxe3mXnh3Ep4HZHQWXF+Bwq1ZoxyGukoToydxNKkA1Xug/lcegVKZ+4Ryv+Sq8YEclt3XiPCwFFedp4mNU9i4pac3qOLG0Xp35CtniaBBkXZokiChRELSsFehEVumfAs/nOlWCqzSEOMdUbcE7inCZaIFfZQOdh65efhRUicV4nCYK8Sy3KeeK+YuKWmd7Xl/4jihjWKnEJbeBWEYkZzMClwfU4mb7mYZYpaKP9jKylyRS0kchwsCPe6ZIhqqO1xzcdcZopaqLxSRXcM4vZV9x9J3KZIA8wpJJeZsHiE7sfh/nBYA7EYZc4FWTUcAupeh0IrLvbuqRYpJf3SZ8Y6RKzOYiKS4jpzi1uqW/pw4jZDMoDLTfPzClr/WQr2LjkXd+PjulzhlRA2e50yxSL27lyxslAndspIh5KHueJ2RTaQTU0nVdxsmimd/cOIGyQGB2brahK4B7fATZmFzV45AicpbDbvbPmUjDxSrlSxwFzRd+Yyhwa8Ul1USkywRNxShCjn/qlE79O6uE2Q0UMJQj3jhanQoHehilQsVpXiovpuOCRO0CglZcrN1TTIJbFRhWJa08DAD3RR6wTWwUisUcben9opxfL6RNw1hjJ4FWuXKm6GUnEL9fiS84egRpTjRvhQpqyUiFuKCMfEIiWPYyN22GepsZ5Y50CxuCArUqrDxMSNUmZYG8ptD1hdvETcfBU3Q4m4hSqF9FwvrNGXiCplRC7W+1IsJYoIx9yTnMOEUmNqF6H7xOJG0LtLdpixcou5glinVtIesOfC8qMJcePMrJzhfexeoRGUGjO+Mcsg1qNBxEaDUuZAUUZZY/kkJeApAlcS04q591gDC727dL2ixBuhZw7Fge3FYWlCdYFS111tETE6zGRdK3Lv7iJ6/wHGdmEZ4j93jblnWEUqaQhYGbxn9HYxEcEqJvaO1NEyjJgLxSUmmCUMpR+yBGqsHqAMIEH1G6o7uR2tD2YdxTpcFTfkwjLErRC525SnQgl8Uw6Mxt7Fv3ItmNioK9TAsfrANYMes+K5GmWHWG+Qa+4/F0ccNQYlHIHlC2T1cXb2UEcZE/67ilurWx75Z62Ch78I3DfGJGNUEmrM64KjDT/cs1cDQJUNepZPxsNqjpHPuHbMgJ4XynO33D4r1Stqo4fO/oXiklgepwKlJX2QexE54rYzB8ekXj8Zn9uthLvCs02pzBMKM8XawtIs3Ul455zZ6jMFnhN6Hs48xtKqdR/f1fcFb4vkHReLRIHwy2uCdEac+Qjlw6h3zWnVcrMV4jNinXCSEgcqqbCWM5MFgwkktGFACM6GjqXFeZ8UcXPz4sPZ4l2KSUY8zy8vLBZbq7wklyAWERO3kHXmH81H5QikRzoKz8HtYWtt+lfaw2KcAfeJq+fFxC0kZFBl5bZibPnbdNfm35zntGLP7L+7b7VJ85ohDP73ax1dibWx2sdnkmnRcnMLuMaBxTk9bJdQcbeBmEZJJ+KDxcpGWzHvQM16lbv3HOaGStKkuLW4zbgbKK8Ra8vpYbuRFfoZaEy61fV/2PLaC+fLsnB6yQR5vk8hq9MN/0jslSdCi+J2riRqnamEudMfxlQBdkClpLia60pumhTfTLqUc2I74UGEpfB8TElxs+kuWxE3Pf0KZlVpxUMNQtMajhXPdW0JKattVXGT06en09OvQKi9fEvYAR3MrXlmJPPkjXECtJYdkRbFbW5GIz+FLA/OijhGtHGEse4o59wtew4EV5qfWn50Wh0t3QhYVnaL8kcWNgXGisacKaZkD4HhFEvpScUPRYviZgt4wrx9OPfuqkpb2Ok4k8LY2NLUJYmwBueSqoen1dFSy6Zw9HShhy8rBrsixK4NfktcW7qqME0iVs8nziAY56ipa0g0NTeyxc0qT95uCakLeKGDjTmvlGfydxu5J6m7iJTyLpx+St3yd9i4IJ2f7RipZ5lyXL6wYNsRcYK10VA9x7ao5yxnf7fg33YFaXW0dO9UuImpYHvTs4V6rIUpoJTF78rzsQucyDWWUfNaSw05wCxMTi8JbcutznMLxR4WkVOENonCtjUTWNfCgdzQiffqKt+HY6Wg/dZZW/uDGFapsdSQE+iduAZsoF1t/qVVcTsLB1fXzsz8rdmuSarXDK2C2Ki43Q3p1Rj+TjafhHXExwYHE6Dn5RoIjLq3La9QkKyE/vy5Dx2pYscPwM9HYrHuhMs6ZBnGOk6uTRRqglmaq8KtkmYUgWxZ3I6CpnqosunkSV7sXEVX3MZisb4Ilvcs8I5YQ5UOi0iBeVcTEyrKcU+n1LNjW19buhaqhH5lw7YOr7WIX6nHh7C1dHIs1zfExdo3vmkB9uyzjEnOczN4SLL6Whc3qUq4cQTOZmiol9k3GOhVaOyFd3neRHadOTfqjrrEvKupI/QxNinC1hHELXQCT24wEJpXVnpylUQlnDgnIR2A3iW2xbk//yl2oPLYgUaiY7P5J8AJTRDQyVixBjAD5pyVsK24jb3LmWEQK3d+2SLQVkva6AuTW53swqZabrbRj62R3qMS/kwstBkilI9MjY0IrIBK1MttxdPVOtNZ/3WnGO/c5CPnuQh2uy2J90Fd9ly3tJa4pWRITYH7Wbjk65moUVfmwgeV7M1ZH5KjqFYEagqpj1RZnSPGAOQVYCtK1rHyGHvMLdWc3ZpeTyrI/2HSrzEtxHXPOE56vwePdEbDh2mgXG6Wy9aIZ2r8dgwj+NS8OJu2wxGjfqEOtGDrxlLWk8VIXctZGotbRU5cT71ekYN8S/KO8pua4pa6VjIWc8NOl0+5sJjRJKN+lYYHFshp79T6zbHOkvrelHtha0I52+g8M+/8jQn8tbW/rS11vwQdme+/TK5blVL5OGNTK+K7YY039izY5gP2ggZjqPlRC2gAIFfcOqLbUdo4p8TnvgiEBpbOtI6YmHHvHDIjvjdVSOfEDo5rE84VYojYPIPKyzcsguL2LKwIYmfnHXHtFReDYl226pYqiiRQp3l5RnEbIxS3TcVNaRVrlR0EBiwgI+VNxW08xNxaFTelRUKWFZfAoXvGqbgpiiIJFGfnEDgszjhTcVMURRJsELFE4DBP5/SsAwqKotQjFk/OGbWOTb1aqrgpiiINZQ4tNH80REwsn3oqiKIodaHMAb0iO6QsEtKYqbgpilITqjiVXCtX2FTcFEWphaTA/U/YVNwURamJhMAFhU3FTVGU2syZDkQ/+DE2FTdFUcZA7q49B3fgARO3b1rMiqLckZsld1tKdfsbmth727PO7t32vz3cQAut67q/AXmIdcLwo4MJAAAAAElFTkSuQmCC\" alt=\"\">\n<main>\n    <header>\n        <div class=\"title\">Something went wrong</div>\n    </header>\n    <section>\n        {{ message }}\n        <pre>{{ trace }}</pre>\n    </section>\n    <footer>\n        {{ title }}\n    </footer>\n</main>\n</body>\n</html>\n";

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
class Profiler {
    isEnabled;
    maxProfiles;
    profiles = [];
    constructor(isEnabled, maxProfiles) {
        this.isEnabled = isEnabled;
        this.maxProfiles = maxProfiles;
    }
    /**
     * Returns true if a profile with the given ID exists.
     *
     * @param {string} id
     * @returns {boolean}
     */
    has(id) {
        return !!this.profiles.find(p => p.id === id);
    }
    /**
     * Returns a profile with the given ID, or NULL if no such profile exists.
     *
     * @param {string} id
     * @returns {Profile | null}
     */
    get(id) {
        let profile;
        if (!(profile = this.profiles.find(p => p.id === id))) {
            return null;
        }
        return profile;
    }
    /**
     * Stores the given profile.
     *
     * @param {Profile} profile
     */
    save(profile) {
        if (!this.isEnabled) {
            return;
        }
        this.profiles.push(profile);
        if (this.profiles.length > (this.maxProfiles ?? 50)) {
            this.profiles.shift();
        }
    }
}

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

/* Byteshift Harmony                                                               _         _             __   _ _____
 *    A component-based HTTP server micro-framework                               | |__ _  _| |_ ___  ___ / /  (_) _/ /_
 *                                                                                | '_ \ || |  _/ -_|(_-</ _ \/ / _/ __/
 * (C)2022, Harold Iedema <harold@iedema.me>                                      |_.__/\_, |\__\___/___/_//_/_/_/ \__/
 * See LICENSE for licensing information                                                |__/             H A R M O N Y
 */
/**
 * JSX rendering function.
 */
function h(tagName, attributes, ...children) {
    return new Node(tagName, attributes ?? {}, children ?? []);
}

/* Byteshift Harmony                                                               _         _             __   _ _____
 *    A component-based HTTP server micro-framework                               | |__ _  _| |_ ___  ___ / /  (_) _/ /_
 *                                                                                | '_ \ || |  _/ -_|(_-</ _ \/ / _/ __/
 * (C)2020, Harold Iedema <harold@iedema.me>                                      |_.__/\_, |\__\___/___/_//_/_/_/ \__/
 * See LICENSE for licensing information                                                |__/             H A R M O N Y
 */
class ProfilerController {
    profiler;
    constructor(profiler) {
        this.profiler = profiler;
    }
    indexAction() {
        let message = this.profiler.profiles.length === 0
            ? 'There are no profiles. Make a request to capture a profile.'
            : 'Select a profile from the list on the left.';
        return new HtmlResponse(this.document(h("div", { class: "title-message" }, message)));
    }
    profileAction(id) {
        if (!this.profiler.has(id)) {
            return new HtmlResponse(this.document(h("div", { class: "title-message" }, "The requested profile no longer exists.")));
        }
        const profile = this.profiler.get(id);
        return new HtmlResponse(this.document((h("div", { id: "app" },
            h("h2", null, "Timeline"),
            this.renderTimelineElementsOf(profile),
            h("h2", null, "Request"),
            h("table", null,
                h("tbody", null,
                    h("tr", null,
                        h("td", { class: "label" }, "Request method"),
                        h("td", { class: "value" }, profile.request.method)),
                    h("tr", null,
                        h("td", { class: "label" }, "URL"),
                        h("td", { class: "value" }, profile.hRequest?.path ?? 'N/A')),
                    h("tr", null,
                        h("td", { class: "label" }, "Client IP"),
                        h("td", { class: "value" }, profile.hRequest?.clientIp ?? 'N/A')),
                    h("tr", null,
                        h("td", { class: "label" }, "Controller"),
                        h("td", { class: "value" },
                            profile.hRoute?._controller[0].name ?? '-',
                            ".",
                            profile.hRoute?._controller[1])),
                    h("tr", null,
                        h("td", { colSpan: 2, class: "table-header" }, "Request headers")),
                    Object.keys(profile.hRequest?.headers.all ?? {}).map(name => {
                        return (h("tr", null,
                            h("td", { class: "label" }, name),
                            h("td", { class: "value" }, profile.hRequest.headers.get(name))));
                    }),
                    profile.hRequest?.query.size > 0 ? ([
                        h("tr", null,
                            h("td", { colSpan: 2, class: "table-header" }, "Query parameters")),
                        ...Object.keys(profile.hRequest?.query.all ?? {}).map(name => {
                            return (h("tr", null,
                                h("td", { class: "label" }, name),
                                h("td", { class: "value" }, profile.hRequest.query.get(name))));
                        }),
                    ]) : null,
                    profile.hRequest?.post.size > 0 ? ([
                        h("tr", null,
                            h("td", { colSpan: 2, class: "table-header" }, "Post fields")),
                        ...Object.keys(profile.hRequest?.post.all ?? {}).map(name => {
                            return (h("tr", null,
                                h("td", { class: "label" }, name),
                                h("td", { class: "value" }, profile.hRequest.post.get(name))));
                        }),
                    ]) : null,
                    profile.hRequest?.cookies.size > 0 ? ([
                        h("tr", null,
                            h("td", { colSpan: 2, class: "table-header" }, "Cookies")),
                        ...Object.keys(profile.hRequest?.cookies.all ?? {}).map(name => {
                            return (h("tr", null,
                                h("td", { class: "label" }, name),
                                h("td", { class: "value" }, profile.hRequest.cookies.get(name))));
                        }),
                    ]) : null,
                    profile.files.length > 0 ? ([
                        h("tr", null,
                            h("td", { colSpan: 2, class: "table-header" }, "Uploaded files")),
                        ...profile.files.map(file => {
                            return (h("tr", null,
                                h("td", { class: "label" }, file.fieldName),
                                h("td", { class: "value" },
                                    h("table", null,
                                        h("tbody", null, file.files.map(uploadedFile => {
                                            return [
                                                h("tr", null,
                                                    h("td", { class: "label" }, "File name"),
                                                    h("td", { class: "value" }, uploadedFile.fileName)),
                                                h("tr", null,
                                                    h("td", { class: "label" }, "Name"),
                                                    h("td", { class: "value" }, uploadedFile.name)),
                                                h("tr", null,
                                                    h("td", { class: "label" }, "Mime type"),
                                                    h("td", { class: "value" }, uploadedFile.mimeType)),
                                                h("tr", null,
                                                    h("td", { class: "label" }, "Size in bytes"),
                                                    h("td", { class: "value" }, uploadedFile.data.length)),
                                            ];
                                        }))))));
                        }),
                    ]) : null,
                    this.isViewableRequestBody(profile) ? ([
                        h("tr", null,
                            h("td", { class: "table-header", colSpan: 2 }, "Request body (text only)")),
                        h("tr", null,
                            h("td", { colSpan: 2 },
                                h("pre", null, this.htmlEntities(profile.hRequest.body.toString('utf-8'))))),
                    ]) : null)),
            h("h2", null, "Response"),
            h("table", null,
                h("tbody", null,
                    h("tr", null,
                        h("td", { class: "label" }, "Status code"),
                        h("td", { class: "value" }, profile.statusCode || 'N/A')),
                    h("tr", null,
                        h("td", { class: "label" }, "Response class"),
                        h("td", { class: "value" }, profile.hResponse?.constructor.name ?? 'N/A')),
                    h("tr", null,
                        h("td", { class: "label" }, "Size in bytes"),
                        h("td", { class: "value" }, profile.hResponse?.content.length ?? 'N/A')),
                    profile.hResponse?.headers.size > 0 ? ([
                        h("tr", null,
                            h("td", { colSpan: 2, class: "table-header" }, "Response headers")),
                        ...Object.keys(profile.hResponse?.headers.all ?? {}).map(name => {
                            return (h("tr", null,
                                h("td", { class: "label" }, name),
                                h("td", { class: "value" }, profile.hResponse?.headers.get(name))));
                        }),
                    ]) : null,
                    this.isViewableResponseBody(profile) ? ([
                        h("tr", null,
                            h("td", { class: "table-header", colSpan: 2 }, "Response body")),
                        h("tr", null,
                            h("td", { colSpan: 2 },
                                h("pre", null, this.getViewableResponseBody(profile)))),
                    ]) : null)))), id));
    }
    isViewableRequestBody(profile) {
        const contentType = profile.hRequest?.headers.get('content-type') ?? '';
        return (contentType.indexOf('json') !== -1 ||
            contentType.indexOf('text') !== -1 ||
            contentType.indexOf('xml') !== -1) && profile.hRequest?.body.length > 0;
    }
    isViewableResponseBody(profile) {
        const contentType = profile.hResponse?.headers.get('content-type') ?? '';
        return (contentType.indexOf('json') !== -1 ||
            contentType.indexOf('text') !== -1 ||
            contentType.indexOf('xml') !== -1) && profile.hResponse?.content.length > 0;
    }
    getViewableResponseBody(profile) {
        let content = profile.hResponse.content;
        if (content instanceof Buffer) {
            content = content.toString('utf8');
        }
        return this.htmlEntities(content);
    }
    htmlEntities(str) {
        return str.replace(/[\u00A0-\u9999<>\&]/g, (i) => {
            return '&#' + i.charCodeAt(0) + ';';
        });
    }
    /**
     * Renders a timeline of the given profile.
     *
     * @param {Profile} profile
     * @returns {Node}
     * @private
     */
    renderTimelineElementsOf(profile) {
        return (h("div", null,
            h("div", { id: "timelineHeader" },
                h("div", null, "0ms"),
                h("div", null,
                    (profile.totalTime / 1000).toFixed(3),
                    "ms")),
            h("div", { id: "timeline" }, this.createTimelineOf(profile).map(item => {
                return (h("div", { class: "item", style: { marginLeft: item.x + '%', width: item.w + '%' } },
                    h("div", { class: "label" },
                        h("span", null, item.t),
                        item.n)));
            }))));
    }
    /**
     * Creates a normalized timeline of the given profile.
     *
     * @param {Profile} profile
     * @returns {any[]}
     * @private
     */
    createTimelineOf(profile) {
        const timeStart = Math.min(...profile.timing.map(t => t.startedAt)), timeEnd = Math.max(...profile.timing.map(t => t.startedAt + t.time)), result = [];
        for (const timing of profile.timing) {
            result.push({
                x: this.convertRange(timing.startedAt, [timeStart, timeEnd], [0, 100]),
                w: this.convertRange(timeStart + timing.time, [timeStart, timeEnd], [0, 100]),
                n: timing.name,
                t: (timing.time / 1000).toFixed(3) + 'ms',
            });
        }
        return result.sort((a, b) => {
            return a.x < b.x ? -1 : 1;
        });
    }
    /**
     * Converts the scale of {value} from {r1} to {r2}.
     *
     * @param {number} value
     * @param {number[]} r1
     * @param {number[]} r2
     * @returns {number}
     * @private
     */
    convertRange(value, r1, r2) {
        return (value - r1[0]) * (r2[1] - r2[0]) / (r1[1] - r1[0]) + r2[0];
    }
    /**
     * Renders the common base document of the profiler.
     *
     * @param {Node}   content
     * @param {string} activeProfileId
     * @returns {Node}
     * @private
     */
    document(content, activeProfileId) {
        return (h("html", null,
            h("head", null,
                h("title", null, "Harmony Profiler"),
                h("meta", { charset: "UTF-8" }),
                h("style", null, this.getDocumentStylesheet())),
            h("body", null,
                h("header", null,
                    h("h1", null, "Harmony Profiler")),
                h("main", null,
                    h("aside", null, Array.from(this.profiler.profiles).reverse().map((profile) => {
                        return (h("a", { href: `/_profiler/${profile.id}`, class: { active: activeProfileId === profile.id } },
                            h("span", { class: "status" },
                                "[",
                                profile.request.method,
                                "]"),
                            h("span", { class: "status" },
                                "[",
                                profile.statusCode,
                                "]"),
                            profile.name,
                            h("span", null, profile.createdAt.toLocaleString())));
                    })),
                    h("section", null, content)))));
    }
    getDocumentStylesheet() {
        return `
        * { box-sizing: border-box; }
        ::-webkit-scrollbar {
            width: 12px;
        }
         
        ::-webkit-scrollbar-track {
            -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3); 
            border-radius: 0;
        }
         
        ::-webkit-scrollbar-thumb {
            border-radius: 0;
            -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.5); 
        }
        
        body,html {
            padding: 0;
            margin: 0;
            font-family: arial, sans-serif;
            font-size: 14px;
            color: #eee;
            background: #303030;
        }
        header {
            background: linear-gradient(to bottom, 0% #3a3a3a, 100% #3f3f3f);
            display: flex;
            flex-direction: row;
            width: 100%;
            height: 64px;
            padding: 15px;
        }
        header > h1 {
            padding: 0;
            margin: 0;
        }
        main {
            display: flex;
            flex-direction: row;
            width: 100%;
            height: calc(100vh - 64px);
        }
        main > aside {
            background: #303030;
            width: 400px;
            border-right: 1px solid #ccc;
            overflow-x: hidden;
            overflow-y: auto;
        }
        main > section {
            display: block;
            position: relative;
            width: 100%;
            height: 100%;
            border-top: 1px solid #666;
            overflow-x: hidden;
            overflow-y: scroll;
        }
        main > aside > a {
            display: block;
            max-width: 460px;
            padding: 10px 15px;
            border-top: 1px solid #666;
            text-decoration: none;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: #ddd;
        }
        main > aside > a:last-child {
            border-bottom: 1px solid #666;
        }
        main > aside > a:hover {
            background: #3a3a3a;
            cursor: pointer;
        }
        main > aside > a.active {
            background: #3a3a3a;
            font-weight: bold;
        }
        main > aside > a > span {
            display: block;
            font-size: 10px;
            font-weight: normal;
            color: #666;
        }
        main > aside > a > span.status {
            display: inline;
            font-size: 12px;
            font-weight: bold;
            color: #666;
            margin-right: 8px;
        }
        main > section > .title-message {
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 18px;
            color: #ddd;
            text-shadow: 1px 0 #555;
            text-align: center;
            width: 100%;
            height: 100%;
        }
        #app {
            padding: 20px;
        }
        #app > h1 {
            margin: 0;
            margin-bottom: 20px;
            color: #ddd;
        }
        #app > h1 > span {
            margin: 0 10px;
            color: #666;
        }
        #timeline {
            margin-bottom: 20px;
            width: 100%;
            padding: 10px;
            background: #303030;
            border: 1px solid #666;
            border-top: 0;
            position: relative;
            overflow-x: scroll;
        }
        #timeline > .item {
            position: relative;
            display: block;
            height: 4px;
            margin-bottom: 16px;
            color: #ccc;
            background: #ca6;
        }
        #timeline > .item > .label {
            position: absolute;
            font-family: arial, sans-serif;
            font-size: 9px;
            top: 4px;
            left: 0;
            white-space: nowrap;
            border-left: 2px solid #ca6;
            border-bottom: 1px dotted #ca6;
            padding-left: 2px;
            margin-right: 15px;
        }
        #timeline > .item > .label span {
            color: #999;
            margin-right: 6px;
        }
        #timelineHeader {
            display: flex;
            width: 100%;
            background: #3a3a3a;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            border: 1px solid #666;
            border-bottom: 0;
            font-family: arial, sans-serif;
            font-size: 10px;
            color: #ddd;
            padding: 10px;
        }
        h2 {
            margin: 0;
            padding: 0;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
            font-family: monospace;
            font-size: 11px;
            color: #ddd;
            background: #3a3a3a;
        }
        
        table .label {
            text-align: right;
            padding: 4px;
            border: 1px solid #666;
            white-space: nowrap;
        }
        table .value {
            padding: 4px;
            color: #fff;
            border: 1px solid #666;
            width: 99%;
        }
        table .table-header {
            border: 1px solid #666;
            padding: 4px;
            font-weight: bold;
            font-size: 12px;
            background: #444;
        }
        table table {
            margin: 0;
        }
        pre {
            padding: 4px;
            word-break: break-all;
        }
        `;
    }
}
__decorate([
    Route('/_profiler', { method: 'GET' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", HtmlResponse)
], ProfilerController.prototype, "indexAction", null);
__decorate([
    Route('/_profiler/:id', { method: 'GET' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Response)
], ProfilerController.prototype, "profileAction", null);

/* Byteshift Harmony                                                               _         _             __   _ _____
 *    A component-based HTTP server micro-framework                               | |__ _  _| |_ ___  ___ / /  (_) _/ /_
 *                                                                                | '_ \ || |  _/ -_|(_-</ _ \/ / _/ __/
 * (C)2020, Harold Iedema <harold@iedema.me>                                      |_.__/\_, |\__\___/___/_//_/_/_/ \__/
 * See LICENSE for licensing information                                                |__/             H A R M O N Y
 */
class RequestBody {
    raw;
    fields = new Bag();
    files = new Bag();
    constructor(raw, parts) {
        this.raw = raw;
        for (let part of parts) {
            this.addPartToBag(part, part.filename ? this.files : this.fields, !!part.filename);
        }
    }
    addPartToBag(part, bag, isFile) {
        const name = part.name;
        if (name.endsWith('[]')) {
            if (!bag.has(name)) {
                bag.set(name, []);
            }
            if (isFile) {
                bag.get(name).push({
                    name: name,
                    fileName: part.filename,
                    mimeType: part.type,
                    data: part.data,
                });
            }
            else {
                bag.get(name).push(part.data.toString());
            }
        }
        else {
            if (isFile) {
                bag.set(name, {
                    name: name,
                    fileName: part.filename,
                    mimeType: part.type,
                    data: part.data,
                });
            }
            else {
                bag.set(name, part.data.toString());
            }
        }
    }
}

function parse(multipartBodyBuffer, boundary) {
    let lastline = '';
    let header = '';
    let info = '';
    let state = 0;
    let buffer = [];
    const allParts = [];
    for (let i = 0; i < multipartBodyBuffer.length; i++) {
        const oneByte = multipartBodyBuffer[i];
        const prevByte = i > 0 ? multipartBodyBuffer[i - 1] : null;
        const newLineDetected = oneByte === 0x0a && prevByte === 0x0d ? true : false;
        const newLineChar = oneByte === 0x0a || oneByte === 0x0d ? true : false;
        if (!newLineChar) {
            lastline += String.fromCharCode(oneByte);
        }
        if (0 === state && newLineDetected) {
            if ('--' + boundary === lastline) {
                state = 1;
            }
            lastline = '';
        }
        else if (1 === state && newLineDetected) {
            header = lastline;
            state = 2;
            if (header.indexOf('filename') === -1) {
                state = 3;
            }
            lastline = '';
        }
        else if (2 === state && newLineDetected) {
            info = lastline;
            state = 3;
            lastline = '';
        }
        else if (3 === state && newLineDetected) {
            state = 4;
            buffer = [];
            lastline = '';
        }
        else if (4 === state) {
            if (lastline.length > boundary.length + 4) {
                lastline = '';
            } // mem save
            if ('--' + boundary === lastline) {
                const j = buffer.length - lastline.length;
                const part = buffer.slice(0, j - 1);
                const p = { header: header, info: info, part: part };
                allParts.push(process$1(p));
                buffer = [];
                lastline = '';
                state = 5;
                header = '';
                info = '';
            }
            else {
                buffer.push(oneByte);
            }
            if (newLineDetected) {
                lastline = '';
            }
        }
        else if (5 === state) {
            if (newLineDetected) {
                state = 1;
            }
        }
    }
    return allParts;
}
//  read the boundary from the content-type header sent by the http client
//  this value may be similar to:
//  'multipart/form-data; boundary=----WebKitFormBoundaryvm5A9tzU1ONaGP5B',
function getBoundary(header) {
    const items = header.split(';');
    if (items) {
        for (let i = 0; i < items.length; i++) {
            const item = String(items[i]).trim();
            if (item.indexOf('boundary') >= 0) {
                const k = item.split('=');
                return String(k[1]).trim();
            }
        }
    }
    return '';
}
function process$1(part) {
    // will transform this object:
    // { header: 'Content-Disposition: form-data; name="uploads[]"; filename="A.txt"',
    // info: 'Content-Type: text/plain',
    // part: 'AAAABBBB' }
    // into this one:
    // { filename: 'A.txt', type: 'text/plain', data: <Buffer 41 41 41 41 42 42 42 42> }
    const obj = function (str) {
        const k = str.split('=');
        const a = k[0].trim();
        const b = JSON.parse(k[1].trim());
        const o = {};
        Object.defineProperty(o, a, {
            value: b,
            writable: true,
            enumerable: true,
            configurable: true,
        });
        return o;
    };
    const header = part.header.split(';');
    const filenameData = header[2];
    let input = {};
    if (filenameData) {
        input = obj(filenameData);
        const contentType = part.info.split(':')[1].trim();
        Object.defineProperty(input, 'type', {
            value: contentType,
            writable: true,
            enumerable: true,
            configurable: true,
        });
    }
    Object.defineProperty(input, 'name', {
        value: header[1].split('=')[1].replace(/"/g, ''),
        writable: true,
        enumerable: true,
        configurable: true,
    });
    Object.defineProperty(input, 'data', {
        value: Buffer.from(part.part),
        writable: true,
        enumerable: true,
        configurable: true
    });
    return input;
}

/* Byteshift Harmony                                                               _         _             __   _ _____
 *    A component-based HTTP server micro-framework                               | |__ _  _| |_ ___  ___ / /  (_) _/ /_
 *                                                                                | '_ \ || |  _/ -_|(_-</ _ \/ / _/ __/
 * (C)2020, Harold Iedema <harold@iedema.me>                                      |_.__/\_, |\__\___/___/_//_/_/_/ \__/
 * See LICENSE for licensing information                                                |__/             H A R M O N Y
 */
class RequestBodyDecoder {
    maxUploadSize;
    constructor(maxUploadSize) {
        this.maxUploadSize = maxUploadSize;
    }
    /**
     * Attempts to deserialize the request body into data suitable for a Bag.
     *
     * If this process fails, the body is most likely uploaded content like
     * a binary file.
     */
    async decode(req, res) {
        const body = await this.getRequestBody(req, res);
        const type = (req.headers['content-type'] || '');
        if (type.toLowerCase().startsWith('multipart/form-data')) {
            return this.parseMultipartFormData(res, type, body);
        }
        if (type.toLowerCase().startsWith('application/x-www-form-urlencoded')) {
            return this.parseFormUrlEncoded(res, body);
        }
        return new RequestBody(body, []);
    }
    /**
     * Parses the given body as a multipart/form-data payload.
     *
     * @param {RawHttpResponse} res
     * @param {string} type
     * @param {Buffer} body
     * @private
     */
    parseMultipartFormData(res, type, body) {
        return new RequestBody(body, parse(body, getBoundary(type)));
    }
    /**
     * Parses the given body as a x-www-form-urlencoded payload.
     *
     * @param {RawHttpResponse} res
     * @param {Buffer} body
     * @returns {RequestBody}
     * @private
     */
    parseFormUrlEncoded(res, body) {
        try {
            const data = querystring__namespace.decode(body.toString());
            const parts = [];
            Object.keys(data).forEach((key) => {
                parts.push({
                    name: key,
                    data: Buffer.from(data[key]),
                });
            });
            return new RequestBody(body, parts);
        }
        catch (e) {
            res.writeHead(413);
            res.end();
        }
    }
    /**
     * Wait for the request to complete, then return the request body.
     *
     * Sends an HTTP 413 status back to the client if the request body exceeds
     * the maximum upload size.
     *
     * @param {IncomingMessage} req
     * @param {RawHttpResponse} res
     * @returns {Promise<Buffer>}
     * @private
     */
    getRequestBody(req, res) {
        let body = [], size = 0;
        return new Promise((resolve, reject) => {
            req.on('data', (chunk) => {
                size += chunk.length;
                if (size > this.maxUploadSize) {
                    res.writeHead(413);
                    res.end();
                    req.socket.destroy();
                    reject('Upload size too big.');
                }
                body.push(chunk);
            }).on('end', () => {
                resolve(Buffer.concat(body));
            }).on('error', (err) => {
                reject(err);
            });
        });
    }
}

/* Byteshift Harmony                                                               _         _             __   _ _____
 *    A component-based HTTP server micro-framework                               | |__ _  _| |_ ___  ___ / /  (_) _/ /_
 *                                                                                | '_ \ || |  _/ -_|(_-</ _ \/ / _/ __/
 * (C)2020, Harold Iedema <harold@iedema.me>                                      |_.__/\_, |\__\___/___/_//_/_/_/ \__/
 * See LICENSE for licensing information                                                |__/             H A R M O N Y
 */
class AbstractHttpServer {
    server;
    options;
    /**
     * @inheritDoc
     */
    on(eventName, callback) {
        this.server.on(eventName, callback);
    }
    /**
     * @inheritDoc
     */
    once(eventName, callback) {
        this.server.once(eventName, callback);
    }
    /**
     * @inheritDoc
     */
    off(eventName, callback) {
        this.server.off(eventName, callback);
    }
    /**
     * @inheritDoc
     */
    start() {
        this.server.listen(this.options.port);
    }
}

/* Byteshift Harmony                                                               _         _             __   _ _____
 *    A component-based HTTP server micro-framework                               | |__ _  _| |_ ___  ___ / /  (_) _/ /_
 *                                                                                | '_ \ || |  _/ -_|(_-</ _ \/ / _/ __/
 * (C)2020, Harold Iedema <harold@iedema.me>                                      |_.__/\_, |\__\___/___/_//_/_/_/ \__/
 * See LICENSE for licensing information                                                |__/             H A R M O N Y
 */
const DefaultOptions = {
    httpVersion: 1,
    port: 8000,
    enableHttps: false,
    httpsOptions: {},
};

/* Byteshift Harmony                                                               _         _             __   _ _____
 *    A component-based HTTP server micro-framework                               | |__ _  _| |_ ___  ___ / /  (_) _/ /_
 *                                                                                | '_ \ || |  _/ -_|(_-</ _ \/ / _/ __/
 * (C)2020, Harold Iedema <harold@iedema.me>                                      |_.__/\_, |\__\___/___/_//_/_/_/ \__/
 * See LICENSE for licensing information                                                |__/             H A R M O N Y
 */
class Http1Server extends AbstractHttpServer {
    handler;
    constructor(options, handler) {
        super();
        this.handler = handler;
        this.options = Object.assign({}, DefaultOptions, options);
        this.server = options.enableHttps
            ? https__default["default"].createServer(options.httpsOptions, this.handle.bind(this))
            : http__default["default"].createServer(this.handle.bind(this));
        // Apply SNI configuration.
        if (options.sni && typeof options.sni === 'object') {
            if (options.enableHttps === false) {
                console.warn('SNI configuration is ignored because HTTPS is disabled.');
            }
            else {
                Object.keys(options.sni).forEach((hostname) => {
                    this.server.addContext(hostname, options.sni[hostname]);
                });
            }
        }
    }
    /**
     * @inheritDoc
     */
    onUpgradeRequest(callback) {
        this.server.on('upgrade', (req, socket) => {
            callback(new RawHttpRequest({ http1: req }), socket);
        });
    }
    /**
     * Handles an incoming HTTP/1 connection.
     *
     * @param {IncomingMessage} req
     * @param {ServerResponse} res
     * @private
     */
    handle(req, res) {
        const rawRequest = new RawHttpRequest({ http1: req }), rawResponse = new RawHttpResponse({ http1: res });
        this.handler(rawRequest, rawResponse);
    }
}

/* Byteshift Harmony                                                               _         _             __   _ _____
 *    A component-based HTTP server micro-framework                               | |__ _  _| |_ ___  ___ / /  (_) _/ /_
 *                                                                                | '_ \ || |  _/ -_|(_-</ _ \/ / _/ __/
 * (C)2020, Harold Iedema <harold@iedema.me>                                      |_.__/\_, |\__\___/___/_//_/_/_/ \__/
 * See LICENSE for licensing information                                                |__/             H A R M O N Y
 */
class Http2Server extends AbstractHttpServer {
    handler;
    constructor(options, handler) {
        super();
        this.handler = handler;
        this.options = Object.assign({}, DefaultOptions, options);
        if (!this.options.httpsOptions?.key) {
            throw new Error('HTTPS must be enabled when using the HTTP/2 server.');
        }
        this.server = http2.createSecureServer({
            ...this.options.httpsOptions,
            SNICallback: this.handleSNI.bind(this),
            // The 'allowHTTP1' option is required for WebSocket functionality.
            // See {@link https://github.com/nodejs/node/issues/31695} for more
            // info and links to related open issues.
            allowHTTP1: true,
        }, this.handle.bind(this));
    }
    /**
     * @inheritDoc
     */
    onUpgradeRequest(callback) {
        this.server.on('upgrade', (req, socket) => {
            callback(new RawHttpRequest({ http2: req }), socket);
        });
    }
    /**
     * Handles an incoming HTTP/2 request.
     *
     * @param {Http2ServerRequest} req
     * @param {Http2ServerResponse} res
     * @private
     */
    handle(req, res) {
        const rawRequest = new RawHttpRequest({ http2: req }), rawResponse = new RawHttpResponse({ http2: res });
        this.handler(rawRequest, rawResponse);
    }
    /**
     * Invoked if the client supports SNI TLS extension. Two arguments
     * will be passed when called: servername and cb. This method should
     * invoke cb(null, ctx), where ctx is a SecureContext instance.
     * (tls.createSecureContext(...) can be used to get a proper
     * SecureContext.) If SNICallback wasn't provided the default callback
     * with high-level API will be used instead.
     *
     * @param {string} servername
     * @param {(err: (Error | null), ctx?: SecureContext) => void} cb
     * @private
     */
    handleSNI(servername, cb) {
        if (!this.options.sni[servername]) {
            return cb(null);
        }
        cb(null, tls.createSecureContext(this.options.sni[servername]));
    }
}

/* Byteshift Harmony                                                               _         _             __   _ _____
 *    A component-based HTTP server micro-framework                               | |__ _  _| |_ ___  ___ / /  (_) _/ /_
 *                                                                                | '_ \ || |  _/ -_|(_-</ _ \/ / _/ __/
 * (C)2020, Harold Iedema <harold@iedema.me>                                      |_.__/\_, |\__\___/___/_//_/_/_/ \__/
 * See LICENSE for licensing information                                                |__/             H A R M O N Y
 */
class InMemoryStorage {
    storage = new Map();
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
    data;
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
    sessionStorage;
    cookieName;
    sessionData = new Map();
    constructor(sessionStorage, cookieName) {
        this.sessionStorage = sessionStorage;
        this.cookieName = cookieName;
    }
    /**
     * Invoked when a request was received from the browser.
     *
     * @param {RequestEvent} event
     */
    async onRequest(event) {
        let _id = event.request.cookies.get(this.cookieName);
        if (!_id) {
            _id = this.generateSessionId();
            event.request.cookies.set(this.cookieName, _id);
        }
        this.sessionData.set(_id, new Session(_id ? await this.sessionStorage.get(_id) : '{}'));
        event.session = this.sessionData.get(_id);
    }
    /**
     * Invoked right before the response is sent back to the browser.
     *
     * @param {ResponseEvent} event
     */
    async onResponse(event) {
        const sessionId = event.request.cookies.get(this.cookieName);
        await this.sessionStorage.set(sessionId, this.sessionData.get(sessionId).toString());
        event.response.cookies.set(this.cookieName, sessionId, 0);
    }
    /**
     * Returns a Session instance by the given request.
     *
     * @param {Request} request
     * @returns {Session | undefined}
     */
    getSessionByRequest(request) {
        const _id = request.cookies.get(this.cookieName);
        if (!_id) {
            return undefined;
        }
        return this.sessionData.get(_id);
    }
    /**
     * Returns a random session id.
     *
     * @returns {string}
     * @private
     */
    generateSessionId() {
        const generatedSessionId = [...Array(64)].map(_ => (~~(Math.random() * 36)).toString(36)).join('');
        if (this.sessionData.has(generatedSessionId)) {
            return this.generateSessionId();
        }
        return generatedSessionId;
    }
}

/* Byteshift Harmony                                                               _         _             __   _ _____
 *    A component-based HTTP server micro-framework                               | |__ _  _| |_ ___  ___ / /  (_) _/ /_
 *                                                                                | '_ \ || |  _/ -_|(_-</ _ \/ / _/ __/
 * (C)2020, Harold Iedema <harold@iedema.me>                                      |_.__/\_, |\__\___/___/_//_/_/_/ \__/
 * See LICENSE for licensing information                                                |__/             H A R M O N Y
 */
class StaticAssetHandler {
    directories;
    requestEventListeners = [];
    responseEventListeners = [];
    lookupMimeType;
    defaultMimeTypes = {
        txt: 'text/plain',
        html: 'text/html',
        js: 'text/javascript',
        css: 'text/css',
        gif: 'image/gif',
        png: 'image/png',
        svg: 'image/svg',
        json: 'application/json',
    };
    constructor(directories, lookupMimeType) {
        this.directories = directories;
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
        const mimeType = await this.lookupMimeType(path__default["default"].extname(fileName).replace(/^\./, '').toLowerCase());
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
        const response = new Response(fs__default["default"].readFileSync(fileName), exports.HttpStatus.OK, mimeType);
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
        // Cancel further event propagation, since we've handled this one.
        return false;
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
            let fileName = path__default["default"].resolve(directory, name.replace(/^\//, ''));
            // Security measurement: Ensure the resolved file name is contained
            // within a public directory, and not above it. If a user tries to
            // fetch a file from a parent directory, we'll just pretend it
            // doesn't exist.
            if (false === fileName.toLowerCase().startsWith(directory.toLowerCase())) {
                continue;
            }
            if (fs__default["default"].existsSync(fileName) && !fs__default["default"].statSync(fileName).isDirectory()) {
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
    templateDirectories;
    renderEventListeners = [];
    constructor(templateDirectories) {
        this.templateDirectories = templateDirectories;
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
            const fileName = path__default["default"].resolve(directory, name);
            if (fs__namespace.existsSync(fileName)) {
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
    options;
    router;
    server;
    requestDecoder;
    sessionManager;
    staticAssetHandler;
    templateManager;
    profiler;
    errorEventListeners = [];
    requestEventListeners = [];
    responseEventListeners = [];
    upgradeEventListeners = [];
    typedControllerArguments = new Map();
    compressionOptions = { enabled: false, minSize: 1024 };
    constructor(options) {
        this.options = options;
        if (undefined === options.httpVersion) {
            options.httpVersion = 1;
        }
        this.profiler = new Profiler(!!options.profiler?.enabled, options.profiler?.maxProfiles ?? 50);
        this.router = new Router();
        this.server = options.httpVersion === 1 ? new Http1Server(options, this.handle.bind(this)) : new Http2Server(options, this.handle.bind(this));
        if (options.compression) {
            this.compressionOptions = options.compression;
        }
        this.requestDecoder = new RequestBodyDecoder(options.maxUploadSize || (1048576));
        // Register default error page handler with the lowest priority.
        this.registerErrorEventListener((new HarmonyErrorPage()).onServerError, -Infinity);
        // Register controllers.
        if (options.controllers) {
            options.controllers.forEach((controllerClass) => this.registerController(controllerClass));
        }
        // Register profiler controller if the profiler is enabled.
        if (options.profiler?.enabled) {
            this.registerController(ProfilerController);
        }
        // Register a firewall event listener for the firewall.
        if (typeof options.profiler?.firewall === 'function') {
            this.registerRequestEventListener(async (e) => {
                if (e.route._controller[0] === ProfilerController && !await options.profiler.firewall(e)) {
                    e.setResponse(new Response('', exports.HttpStatus.UNAUTHORIZED));
                }
            });
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
        if (options.upgradeEventListeners) {
            options.upgradeEventListeners.forEach(e => this.registerUpgradeEventListener(e.callback, e.priority));
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
        this.server.on('error', () => {
            // Binding to the 'error' event prevents the server from crashing
            // when a socket-error occurs. These typically occur when the
            // client unexpectedly terminates the connection while we're still
            // trying to read data from the socket.
            /* NO-OP */
        });
        this.server.on('connection', (sock) => {
            sock.on('error', () => {
                /* NO-OP */
            });
        });
        // Handle upgrade events.
        this.server.onUpgradeRequest((req, socket) => {
            try {
                const request = new Request(req, new RequestBody(Buffer.from(''), []), new Profile(req));
                const event = new UpgradeEvent(request, socket, this.sessionManager ? this.sessionManager.getSessionByRequest(request) : undefined);
                for (let handler of this.upgradeEventListeners) {
                    if (handler.callback(event)) {
                        return;
                    }
                }
            }
            catch (e) {
                // Don't let the server crash on any errors here.
                console.warn(e);
            }
        });
    }
    /**
     * Starts the HTTP server.
     */
    start() {
        this.server.start();
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
     * Registers a JSX element that can be used throughout any JSX template.
     * This is the equivalent of {@link customElements.define} but for SSR
     * rendering in Harmony.
     *
     * Note that these elements are rendered server-side and therefore provide
     * no reactivity functionality.
     *
     * @param {string} tagName
     * @param {HarmonyElementFactory} factory
     * @returns {this}
     */
    registerElement(tagName, factory) {
        HarmonyElements.factories.set(tagName, factory);
        return this;
    }
    /**
     * Returns the HTTP server wrapper of this Harmony instance.
     *
     * @returns {http.Server}
     */
    get httpServer() {
        return this.server;
    }
    /**
     * Adds a secure context if the request hostname matches the given hostname (or wildcard).
     *
     * @param {string} hostname
     * @param {tls.SecureContextOptions} options
     */
    addServerNameIdentificationContext(hostname, options) {
        if (this.server instanceof https__default["default"].Server) {
            this.server.addContext(hostname, options);
            return;
        }
        throw new Error('Unable to add SNI configuration while HTTPS is disabled.');
    }
    /**
     * Returns the session associated with the given request.
     *
     * @param {Request} request
     * @returns {Session}
     */
    getSessionByRequest(request) {
        if (!this.sessionManager) {
            throw new Error('Session management is disabled.');
        }
        return this.sessionManager.getSessionByRequest(request);
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
     * Registers a typed controller method argument.
     *
     * The given callback is invoked when a controller method contains a typed
     * argument with the given type. The return value of the callback is then
     * injected in the controller method. This works similarly to the default
     * Request and Session typed parameters, but for custom objects.
     *
     * @param {*} type
     * @param {(request: Request) => any} callback
     */
    registerTypedControllerArgument(type, callback) {
        this.typedControllerArguments.set(type, callback);
    }
    /**
     * Registers an error event listener.
     */
    registerErrorEventListener(callback, priority = 0) {
        this.errorEventListeners.push({ callback: callback, priority: priority });
        this.errorEventListeners = this.errorEventListeners.sort((a, b) => a.priority > b.priority ? -1 : 1);
    }
    /**
     * Registers an upgrade event listener.
     */
    registerUpgradeEventListener(callback, priority = 0) {
        this.upgradeEventListeners.push({ callback: callback, priority: priority });
        this.upgradeEventListeners = this.upgradeEventListeners.sort((a, b) => a.priority > b.priority ? -1 : 1);
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
     * @param {RawHttpRequest} req
     * @param {RawHttpResponse} res
     */
    async handle(req, res) {
        let body, request, route;
        const profile = new Profile(req);
        profile.start('Decode request');
        try {
            body = await this.requestDecoder.decode(req, res);
            request = new Request(req, body, profile);
            route = this.router.findByRequest(request);
            profile.hRequest = request;
            profile.hRoute = route;
        }
        catch (e) {
            // If anything goes wrong during the request build-up phase, the
            // client most likely terminated the connection. Ignore everything
            // at this point and return.
            return;
        }
        profile.stop('Decode request');
        profile.start('Controller');
        let controller;
        let hasSentResponse = false;
        try {
            if (!route) {
                throw new NotFoundError();
            }
            if (route._controller[0] === ProfilerController) {
                controller = new ProfilerController(this.profiler);
            }
            else {
                controller = this.options.serviceContainer
                    ? this.options.serviceContainer.get(route._controller[0])
                    : new route._controller[0]();
                // Support async service containers.
                if (typeof controller.then === 'function') {
                    controller = await controller;
                }
            }
            if (typeof controller[route._controller[1]] !== 'function') {
                throw new InternalServerError('Method "' + route._controller[1] + '" is not an accessible method in this controller.');
            }
            // Fire the 'request' event to allow external services to listen
            // for incoming requests before the controller method is fired.
            // This would allow firewall type of functionality to exist, or
            // generic services that serve static content.
            const requestEvent = new RequestEvent(request, route, this.sessionManager ? this.sessionManager.getSessionByRequest(request) : undefined);
            let stopPropagation = false, response;
            profile.start('Request event handlers');
            for (let listener of this.requestEventListeners) {
                stopPropagation = false === await listener.callback(requestEvent);
                if (!response && requestEvent.hasResponse() && !requestEvent.getResponse().isSent) {
                    response = requestEvent.getResponse();
                }
                if (stopPropagation) {
                    break;
                }
            }
            profile.stop('Request event handlers');
            // Only handle the controller action if a request listener did not
            // send a response yet.
            if (!response) {
                // Handle the actual controller method.
                response = await this.handleControllerAction(controller, route._controller[1], route, request, profile);
                profile.start('Handle controller response');
                // A controller method must return a Response object, unless it
                // is annotated with the @Template decorator.
                if (!(response instanceof Response)) {
                    if (controller.__TEMPLATES__ && controller.__TEMPLATES__[route._controller[1]]) {
                        const session = this.sessionManager
                            ? this.sessionManager.getSessionByRequest(request)
                            : undefined;
                        response = await this.templateManager.render(request, session, controller.__TEMPLATES__[route._controller[1]], response);
                    }
                    // Do we have a response now?
                    if (!(response instanceof Response)) {
                        throw new InternalServerError('Method "' + route._controller[1] + '" did not return a Response object.');
                    }
                }
                profile.stop('Handle controller response');
            }
            profile.stop('Controller');
            profile.hResponse = response;
            // Fire the 'response' event to allow external services to modify
            // the returned response. For example, setting specific cookies or
            // other headers.
            profile.start('Response event handlers');
            const responseEvent = new ResponseEvent(request, route, response, this.sessionManager ? this.sessionManager.getSessionByRequest(request) : undefined);
            for (let listener of this.responseEventListeners) {
                if (false === await listener.callback(responseEvent)) {
                    break;
                }
            }
            if (!response.isSent) {
                profile.hResponse = response;
                response.send(request, res, this.compressionOptions);
                hasSentResponse = true;
            }
            profile.stop('Response event handlers');
        }
        catch (e) {
            profile.stop('Controller');
            profile.start('Handle error');
            // Fire the 'error' event to allow external services to listen act
            // on certain types of errors, for example rendering a custom 404
            // or 500 page.
            const errorEvent = new ErrorEvent(e, request, controller, route ? route._controller[1] : undefined);
            for (let listener of this.errorEventListeners) {
                const stopPropagation = false === await listener.callback(errorEvent);
                // Send the response if the listener defined one and if we
                // haven't already sent one to the client.
                if (false === hasSentResponse && errorEvent.hasResponse()) {
                    const response = errorEvent.getResponse();
                    if (false === response.isSent) {
                        response.send(request, res, this.compressionOptions);
                        hasSentResponse = true;
                        profile.hResponse = response;
                    }
                }
                // Stop propagating if the listener returned false explicitly.
                if (stopPropagation) {
                    break;
                }
            }
            profile.stop('Handle error');
        }
        if (!(route && route._controller[0] === ProfilerController)) {
            this.profiler.save(profile);
        }
    }
    /**
     * Handles the controller method.
     *
     * @param controller
     * @param {string} method
     * @param {IRoute} route
     * @param {Request} request
     * @param {Profile} profile
     * @returns {Promise<Response>}
     * @private
     */
    async handleControllerAction(controller, method, route, request, profile) {
        const fn = controller[method];
        const args = [];
        const params = Object.values(request.parameters.all);
        profile.start('Resolve controller method arguments');
        const typedArguments = new Map();
        typedArguments.set(Request, (r) => r);
        typedArguments.set(Session, (r) => {
            if (!this.sessionManager) {
                throw new InternalServerError('Controller attempted to access Session, but sessions are disabled.');
            }
            return this.sessionManager.getSessionByRequest(request);
        });
        this.typedControllerArguments.forEach((callback, key) => {
            typedArguments.set(key, callback);
        });
        for (let i = 0; i < route.signature.length; i++) {
            const methodArg = route.signature[i];
            if (typedArguments.has(methodArg.type)) {
                args.push(await (typedArguments.get(methodArg.type))(request));
                params.unshift(null);
            }
            else {
                args.push(params[i]);
            }
        }
        profile.stop('Resolve controller method arguments');
        profile.start('Invoke controller method');
        const response = await fn.bind(controller)(...args);
        profile.stop('Invoke controller method');
        return response;
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

exports.AccessDeniedError = AccessDeniedError;
exports.Bag = Bag;
exports.Cookie = Cookie;
exports.CookieBag = CookieBag;
exports.ErrorEvent = ErrorEvent;
exports.Harmony = Harmony;
exports.HtmlResponse = HtmlResponse;
exports.InternalServerError = InternalServerError;
exports.JsonResponse = JsonResponse;
exports.Node = Node;
exports.NotFoundError = NotFoundError;
exports.RawHttpRequest = RawHttpRequest;
exports.RawHttpResponse = RawHttpResponse;
exports.RedirectResponse = RedirectResponse;
exports.RenderTemplateEvent = RenderTemplateEvent;
exports.Request = Request;
exports.RequestEvent = RequestEvent;
exports.Response = Response;
exports.ResponseEvent = ResponseEvent;
exports.Route = Route;
exports.Router = Router;
exports.ServerError = ServerError;
exports.Session = Session;
exports.StaticRequestEvent = StaticRequestEvent;
exports.StaticResponseEvent = StaticResponseEvent;
exports.Template = Template;
exports.UpgradeEvent = UpgradeEvent;
exports.h = h;
//# sourceMappingURL=index.js.map
