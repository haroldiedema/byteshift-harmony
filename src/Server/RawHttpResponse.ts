/* Byteshift Harmony                                                               _         _             __   _ _____
 *    A component-based HTTP server micro-framework                               | |__ _  _| |_ ___  ___ / /  (_) _/ /_
 *                                                                                | '_ \ || |  _/ -_|(_-</ _ \/ / _/ __/
 * (C)2020, Harold Iedema <harold@iedema.me>                                      |_.__/\_, |\__\___/___/_//_/_/_/ \__/
 * See LICENSE for licensing information                                                |__/             H A R M O N Y
 */
'use strict';

import {OutgoingHttpHeaders, ServerResponse} from 'http';
import {Http2ServerResponse}                 from 'http2';
import {HttpStatus}                          from '../Response/Response';

export class RawHttpResponse
{
    constructor(private readonly r: { http1?: ServerResponse, http2?: Http2ServerResponse })
    {
    }

    /**
     * Sets a single header value for the header object.
     *
     * @param {string} name
     * @param {number|string|ReadonlyArray<string>} value Header value
     */
    public setHeader(name: string, value: number | string | ReadonlyArray<string>): this
    {
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
    public write(chunk: any, callback?: (error: Error | null | undefined) => void): this
    {
        this.r.http1 ? this.r.http1.write(chunk, callback) : this.r.http2.write(chunk, callback);

        return this;
    }

    /**
     * Returns true if headers were already sent to the client.
     *
     * @returns {boolean}
     */
    public get headersSent(): boolean
    {
        return this.r.http1 ? this.r.http1.headersSent : this.r.http2.headersSent;
    }

    /**
     * Writes the HTTP header to the client.
     *
     * @param {HttpStatus} statusCode
     * @param {OutgoingHttpHeaders} headers
     * @returns {this}
     */
    public writeHead(statusCode: HttpStatus, headers?: OutgoingHttpHeaders): this
    {
        this.r.http1 ? this.r.http1.writeHead(statusCode, headers) : this.r.http2.writeHead(statusCode, headers);

        return this;
    }

    public end(cb?: () => void): this
    {
        this.r.http1 ? this.r.http1.end(cb) : this.r.http2.end(cb);

        return this;
    }
}
