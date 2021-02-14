import { HttpStatus, Response } from './Response';
export declare class JsonResponse extends Response {
    constructor(data: any, statusCode?: HttpStatus, pretty?: boolean);
}
