import { HttpStatus, Response } from './Response';
export declare class RedirectResponse extends Response {
    constructor(url: string, statusCode?: HttpStatus);
}
