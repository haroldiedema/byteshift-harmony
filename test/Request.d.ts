/// <reference types="node" />
import { Bag } from '@/Bag';
import { IRoute } from '@/Router';
import { IncomingMessage } from 'http';
export declare class Request {
    private r;
    private readonly _clientIp;
    private readonly _method;
    private readonly _parameters;
    private readonly _headers;
    private readonly _cookies;
    private readonly _query;
    private readonly _path;
    constructor(r: IncomingMessage);
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
    get(name: string): any;
    /**
     * Returns the IP address of the client.
     *
     * @return {string}
     */
    get clientIp(): string;
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
