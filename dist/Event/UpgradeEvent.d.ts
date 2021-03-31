/// <reference types="node" />
import { Session } from '../Session/Session';
import { Request } from '../Request/Request';
import { Socket } from 'net';
export declare class UpgradeEvent {
    readonly request: Request;
    readonly socket: Socket;
    readonly session?: Session;
    constructor(request: Request, socket: Socket, session?: Session);
}
