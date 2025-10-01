/* Byteshift Harmony                                                               _         _             __   _ _____
 *    A component-based HTTP server micro-framework                               | |__ _  _| |_ ___  ___ / /  (_) _/ /_
 *                                                                                | '_ \ || |  _/ -_|(_-</ _ \/ / _/ __/
 * (C)2020, Harold Iedema <harold@iedema.me>                                      |_.__/\_, |\__\___/___/_//_/_/_/ \__/
 * See LICENSE for licensing information                                                |__/             H A R M O N Y
 */
'use strict';

import {Socket}         from 'net';
import {IHttpServer}    from './IHttpServer';
import {IServerOptions} from './IServerOptions';
import {RawHttpRequest} from './RawHttpRequest';

export abstract class AbstractHttpServer implements IHttpServer
{
    protected readonly server: any;
    protected readonly options: IServerOptions;

    /**
     * @inheritDoc
     */
    public on(eventName: string, callback: (...args: any[]) => any): void
    {
        this.server.on(eventName, callback);
    }

    /**
     * @inheritDoc
     */
    public once(eventName: string, callback: (...args: any[]) => any): void
    {
        this.server.once(eventName, callback);
    }

    /**
     * @inheritDoc
     */
    public off(eventName: string, callback: (...args: any[]) => any): void
    {
        this.server.off(eventName, callback);
    }

    /**
     * @inheritDoc
     */
    public abstract onUpgradeRequest(callback: (request: RawHttpRequest, socket: Socket, head: Buffer) => void): void;

    /**
     * @inheritDoc
     */
    public start(): void
    {
        this.server.listen(this.options.port);
    }
}
