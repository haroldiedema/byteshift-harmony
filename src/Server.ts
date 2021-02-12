/* Byteshift Elements                                                              _         _             __   _ _____
 *    A self-encapsulating WebComponent framework                                 | |__ _  _| |_ ___  ___ / /  (_) _/ /_
 *                                                                                | '_ \ || |  _/ -_|(_-</ _ \/ / _/ __/
 * (C)2020, Harold Iedema <harold@iedema.me>                                      |_.__/\_, |\__\___/___/_//_/_/_/ \__/
 * See LICENSE for licensing information                                                |__/                   H T T P
 */
'use strict';

import {Request}        from '@/Request';
import {Response}       from '@/Response';
import {IRoute, Router} from '@/Router';
import http             from 'http';
import https            from 'https';
import tls              from 'tls';

export class Server
{
    private readonly router: Router;
    private readonly server: http.Server;

    constructor(private readonly options: IConstructorOptions)
    {
        this.router = new Router();
        this.server = options.useHttps
                      ? https.createServer(options.sslOptions, this.handle.bind(this))
                      : http.createServer(this.handle.bind(this));
    }

    /**
     * Starts the HTTP server.
     */
    public start(): void
    {
        this.server.listen(this.options.port || 8000);
    }

    /**
     * Registers a Controller class.
     *
     * The given class must contain at least one @Route annotation on a method
     * that defines a route.
     *
     * @param controller
     */
    public registerController(controller: any): void
    {
        this.router.registerController(controller);
    }

    /**
     * Handles an incoming HTTP request.
     *
     * @param {http.IncomingMessage} req
     * @param {http.ServerResponse} res
     */
    private async handle(req: http.IncomingMessage, res: http.ServerResponse): Promise<void>
    {
        const request = new Request(req),
              route   = this.router.findByRequest(request);

        if (!route) {
            return this.send404(res);
        }

        const controller = this.options.serviceContainer
                           ? this.options.serviceContainer.get(route._controller[0])
                           : new route._controller[0]();

        if (typeof controller[route._controller[1]] !== 'function') {
            console.error('Method "' + route._controller[1] + '" is not an accessible method in this controller.');
            return this.send500(res);
        }

        const response = await this.handleControllerAction(controller, route._controller[1], route, request);

        if (!(response instanceof Response)) {
            console.error('Method "' + route._controller[1] + '" did not return a Response object.');
            return this.send500(res);
        }

        if (!response.isSent) {
            response.send(res);
        }
    }

    /**
     * Handles the controller method.
     *
     * @param controller
     * @param {string} method
     * @param {IRoute} route
     * @param {Request} request
     * @returns {Promise<Response>}
     * @private
     */
    private async handleControllerAction(
        controller: any,
        method: string,
        route: IRoute,
        request: Request,
    ): Promise<Response>
    {
        const fn: Function     = controller[method];
        const args: any[]      = [];
        const params: string[] = Object.values<string>(request.parameters.all);

        for (let i = 0; i < route.signature.length; i++) {
            const methodArg = route.signature[i];

            if (methodArg.type === Request) {
                args.push(request);
                params.unshift(null);
            } else {
                args.push(params[i]);
            }
        }

        return await fn(...args);
    }

    /**
     * Sends a 404-"Not Found" response to the client.
     *
     * @param {http.ServerResponse} res
     * @private
     */
    private send404(res: http.ServerResponse): void
    {
        res.writeHead(404);
        res.write('Not found');
        res.end();
    }

    /**
     * Sends a 500-"Internal Server Error" response to the client.
     *
     * @param {http.ServerResponse} res
     * @private
     */
    private send500(res: http.ServerResponse): void
    {
        res.writeHead(500);
        res.write('Internal Server Error');
        res.end();
    }
}

export interface IConstructorOptions
{
    /**
     * The port to listen on for incoming connections.
     *
     * Defaults to 8000.
     */
    port: number;

    /**
     * Whether to use an HTTPS server rather than HTTP.
     * Use the 'sslOptions' object to pass options to the HTTP server like SSL
     * certificate files, etc.
     *
     * Defaults to false.
     */
    useHttps: boolean;

    /**
     * Options to pass to {https.createServer} when 'useHttps' is enabled.
     */
    sslOptions?: tls.SecureContextOptions & tls.TlsOptions & http.ServerOptions;

    /**
     * A service container to pull controller classes from.
     *
     * Must implement a {get} method that accepts a class constructor which
     * will return the instance of the given class.
     *
     * If this option is omitted, a new instance of the controller class is
     * instantiated on every request.
     */
    serviceContainer?: IServiceContainer;
}

export interface IServiceContainer
{
    get(ctor: new (...args: any[]) => any): any;
}
