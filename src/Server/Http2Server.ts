/* Byteshift Harmony                                                               _         _             __   _ _____
 *    A component-based HTTP server micro-framework                               | |__ _  _| |_ ___  ___ / /  (_) _/ /_
 *                                                                                | '_ \ || |  _/ -_|(_-</ _ \/ / _/ __/
 * (C)2020, Harold Iedema <harold@iedema.me>                                      |_.__/\_, |\__\___/___/_//_/_/_/ \__/
 * See LICENSE for licensing information                                                |__/             H A R M O N Y
 */
'use strict';

import {IncomingMessage}                                                                from 'http';
import {createSecureServer, Http2SecureServer, Http2ServerRequest, Http2ServerResponse} from 'http2';
import {Socket}                                                                         from 'net';
import {createSecureContext, SecureContext}                                             from 'tls';
import {AbstractHttpServer}                                                             from './AbstractHttpServer';
import {DefaultOptions}                                                                 from './DefaultOptions';
import {IHttpServer}                                                                    from './IHttpServer';
import {IServerOptions}                                                                 from './IServerOptions';
import {RawHttpRequest}                                                                 from './RawHttpRequest';
import {RawHttpResponse}                                                                from './RawHttpResponse';

export class Http2Server extends AbstractHttpServer implements IHttpServer
{
    declare protected readonly server: Http2SecureServer;
    declare protected readonly options: IServerOptions;

    constructor(options: IServerOptions, private readonly handler: (req: RawHttpRequest, res: any) => void)
    {
        super();

        this.options = Object.assign({}, DefaultOptions, options);

        if (!this.options.httpsOptions?.key) {
            throw new Error('HTTPS must be enabled when using the HTTP/2 server.');
        }

        this.server = createSecureServer({
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
    public onUpgradeRequest(callback: (request: RawHttpRequest, socket: Socket) => void): void
    {
        this.server.on('upgrade', (req: Http2ServerRequest, socket: Socket) => {
            callback(new RawHttpRequest({http2: req}), socket);
        });
    }

    /**
     * Handles an incoming HTTP/2 request.
     *
     * @param {Http2ServerRequest} req
     * @param {Http2ServerResponse} res
     * @private
     */
    private handle(req: Http2ServerRequest, res: Http2ServerResponse): void
    {
        const rawRequest  = new RawHttpRequest({http2: req}),
              rawResponse = new RawHttpResponse({http2: res});

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
    private handleSNI(servername: string, cb: (err: Error | null, ctx?: SecureContext) => void): void
    {
        if (!this.options.sni[servername]) {
            return cb(null);
        }

        cb(null, createSecureContext(this.options.sni[servername]));
    }
}
