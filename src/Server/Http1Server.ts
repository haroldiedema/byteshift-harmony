/* Byteshift Harmony                                                               _         _             __   _ _____
 *    A component-based HTTP server micro-framework                               | |__ _  _| |_ ___  ___ / /  (_) _/ /_
 *                                                                                | '_ \ || |  _/ -_|(_-</ _ \/ / _/ __/
 * (C)2020, Harold Iedema <harold@iedema.me>                                      |_.__/\_, |\__\___/___/_//_/_/_/ \__/
 * See LICENSE for licensing information                                                |__/             H A R M O N Y
 */
'use strict';

import http, {IncomingMessage, ServerResponse} from 'http';
import https                                   from 'https';
import {Socket}                                from 'net';
import {AbstractHttpServer}                    from './AbstractHttpServer';
import {DefaultOptions}                        from './DefaultOptions';
import {IHttpServer}                           from './IHttpServer';
import {IServerOptions}                        from './IServerOptions';
import {RawHttpRequest}                        from './RawHttpRequest';
import {RawHttpResponse}                       from './RawHttpResponse';

export class Http1Server extends AbstractHttpServer implements IHttpServer
{
    declare protected readonly server: http.Server | https.Server;
    declare protected readonly options: IServerOptions;

    constructor(options: IServerOptions, private readonly handler: (req: RawHttpRequest, res: any) => void)
    {
        super();

        this.options = Object.assign({}, DefaultOptions, options);
        this.server  = options.enableHttps
                       ? https.createServer(options.httpsOptions, this.handle.bind(this))
                       : http.createServer(this.handle.bind(this));

        // Apply SNI configuration.
        if (options.sni && typeof options.sni === 'object') {
            if (options.enableHttps === false) {
                console.warn('SNI configuration is ignored because HTTPS is disabled.');
            } else {
                Object.keys(options.sni).forEach((hostname: string) => {
                    (this.server as https.Server).addContext(hostname, options.sni[hostname]);
                });
            }
        }
    }

    /**
     * @inheritDoc
     */
    public onUpgradeRequest(callback: (request: RawHttpRequest, socket: Socket) => void): void
    {
        this.server.on('upgrade', (req: IncomingMessage, socket: Socket) => {
            callback(new RawHttpRequest({http1: req}), socket);
        });
    }

    /**
     * Handles an incoming HTTP/1 connection.
     *
     * @param {IncomingMessage} req
     * @param {ServerResponse} res
     * @private
     */
    private handle(req: IncomingMessage, res: ServerResponse): void
    {
        const rawRequest  = new RawHttpRequest({http1: req}),
              rawResponse = new RawHttpResponse({http1: res});

        this.handler(rawRequest, rawResponse);
    }
}
