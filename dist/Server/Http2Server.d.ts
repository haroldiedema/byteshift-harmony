/// <reference types="node" />
/// <reference types="node" />
import { Http2SecureServer } from 'http2';
import { Socket } from 'net';
import { AbstractHttpServer } from './AbstractHttpServer';
import { IHttpServer } from './IHttpServer';
import { IServerOptions } from './IServerOptions';
import { RawHttpRequest } from './RawHttpRequest';
export declare class Http2Server extends AbstractHttpServer implements IHttpServer {
    private readonly handler;
    protected readonly server: Http2SecureServer;
    protected readonly options: IServerOptions;
    constructor(options: IServerOptions, handler: (req: RawHttpRequest, res: any) => void);
    /**
     * @inheritDoc
     */
    onUpgradeRequest(callback: (request: RawHttpRequest, socket: Socket) => void): void;
    /**
     * Handles an incoming HTTP/2 request.
     *
     * @param {Http2ServerRequest} req
     * @param {Http2ServerResponse} res
     * @private
     */
    private handle;
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
    private handleSNI;
}
