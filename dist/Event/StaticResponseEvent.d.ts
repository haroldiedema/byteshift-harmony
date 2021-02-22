import { Request } from '../Request/Request';
import { Response } from '../Response/Response';
export declare class StaticResponseEvent {
    readonly request: Request;
    readonly response: Response;
    readonly fileName: string;
    readonly mimeType: string;
    constructor(request: Request, response: Response, fileName: string, mimeType: string);
}
