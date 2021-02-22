import { Request } from '../Request/Request';
import { Response } from '../Response/Response';
import { IRoute } from '../Router/Router';
export declare class ResponseEvent {
    readonly request: Request;
    readonly route: IRoute;
    readonly response: Response;
    constructor(request: Request, route: IRoute, response: Response);
}
