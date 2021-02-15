import { Request } from '../Request';
export declare class Router {
    private routes;
    /**
     * Registers the given controller.
     */
    registerController(controller: any): void;
    /**
     * Returns a controller method by the given path, or undefined if it does not exist.
     *
     * @param {Request} request
     */
    findByRequest(request: Request): IRoute | undefined;
}
export interface IRoute {
    path: string;
    method: string;
    signature: MethodParameter[];
    _matcher?: {
        regExp: RegExp;
        namedParams: any[];
    };
    _controller: [any, string];
}
export interface MethodParameter {
    name: string;
    type: any;
}
