/* Byteshift Harmony                                                               _         _             __   _ _____
 *    A component-based HTTP server micro-framework                               | |__ _  _| |_ ___  ___ / /  (_) _/ /_
 *                                                                                | '_ \ || |  _/ -_|(_-</ _ \/ / _/ __/
 * (C)2020, Harold Iedema <harold@iedema.me>                                      |_.__/\_, |\__\___/___/_//_/_/_/ \__/
 * See LICENSE for licensing information                                                |__/             H A R M O N Y
 */
'use strict';

import {Bag}             from '../Bag';
import {CookieBag}       from '../Cookie/CookieBag';
import {Request}         from '../Request/Request';
import {RawHttpResponse} from '../Server/RawHttpResponse';
import {Compression}     from './Compression';

export class Response
{
    private _code: HttpStatus         = HttpStatus.OK;
    private _content: string | Buffer = '';
    private _isSent: boolean          = false;
    private _headers: Bag<string>     = new Bag<string>();
    private _cookies: CookieBag       = new CookieBag();

    constructor(content: string | Buffer, statusCode: HttpStatus = HttpStatus.OK, contentType: string = 'text/plain')
    {
        this.content     = content;
        this.contentType = contentType;
        this.statusCode  = statusCode;
    }

    /**
     * Returns the cookie bag associated with this response.
     *
     * @returns {CookieBag}
     */
    public get cookies(): CookieBag
    {
        return this._cookies;
    }

    /**
     * Returns the header bag associated with this response.
     *
     * @returns {Bag<string>}
     */
    public get headers(): Bag<string>
    {
        return this._headers;
    }

    /**
     * Sets the HTTP status code of this response.
     *
     * @param {number} code
     */
    public set statusCode(code: HttpStatus)
    {
        this._code = code;
    }

    public get statusCode(): HttpStatus
    {
        return this._code;
    }

    /**
     * Sets the Content-Type header of the response.
     *
     * @param {string} contentType
     */
    public set contentType(contentType: string)
    {
        this._headers.set('Content-Type', contentType);
    }

    /**
     * Sets the content of this response to be sent to the client.
     *
     * @param {string | Buffer} content
     */
    public set content(content: string | Buffer)
    {
        this._content = content;
    }

    public get content(): string | Buffer
    {
        return this._content;
    }

    /**
     * Returns true if this response is sent to the client.
     *
     * @returns {boolean}
     */
    public get isSent(): boolean
    {
        return this._isSent;
    }

    /**
     * Sends this request to the client.
     */
    public send(
        request: Request,
        response: RawHttpResponse,
        compressionOptions: { enabled: boolean, minSize?: number },
    ): void
    {
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

export enum HttpStatus
{
    CONTINUE                             = 100,
    SWITCHING_PROTOCOLS                  = 101,
    PROCESSING                           = 102, // RFC2518
    EARLY_HINTS                          = 103, // RFC8297
    OK                                   = 200,
    CREATED                              = 201,
    ACCEPTED                             = 202,
    NON_AUTHORITATIVE_INFORMATION        = 203,
    NO_CONTENT                           = 204,
    RESET_CONTENT                        = 205,
    PARTIAL_CONTENT                      = 206,
    MULTI_STATUS                         = 207, // RFC4918
    ALREADY_REPORTED                     = 208, // RFC5842
    IM_USED                              = 226, // RFC3229
    MULTIPLE_CHOICES                     = 300,
    MOVED_PERMANENTLY                    = 301,
    FOUND                                = 302,
    SEE_OTHER                            = 303,
    NOT_MODIFIED                         = 304,
    USE_PROXY                            = 305,
    RESERVED                             = 306,
    TEMPORARY_REDIRECT                   = 307,
    PERMANENTLY_REDIRECT                 = 308, // RFC7238
    BAD_REQUEST                          = 400,
    UNAUTHORIZED                         = 401,
    PAYMENT_REQUIRED                     = 402,
    FORBIDDEN                            = 403,
    NOT_FOUND                            = 404,
    METHOD_NOT_ALLOWED                   = 405,
    NOT_ACCEPTABLE                       = 406,
    PROXY_AUTHENTICATION_REQUIRED        = 407,
    REQUEST_TIMEOUT                      = 408,
    CONFLICT                             = 409,
    GONE                                 = 410,
    LENGTH_REQUIRED                      = 411,
    PRECONDITION_FAILED                  = 412,
    REQUEST_ENTITY_TOO_LARGE             = 413,
    REQUEST_URI_TOO_LONG                 = 414,
    UNSUPPORTED_MEDIA_TYPE               = 415,
    REQUESTED_RANGE_NOT_SATISFIABLE      = 416,
    EXPECTATION_FAILED                   = 417,
    I_AM_A_TEAPOT                        = 418, // RFC2324
    MISDIRECTED_REQUEST                  = 421, // RFC7540
    UNPROCESSABLE_ENTITY                 = 422, // RFC4918
    LOCKED                               = 423, // RFC4918
    FAILED_DEPENDENCY                    = 424, // RFC4918
    TOO_EARLY                            = 425, // RFC-ietf-httpbis-replay-04
    UPGRADE_REQUIRED                     = 426, // RFC2817
    PRECONDITION_REQUIRED                = 428, // RFC6585
    TOO_MANY_REQUESTS                    = 429, // RFC6585
    REQUEST_HEADER_FIELDS_TOO_LARGE      = 431, // RFC6585
    UNAVAILABLE_FOR_LEGAL_REASONS        = 451,
    INTERNAL_SERVER_ERROR                = 500,
    NOT_IMPLEMENTED                      = 501,
    BAD_GATEWAY                          = 502,
    SERVICE_UNAVAILABLE                  = 503,
    GATEWAY_TIMEOUT                      = 504,
    VERSION_NOT_SUPPORTED                = 505,
    VARIANT_ALSO_NEGOTIATES_EXPERIMENTAL = 506, // RFC2295
    INSUFFICIENT_STORAGE                 = 507, // RFC4918
    LOOP_DETECTED                        = 508, // RFC5842
    NOT_EXTENDED                         = 510, // RFC2774
    NETWORK_AUTHENTICATION_REQUIRED      = 511, // RFC6585
}
