/* Byteshift Harmony                                                               _         _             __   _ _____
 *    A component-based HTTP server micro-framework                               | |__ _  _| |_ ___  ___ / /  (_) _/ /_
 *                                                                                | '_ \ || |  _/ -_|(_-</ _ \/ / _/ __/
 * (C)2020, Harold Iedema <harold@iedema.me>                                      |_.__/\_, |\__\___/___/_//_/_/_/ \__/
 * See LICENSE for licensing information                                                |__/             H A R M O N Y
 */
'use strict';

import http                   from 'http';
import https                  from 'https';
import tls                    from 'tls';
import {ErrorEvent}           from './Event/ErrorEvent';
import {RenderTemplateEvent}  from './Event/RenderTemplateEvent';
import {RequestEvent}         from './Event/RequestEvent';
import {ResponseEvent}        from './Event/ResponseEvent';
import {StaticRequestEvent}   from './Event/StaticRequestEvent';
import {StaticResponseEvent}  from './Event/StaticResponseEvent';
import {InternalServerError}  from './Exception/InternalServerError';
import {NotFoundError}        from './Exception/NotFoundError';
import {HarmonyErrorPage}     from './Page/HarmonyErrorPage';
import {Request}              from './Request';
import {HttpStatus, Response} from './Response/Response';
import {IRoute, Router}       from './Router/Router';
import {InMemoryStorage}      from './Session/InMemoryStorage';
import {ISessionStorage}      from './Session/ISessionStorage';
import {Session}              from './Session/Session';
import {SessionManager}       from './Session/SessionManager';
import {StaticAssetHandler}   from './StaticAssetHandler';
import {TemplateManager}      from './Templating/TemplateManager';

export class Harmony
{
    private readonly router: Router;
    private readonly server: http.Server;
    private readonly sessionManager: SessionManager;
    private readonly staticAssetHandler: StaticAssetHandler;
    private readonly templateManager: TemplateManager;

    private errorEventListeners: ErrorEventListener[]       = [];
    private requestEventListeners: RequestEventListener[]   = [];
    private responseEventListeners: ResponseEventListener[] = [];

    constructor(private readonly options: IConstructorOptions)
    {
        this.router = new Router();
        this.server = options.enableHttps
                      ? https.createServer(options.httpsOptions, this.handle.bind(this))
                      : http.createServer(this.handle.bind(this));

        // Register default error page handler with the lowest priority.
        this.registerErrorEventListener((new HarmonyErrorPage()).onServerError, -Infinity);

        // Register controllers.
        if (options.controllers) {
            options.controllers.forEach((controllerClass) => this.registerController(controllerClass));
        }

        // Register event listeners.
        if (options.errorEventListeners) {
            options.errorEventListeners.forEach(e => this.registerErrorEventListener(e.callback, e.priority));
        }
        if (options.requestEventListeners) {
            options.requestEventListeners.forEach(e => this.registerRequestEventListener(e.callback, e.priority));
        }
        if (options.responseEventListeners) {
            options.responseEventListeners.forEach(e => this.registerResponseEventListener(e.callback, e.priority));
        }

        // Session management.
        if (options.enableSession) {
            options.session     = options.session || {};
            this.sessionManager = new SessionManager(
                options.session.storage || new InMemoryStorage(),
                options.session.cookieName || 'HARMONY_SID',
            );

            // Make sure the request event listener is executed first, to allow
            // other event listeners to access session data if necessary.
            this.registerRequestEventListener((e => this.sessionManager.onRequest(e)), Infinity);

            // Let the response event listener run last to allow other event
            // listeners to modify the session data if necessary.
            this.registerResponseEventListener((e => this.sessionManager.onResponse(e)), -Infinity);
        }

        // Handle static assets.
        options.static = options.static || {};
        if (options.static.publicDirectories && options.static.publicDirectories.length > 0) {
            this.staticAssetHandler = new StaticAssetHandler(
                options.static.publicDirectories,
                options.static.lookupMimeType,
            );

            // The static asset handler hooks to caught "NotFoundError" errors.
            // To ensure no other listener falsely intercepts this as an actual
            // error, we'll give the static asset handler the highest priority.
            this.registerErrorEventListener(e => this.staticAssetHandler.onErrorEvent(e), Infinity);

            // Register event handlers for static resources.
            if (Array.isArray(options.static.staticRequestEventListeners) && options.static.staticRequestEventListeners.length > 0) {
                options.static.staticRequestEventListeners.forEach((listener: StaticRequestEventListener) => {
                    this.staticAssetHandler.registerStaticRequestEventListener(listener);
                });
            }

            if (Array.isArray(options.static.staticResponseEventListeners) && options.static.staticResponseEventListeners.length > 0) {
                options.static.staticResponseEventListeners.forEach((listener: StaticResponseEventListener) => {
                    this.staticAssetHandler.registerStaticResponseEventListener(listener);
                });
            }
        }

        // Handle methods annotated with the @Template decorator.
        if (options.templating && options.templating.templateDirectories) {
            this.templateManager = new TemplateManager(options.templating.templateDirectories);

            if (Array.isArray(options.templating.renderEventListeners) && options.templating.renderEventListeners.length > 0) {
                options.templating.renderEventListeners.forEach((listener: RenderTemplateEventListener) => {
                    this.templateManager.registerRenderEventListener(listener);
                });
            }
        }
    }

    /**
     * Starts the HTTP server.
     */
    public start(): void
    {
        this.server.listen(this.options.port || 8000);
    }

    /**
     * Embeds the given plugin in this Harmony server instance.
     *
     * @param {IHarmonyPlugin} plugin
     */
    public use(plugin: IHarmonyPlugin): void
    {
        plugin.install(this);
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
     * Registers an error event listener.
     */
    public registerErrorEventListener(
        callback: (e: ErrorEvent) => boolean | void | Promise<boolean> | Promise<void>,
        priority: number = 0,
    ): void
    {
        this.errorEventListeners.push({callback: callback, priority: priority});
        this.errorEventListeners = this.errorEventListeners.sort((a, b) => a.priority > b.priority ? -1 : 1);
    }

    /**
     * Registers a request event listener.
     */
    public registerRequestEventListener(
        callback: (e: RequestEvent) => boolean | void | Promise<boolean> | Promise<void>,
        priority: number = 0,
    ): void
    {
        this.requestEventListeners.push({callback: callback, priority: priority});
        this.requestEventListeners = this.requestEventListeners.sort((a, b) => a.priority > b.priority ? -1 : 1);
    }

    /**
     * Registers a response event listener.
     */
    public registerResponseEventListener(
        callback: (e: ResponseEvent) => boolean | void | Promise<boolean> | Promise<void>,
        priority: number = 0,
    ): void
    {
        this.responseEventListeners.push({callback: callback, priority: priority});
        this.responseEventListeners = this.responseEventListeners.sort((a, b) => a.priority > b.priority ? -1 : 1);
    }

    /**
     * Registers a static request event listener.
     */
    public registerStaticRequestEventListener(
        callback: (e: StaticRequestEvent) => boolean | void,
        priority: number = 0,
    ): void
    {
        if (typeof this.staticAssetHandler === 'undefined') {
            throw new Error(
                'Unable to register a static request event listener because static resource handling is disabled. Please ensure at least one public directory is configured.');
        }

        this.staticAssetHandler.registerStaticRequestEventListener({callback, priority});
    }

    /**
     * Registers a static response event listener.
     */
    public registerStaticResponseEventListener(
        callback: (e: StaticResponseEvent) => boolean | void,
        priority: number = 0,
    ): void
    {
        if (typeof this.staticAssetHandler === 'undefined') {
            throw new Error(
                'Unable to register a static response event listener because static resource handling is disabled. Please ensure at least one public directory is configured.');
        }

        this.staticAssetHandler.registerStaticResponseEventListener({callback, priority});
    }

    /**
     * Registers a render template event listener.
     */
    public registerRenderTemplateListener(callback: (e: RenderTemplateEvent) => Promise<void>, priority: number = 0): void
    {
        if (typeof this.templateManager === 'undefined') {
            throw new Error('Unable to register a render template event listener because templating is currently disabled. Please ensure that at least one template directory is configured.');
        }

        this.templateManager.registerRenderEventListener({callback, priority});
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

        let controller;

        try {
            if (!route) {
                throw new NotFoundError();
            }

            controller = this.options.serviceContainer
                         ? this.options.serviceContainer.get(route._controller[0])
                         : new route._controller[0]();

            if (typeof controller[route._controller[1]] !== 'function') {
                throw new InternalServerError('Method "' + route._controller[1] + '" is not an accessible method in this controller.');
            }

            // Fire the 'request' event to allow external services to listen
            // for incoming requests before the controller method is fired.
            // This would allow firewall type of functionality to exist, or
            // generic services that serve static content.
            const requestEvent = new RequestEvent(request, route);

            let stopPropagation = false,
                response;

            for (let listener of this.requestEventListeners) {
                stopPropagation = false === await listener.callback(requestEvent);

                if (!response && requestEvent.hasResponse() && !requestEvent.getResponse().isSent) {
                    response = requestEvent.getResponse();
                }

                if (stopPropagation) {
                    break;
                }
            }

            // Only handle the controller action if a request listener did not
            // send a response yet.
            if (!response) {
                // Handle the actual controller method.
                response = await this.handleControllerAction(controller, route._controller[1], route, request);

                // A controller method must return a Response object, unless it
                // is annotated with the @Template decorator.
                if (!(response instanceof Response)) {
                    if (controller.__TEMPLATES__ && controller.__TEMPLATES__[route._controller[1]]) {
                        const session = this.sessionManager ? this.sessionManager.getSessionByRequest(request) : undefined;
                        response      = await this.templateManager.render(
                            request,
                            session,
                            controller.__TEMPLATES__[route._controller[1]],
                            response,
                        );
                    }

                    // Do we have a response now?
                    if (!(response instanceof Response)) {
                        throw new InternalServerError('Method "' + route._controller[1] + '" did not return a Response object.');
                    }
                }
            }

            // Fire the 'response' event to allow external services to modify
            // the returned response. For example, setting specific cookies or
            // other headers.
            const responseEvent = new ResponseEvent(request, route, response);
            for (let listener of this.responseEventListeners) {
                if (false === listener.callback(responseEvent)) {
                    break;
                }
            }

            if (!response.isSent) {
                response.send(res);
            }
        } catch (e: any) {
            // Fire the 'error' event to allow external services to listen act
            // on certain types of errors, for example rendering a custom 404
            // or 500 page.
            const errorEvent    = new ErrorEvent(e, request, controller, route ? route._controller[1] : undefined);
            let hasSentResponse = false;

            for (let listener of this.errorEventListeners) {
                const stopPropagation = false === await listener.callback(errorEvent);

                // Send the response if the listener defined one and if we
                // haven't already sent one to the client.
                if (false === hasSentResponse && errorEvent.hasResponse()) {
                    const response = errorEvent.getResponse();

                    if (false === response.isSent) {
                        response.send(res);
                        hasSentResponse = true;
                    }
                }

                // Stop propagating if the listener returned false explicitly.
                if (stopPropagation) {
                    return;
                }
            }
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
            } else if (methodArg.type === Session) {
                if (!this.sessionManager) {
                    throw new InternalServerError('Controller attempted to access Session, but sessions are disabled.');
                }
                args.push(this.sessionManager.getSessionByRequest(request));
                params.unshift(null);
            } else {
                args.push(params[i]);
            }
        }

        return await fn(...args);
    }
}

export interface IConstructorOptions
{
    /**
     * The port to listen on for incoming connections.
     *
     * Defaults to 8000.
     */
    port?: number;

    static?: {
        /**
         * One or more directories to serve static assets from.
         *
         * If the file name collisions would occur because the a file with the
         * same name exists in both directories, the first found occurrence
         * will be served to the client.
         */
        publicDirectories?: string[];

        /**
         * A callback function that is invoked whenever a static file was found
         * based on the request URI. The callback accepts the file extension in
         * lower case format and should return a content-type string.
         *
         * Byteshift Harmony should be a zero-dependency library, so you're
         * free to use another mime-type library if you desire, or implement
         * your own logic.
         *
         * If this option is omitted, a set of default extensions are supported
         * while others always return as "application/octet-stream". The file
         * types supported by default are: "txt", "html", "css", "js", "png",
         * "gif", "svg" and "json".
         *
         * @param {string} fileExtension
         * @returns {string}
         */
        lookupMimeType?: (fileExtension: string) => string;

        /**
         * A list of static request event listeners.
         */
        staticRequestEventListeners?: StaticRequestEventListener[];

        /**
         * A list of static response event listeners.
         */
        staticResponseEventListeners?: StaticResponseEventListener[];
    },

    templating?: {

        /**
         * A list of directories to use when searching for template files. A
         * directory in this list is used as base path for a template name that
         * is passed to the {@Template} decorator.
         *
         * If the template support is to be enabled, at least one directory
         * should be specified.
         */
        templateDirectories?: string[];

        /**
         * A list of event listeners that are invoked when an annotated method
         * with the {@Template} decorator in a controller has been executed and
         * has returned a data object.
         *
         * The event listener is responsible for rendering the template. If the
         * listener callback returns a string, that string is used as response
         * to be sent to the client. If the callback returns nothing, the next
         * event listener is executed.
         */
        renderEventListeners?: RenderTemplateEventListener[]
    }

    /**
     * Enables 'session'-functionality for each connected client. This allows
     * the use of a per-client session storage to store arbitrary data for as
     * long as the client remains active on the website.
     *
     * Defaults to false.
     */
    enableSession?: boolean;

    session?: {
        /**
         * A storage service that implements {ISessionStorage}. This allows
         * session date to be stored in a custom back-end, such as MySQL, Redis
         * CouchDB or any other form of storage.
         *
         * Defaults to in-memory storage, meaning that all session data is lost
         * whenever the server restarts or shuts down.
         */
        storage?: ISessionStorage;

        /**
         * The name of the cookie to store in the browser that represents the
         * ID of the current session.
         */
        cookieName?: string;
    }

    /**
     * Whether to use an HTTPS server rather than HTTP.
     * Use the 'sslOptions' object to pass options to the HTTP server like SSL
     * certificate files, etc.
     *
     * Defaults to false.
     */
    enableHttps?: boolean;

    /**
     * Options to pass to {https.createServer} when 'useHttps' is enabled.
     */
    httpsOptions?: tls.SecureContextOptions & tls.TlsOptions & http.ServerOptions;

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

    /**
     * A list of controller classes to use. At least one method in each given
     * class must be annotated with the {@Route} decorator.
     */
    controllers?: (new (...args: any[]) => any)[];

    /**
     * A list of event listeners to invoke whenever an error occurs while
     * handling an incoming request.
     */
    errorEventListeners?: ErrorEventListener[];

    /**
     * A list of event listeners to invoke whenever a successful request was
     * made to an existing route. Use these listeners to intercept requests to
     * enable firewall type of functionality.
     */
    requestEventListeners?: RequestEventListener[];

    /**
     * A list of one or more response event listeners to invoke right before
     * a response is sent to the client. Use these to modify the response right
     * before it is sent.
     */
    responseEventListeners?: ResponseEventListener[];
}

/**
 * Represents a service container.
 */
export interface IServiceContainer
{
    get(ctor: new (...args: any[]) => any): any;
}

/**
 * Represents a Harmony plugin that configures itself inside the server by
 * subscribing to events where necessary.
 */
export interface IHarmonyPlugin
{
    install(server: Harmony): void;
}

export interface HarmonyEventListener
{
    /**
     * Determines when this listener is executed.
     *
     * A higher number means higher priority. For example, 100 is executed
     * before 1.
     */
    priority: number;
}

/**
 * Denotes an event listener that will have its callback invoked whenever an
 * error has occurred during a request.
 */
export interface ErrorEventListener extends HarmonyEventListener
{
    callback: (event: ErrorEvent) => boolean | void | Promise<boolean> | Promise<void>;
}

/**
 * Denotes an event listener that will have its callback invoked whenever a
 * successful request was made to an existing route.
 */
export interface RequestEventListener extends HarmonyEventListener
{
    callback: (event: RequestEvent) => boolean | void | Promise<boolean> | Promise<void>;
}

/**
 * Denotes an event listener that will have its callback invoked whenever the
 * server is about to send a response back to the client. The callback may
 * make changes to the response attached to the event object.
 */
export interface ResponseEventListener extends HarmonyEventListener
{
    callback: (event: ResponseEvent) => boolean | void | Promise<boolean> | Promise<void>;
}

/**
 * Denotes an event listener that will have its callback invoked whenever a
 * static resource was requested from a public directory. This enables you
 * to intercept and add caching, transpiling or compiling functionality to
 * static asset handling.
 */
export interface StaticRequestEventListener extends HarmonyEventListener
{
    callback: (event: StaticRequestEvent) => boolean | void | Promise<boolean> | Promise<void>;
}

/**
 * Denotes an event listener that will have its callback invoked whenever
 * a static resource is about to be served to the client. Use this event
 * to intercept the response for caching purposes, or to modify the event
 * by transpiling or compiling the resource contents.
 */
export interface StaticResponseEventListener extends HarmonyEventListener
{
    callback: (event: StaticResponseEvent) => boolean | void | Promise<boolean> | Promise<void>;
}

/**
 * Denotes an event listener that is responsible for rendering a template. The
 * callback should create a Response object and attach it to the event if it
 * needs to be sent back to the client. In this case, no other listeners will
 * be invoked. The callback is responsible for setting the content and mime-
 * type of the content.
 *
 * The callback receives a {RenderTemplateEvent} object which contains an
 * absolute path to the template file and an object of data returned by the
 * controller method.
 */
export interface RenderTemplateEventListener extends HarmonyEventListener
{
    callback: (event: RenderTemplateEvent) => Promise<void>;
}
