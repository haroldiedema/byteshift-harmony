/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
import { IncomingHttpHeaders, IncomingMessage } from 'http';
import { Http2ServerRequest } from 'http2';
import { Socket } from 'net';
export declare class RawHttpRequest {
    private readonly r;
    /**
     * The request method as a string. Read-only. Examples: `'GET'`, `'DELETE'`.
     *
     * @type {string}
     */
    readonly method: string;
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
    readonly url: string;
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
    readonly headers: IncomingHttpHeaders;
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
    readonly socket: Socket;
    constructor(r: {
        http1?: IncomingMessage;
        http2?: Http2ServerRequest;
    });
    on(eventName: string, callback: (...args: any[]) => any): this;
    get http1Request(): IncomingMessage | undefined;
    get http2Request(): Http2ServerRequest | undefined;
}
