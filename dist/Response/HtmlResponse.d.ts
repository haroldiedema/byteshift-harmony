import { Node } from '../SSR/Node';
import { HttpStatus, Response } from './Response';
export declare class HtmlResponse extends Response {
    constructor(html: string | Node, statusCode?: HttpStatus);
}
