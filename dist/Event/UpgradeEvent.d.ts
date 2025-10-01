/// <reference types="node" />
/// <reference types="node" />
import { Socket } from 'net';
import { Request } from '../Request/Request';
import { RawHttpRequest } from '../Server/RawHttpRequest';
import { Session } from '../Session/Session';
export declare class UpgradeEvent {
    readonly request: Request;
    readonly socket: Socket;
    readonly session: Session | undefined;
    readonly rawHttpRequest: RawHttpRequest;
    readonly rawHttpHead: Buffer;
    constructor(request: Request, socket: Socket, session: Session | undefined, rawHttpRequest: RawHttpRequest, rawHttpHead: Buffer);
}
