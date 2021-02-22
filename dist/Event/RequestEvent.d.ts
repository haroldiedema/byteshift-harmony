import { Session } from '../Session/Session';
import { ResponseAwareEvent } from './ResponseAwareEvent';
import { Request } from '../Request/Request';
import { IRoute } from '../Router/Router';
export declare class RequestEvent extends ResponseAwareEvent {
    readonly request: Request;
    readonly route: IRoute;
    readonly session?: Session;
    constructor(request: Request, route: IRoute, session?: Session);
}
