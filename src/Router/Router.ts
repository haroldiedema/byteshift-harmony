/* Byteshift Harmony                                                               _         _             __   _ _____
 *    A component-based HTTP server micro-framework                               | |__ _  _| |_ ___  ___ / /  (_) _/ /_
 *                                                                                | '_ \ || |  _/ -_|(_-</ _ \/ / _/ __/
 * (C)2020, Harold Iedema <harold@iedema.me>                                      |_.__/\_, |\__\___/___/_//_/_/_/ \__/
 * See LICENSE for licensing information                                                |__/             H A R M O N Y
 */
'use strict';

import {Request} from '../Request/Request';

export class Router
{
    private routes: IRoute[] = [];

    /**
     * Registers the given controller.
     */
    public registerController(controller: any)
    {
        if (typeof controller.prototype.__ROUTES__ === 'undefined') {
            console.warn('Given controller has no registered routes.');
            return;
        }

        Object.keys(controller.prototype.__ROUTES__).forEach((methodName: string) => {
            const routeList: any[] = controller.prototype.__ROUTES__[methodName];
            routeList.forEach((route) => {
                const m: string[] = Array.isArray(route.method) ? route.method : [route.method];
                m.forEach((method: string) => {
                    this.routes.push({
                        path:        route.path,
                        method:      method,
                        signature:   route.signature,
                        _controller: [controller, methodName],
                    });
                });
            });
        });
    }

    /**
     * Returns a controller method by the given path, or undefined if it does not exist.
     *
     * @param {Request} request
     */
    public findByRequest(request: Request): IRoute | undefined
    {
        const route = this.routes.find((route: IRoute) => request.isMatchingRoute(route));
        if (!route) {
            return undefined;
        }

        return route;
    }
}

export interface IRoute
{
    path: string;
    method: string;
    signature: MethodParameter[]
    _matcher?: { regExp: RegExp, namedParams: any[] };
    _controller: [any, string];
}

export interface MethodParameter
{
    name: string;
    type: any;
}
