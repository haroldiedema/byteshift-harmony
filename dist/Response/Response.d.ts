/// <reference types="node" />
import { Bag } from '../Bag';
import { CookieBag } from '../Cookie/CookieBag';
import { ServerResponse } from 'http';
export declare class Response {
    private _code;
    private _content;
    private _isSent;
    private _headers;
    private _cookies;
    constructor(content: string | Buffer, statusCode?: HttpStatus, contentType?: string);
    /**
     * Returns the cookie bag associated with this response.
     *
     * @returns {CookieBag}
     */
    get cookies(): CookieBag;
    /**
     * Returns the header bag associated with this response.
     *
     * @returns {Bag<string>}
     */
    get headers(): Bag<string>;
    /**
     * Sets the HTTP status code of this response.
     *
     * @param {number} code
     */
    set statusCode(code: HttpStatus);
    get statusCode(): HttpStatus;
    /**
     * Sets the Content-Type header of the response.
     *
     * @param {string} contentType
     */
    set contentType(contentType: string);
    /**
     * Sets the content of this response to be sent to the client.
     *
     * @param {string | Buffer} content
     */
    set content(content: string | Buffer);
    get content(): string | Buffer;
    /**
     * Returns true if this response is sent to the client.
     *
     * @returns {boolean}
     */
    get isSent(): boolean;
    /**
     * Sends this request to the client.
     */
    send(response: ServerResponse): void;
}
export declare enum HttpStatus {
    CONTINUE = 100,
    SWITCHING_PROTOCOLS = 101,
    PROCESSING = 102,
    EARLY_HINTS = 103,
    OK = 200,
    CREATED = 201,
    ACCEPTED = 202,
    NON_AUTHORITATIVE_INFORMATION = 203,
    NO_CONTENT = 204,
    RESET_CONTENT = 205,
    PARTIAL_CONTENT = 206,
    MULTI_STATUS = 207,
    ALREADY_REPORTED = 208,
    IM_USED = 226,
    MULTIPLE_CHOICES = 300,
    MOVED_PERMANENTLY = 301,
    FOUND = 302,
    SEE_OTHER = 303,
    NOT_MODIFIED = 304,
    USE_PROXY = 305,
    RESERVED = 306,
    TEMPORARY_REDIRECT = 307,
    PERMANENTLY_REDIRECT = 308,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    PAYMENT_REQUIRED = 402,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    METHOD_NOT_ALLOWED = 405,
    NOT_ACCEPTABLE = 406,
    PROXY_AUTHENTICATION_REQUIRED = 407,
    REQUEST_TIMEOUT = 408,
    CONFLICT = 409,
    GONE = 410,
    LENGTH_REQUIRED = 411,
    PRECONDITION_FAILED = 412,
    REQUEST_ENTITY_TOO_LARGE = 413,
    REQUEST_URI_TOO_LONG = 414,
    UNSUPPORTED_MEDIA_TYPE = 415,
    REQUESTED_RANGE_NOT_SATISFIABLE = 416,
    EXPECTATION_FAILED = 417,
    I_AM_A_TEAPOT = 418,
    MISDIRECTED_REQUEST = 421,
    UNPROCESSABLE_ENTITY = 422,
    LOCKED = 423,
    FAILED_DEPENDENCY = 424,
    TOO_EARLY = 425,
    UPGRADE_REQUIRED = 426,
    PRECONDITION_REQUIRED = 428,
    TOO_MANY_REQUESTS = 429,
    REQUEST_HEADER_FIELDS_TOO_LARGE = 431,
    UNAVAILABLE_FOR_LEGAL_REASONS = 451,
    INTERNAL_SERVER_ERROR = 500,
    NOT_IMPLEMENTED = 501,
    BAD_GATEWAY = 502,
    SERVICE_UNAVAILABLE = 503,
    GATEWAY_TIMEOUT = 504,
    VERSION_NOT_SUPPORTED = 505,
    VARIANT_ALSO_NEGOTIATES_EXPERIMENTAL = 506,
    INSUFFICIENT_STORAGE = 507,
    LOOP_DETECTED = 508,
    NOT_EXTENDED = 510,
    NETWORK_AUTHENTICATION_REQUIRED = 511
}
