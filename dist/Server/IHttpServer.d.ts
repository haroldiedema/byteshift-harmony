/// <reference types="node" />
/// <reference types="node" />
import { Socket } from 'net';
import { RawHttpRequest } from './RawHttpRequest';
export interface IHttpServer {
    /**
     * Start listening for incoming connections on the configured port.
     */
    start(): void;
    /**
     * Invokes the given callback when the server emits the given event.
     *
     * @param {string} eventName
     * @param {(...args: any[]) => any} callback
     */
    on(eventName: string, callback: (...args: any[]) => any): void;
    /**
     * Invokes the given callback once when the server emits the given event.
     *
     * @param {string} eventName
     * @param {(...args: any[]) => any} callback
     */
    once(eventName: string, callback: (...args: any[]) => any): void;
    /**
     * Removes the given callback from the listers list for the given event.
     *
     * @param {string} eventName
     * @param {(...args: any[]) => any} callback
     */
    off(eventName: string, callback: (...args: any[]) => any): void;
    /**
     * Invokes the given callback when a client requests a WebSocket connection.
     *
     * @param {(request: RawHttpRequest, socket: Socket) => void} callback
     */
    onUpgradeRequest(callback: (request: RawHttpRequest, socket: Socket, head: Buffer) => void): void;
}
