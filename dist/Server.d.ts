/// <reference types="node" />
import http from 'http';
import tls from 'tls';
export declare class Server {
    private readonly options;
    private readonly router;
    private readonly server;
    constructor(options: IConstructorOptions);
    /**
     * Starts the HTTP server.
     */
    start(): void;
    /**
     * Registers a Controller class.
     *
     * The given class must contain at least one @Route annotation on a method
     * that defines a route.
     *
     * @param controller
     */
    registerController(controller: any): void;
    /**
     * Handles an incoming HTTP request.
     *
     * @param {http.IncomingMessage} req
     * @param {http.ServerResponse} res
     */
    private handle;
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
    private handleControllerAction;
    /**
     * Sends a 404-"Not Found" response to the client.
     *
     * @param {http.ServerResponse} res
     * @private
     */
    private send404;
    /**
     * Sends a 500-"Internal Server Error" response to the client.
     *
     * @param {http.ServerResponse} res
     * @private
     */
    private send500;
}
export interface IConstructorOptions {
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
export interface IServiceContainer {
    get(ctor: new (...args: any[]) => any): any;
}
