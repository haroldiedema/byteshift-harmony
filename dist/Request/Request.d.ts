/// <reference types="node" />
import { Bag } from '../Bag';
import { IRoute } from '../Router/Router';
import { IncomingMessage } from 'http';
import { IUploadedFile } from './IUploadedFile';
import { RequestBody } from './RequestBody';
export declare class Request {
    private r;
    private readonly _clientIp;
    private readonly _method;
    private readonly _parameters;
    private readonly _headers;
    private readonly _cookies;
    private readonly _query;
    private readonly _path;
    private readonly _post;
    private readonly _files;
    private readonly _body;
    private readonly _isSecure;
    constructor(r: IncomingMessage, body: RequestBody);
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
    get(name: string): any;
    /**
     * Returns the IP address of the client.
     *
     * @return {string}
     */
    get clientIp(): string;
    /**
     * Returns true if the incoming request came from a secure (HTTPS/TLS)
     * connection.
     *
     * @returns {boolean}
     */
    get isSecure(): boolean;
    /**
     * Returns the request path.
     *
     * @return {string}
     */
    get path(): string;
    /**
     * Returns the HTTP method in upper-case string representation.
     *
     * @return {string}
     */
    get method(): string;
    /**
     * Returns the cookie bag.
     *
     * @return {Bag}
     */
    get cookies(): Bag<string>;
    /**
     * Returns the headers bag.
     *
     * @return {Bag}
     */
    get headers(): Bag<string>;
    /**
     * Returns the query parameters bag.
     *
     * @return {Bag}
     */
    get query(): Bag<string | number>;
    /**
     * Returns the route parameters bag.
     *
     * @returns {Bag<string>}
     */
    get parameters(): Bag<string>;
    /**
     * Returns the POST-fields bag.
     *
     * @returns {Bag<string | string[]>}
     */
    get post(): Bag<string | string[]>;
    /**
     * Returns the files bag.
     *
     * @returns {Bag<IUploadedFile | IUploadedFile[]>}
     */
    get files(): Bag<IUploadedFile | IUploadedFile[]>;
    /**
     * Returns the request body as parsed JSON content.
     *
     * @returns {any}
     */
    get json(): any;
    /**
     * Returns the raw request body as a buffer.
     *
     * @returns {string}
     */
    get body(): Buffer;
    /**
     * Returns true if the given route matches this request.
     *
     * @param {IRoute} route
     * @return {boolean}
     */
    isMatchingRoute(route: IRoute): boolean;
    /**
     * @param {string} pattern
     * @return {{regExp: RegExp, namedParams: string[]}}
     * @private
     */
    private _parsePattern;
    /**
     * Parses a cookie header into a key-value object.
     *
     * @param {string} cookieString
     * @returns {{[p: string]: string}}
     * @private
     */
    private _parseCookies;
}
