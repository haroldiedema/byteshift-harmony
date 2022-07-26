/// <reference types="node" />
/// <reference types="node" />
import { OutgoingHttpHeaders, ServerResponse } from 'http';
import { Http2ServerResponse } from 'http2';
import { HttpStatus } from '../Response/Response';
export declare class RawHttpResponse {
    private readonly r;
    constructor(r: {
        http1?: ServerResponse;
        http2?: Http2ServerResponse;
    });
    /**
     * Sets a single header value for the header object.
     *
     * @param {string} name
     * @param {number|string|ReadonlyArray<string>} value Header value
     */
    setHeader(name: string, value: number | string | ReadonlyArray<string>): this;
    /**
     * Writes the given chunk to the response stream.
     *
     * @param chunk
     * @param {(error: (Error | null | undefined)) => void} callback
     * @returns {this}
     */
    write(chunk: any, callback?: (error: Error | null | undefined) => void): this;
    /**
     * Returns true if headers were already sent to the client.
     *
     * @returns {boolean}
     */
    get headersSent(): boolean;
    /**
     * Writes the HTTP header to the client.
     *
     * @param {HttpStatus} statusCode
     * @param {OutgoingHttpHeaders} headers
     * @returns {this}
     */
    writeHead(statusCode: HttpStatus, headers?: OutgoingHttpHeaders): this;
    end(cb?: () => void): this;
}
