/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
import http from 'http';
import https from 'https';
import { Socket } from 'net';
import { AbstractHttpServer } from './AbstractHttpServer';
import { IHttpServer } from './IHttpServer';
import { IServerOptions } from './IServerOptions';
import { RawHttpRequest } from './RawHttpRequest';
export declare class Http1Server extends AbstractHttpServer implements IHttpServer {
    private readonly handler;
    protected readonly server: http.Server | https.Server;
    protected readonly options: IServerOptions;
    constructor(options: IServerOptions, handler: (req: RawHttpRequest, res: any) => void);
    /**
     * @inheritDoc
     */
    onUpgradeRequest(callback: (request: RawHttpRequest, socket: Socket, head: Buffer) => void): void;
    /**
     * Handles an incoming HTTP/1 connection.
     *
     * @param {IncomingMessage} req
     * @param {ServerResponse} res
     * @private
     */
    private handle;
}
