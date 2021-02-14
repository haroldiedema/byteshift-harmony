import { HttpStatus, Response } from './Response';
export declare class HtmlResponse extends Response {
    constructor(html: string, statusCode?: HttpStatus, pretty?: boolean);
}
