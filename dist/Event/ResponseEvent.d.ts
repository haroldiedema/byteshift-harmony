import { Request } from '../Request/Request';
import { Response } from '../Response/Response';
import { IRoute } from '../Router/Router';
import { Session } from '../Session/Session';
export declare class ResponseEvent {
    readonly request: Request;
    readonly route: IRoute;
    readonly response: Response;
    readonly session?: Session;
    constructor(request: Request, route: IRoute, response: Response, session?: Session);
}
