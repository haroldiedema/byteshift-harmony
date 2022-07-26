/// <reference types="node" />
import { Socket } from 'net';
import { IHttpServer } from './IHttpServer';
import { IServerOptions } from './IServerOptions';
import { RawHttpRequest } from './RawHttpRequest';
export declare abstract class AbstractHttpServer implements IHttpServer {
    protected readonly server: any;
    protected readonly options: IServerOptions;
    /**
     * @inheritDoc
     */
    on(eventName: string, callback: (...args: any[]) => any): void;
    /**
     * @inheritDoc
     */
    once(eventName: string, callback: (...args: any[]) => any): void;
    /**
     * @inheritDoc
     */
    off(eventName: string, callback: (...args: any[]) => any): void;
    /**
     * @inheritDoc
     */
    abstract onUpgradeRequest(callback: (request: RawHttpRequest, socket: Socket) => void): void;
    /**
     * @inheritDoc
     */
    start(): void;
}
