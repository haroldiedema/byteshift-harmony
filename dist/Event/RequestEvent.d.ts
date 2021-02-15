import { ResponseAwareEvent } from './ResponseAwareEvent';
import { Request } from '../Request';
import { IRoute } from '../Router/Router';
export declare class RequestEvent extends ResponseAwareEvent {
    readonly request: Request;
    readonly route: IRoute;
    constructor(request: Request, route: IRoute);
}
