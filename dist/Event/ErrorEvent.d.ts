import { ResponseAwareEvent } from './ResponseAwareEvent';
import { ServerError } from '../Exception/ServerError';
import { Request } from '../Request/Request';
export declare class ErrorEvent extends ResponseAwareEvent {
    readonly error: ServerError | Error;
    readonly request: Request;
    readonly controller: any;
    readonly methodName: string;
    constructor(error: ServerError | Error, request: Request, controller: any, methodName: string);
}
