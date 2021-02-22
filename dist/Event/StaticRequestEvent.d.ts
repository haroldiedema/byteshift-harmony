import { ResponseAwareEvent } from '../Event/ResponseAwareEvent';
import { Request } from '../Request/Request';
export declare class StaticRequestEvent extends ResponseAwareEvent {
    readonly request: Request;
    readonly fileName: string;
    readonly mimeType: string;
    constructor(request: Request, fileName: string, mimeType: string);
}
