/// <reference types="node" />
import tls from 'tls';
import { ErrorEvent } from './Event/ErrorEvent';
import { RenderTemplateEvent } from './Event/RenderTemplateEvent';
import { RequestEvent } from './Event/RequestEvent';
import { ResponseEvent } from './Event/ResponseEvent';
import { StaticRequestEvent } from './Event/StaticRequestEvent';
import { StaticResponseEvent } from './Event/StaticResponseEvent';
import { UpgradeEvent } from './Event/UpgradeEvent';
import { Request } from './Request/Request';
import { IHttpServer } from './Server/IHttpServer';
import { IServerOptions } from './Server/IServerOptions';
import { ISessionStorage } from './Session/ISessionStorage';
import { Session } from './Session/Session';
import { HarmonyElementFactory } from './SSR/Elements';
export declare class Harmony {
    private readonly options;
    private readonly router;
    private readonly server;
    private readonly requestDecoder;
    private readonly sessionManager;
    private readonly staticAssetHandler;
    private readonly templateManager;
    private readonly profiler;
    private errorEventListeners;
    private requestEventListeners;
    private responseEventListeners;
    private upgradeEventListeners;
    private typedControllerArguments;
    private compressionOptions;
    constructor(options: IConstructorOptions);
    /**
     * Starts the HTTP server.
     */
    start(): void;
    /**
     * Embeds the given plugin in this Harmony server instance.
     *
     * @param {IHarmonyPlugin} plugin
     */
    use(plugin: IHarmonyPlugin): void;
    /**
     * Registers a JSX element that can be used throughout any JSX template.
     * This is the equivalent of {@link customElements.define} but for SSR
     * rendering in Harmony.
     *
     * Note that these elements are rendered server-side and therefore provide
     * no reactivity functionality.
     *
     * @param {string} tagName
     * @param {HarmonyElementFactory} factory
     * @returns {this}
     */
    registerElement(tagName: string, factory: HarmonyElementFactory): this;
    /**
     * Returns the HTTP server wrapper of this Harmony instance.
     *
     * @returns {http.Server}
     */
    get httpServer(): IHttpServer;
    /**
     * Adds a secure context if the request hostname matches the given hostname (or wildcard).
     *
     * @param {string} hostname
     * @param {tls.SecureContextOptions} options
     */
    addServerNameIdentificationContext(hostname: string, options: tls.SecureContextOptions): void;
    /**
     * Returns the session associated with the given request.
     *
     * @param {Request} request
     * @returns {Session}
     */
    getSessionByRequest(request: Request): Session;
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
     * Registers a typed controller method argument.
     *
     * The given callback is invoked when a controller method contains a typed
     * argument with the given type. The return value of the callback is then
     * injected in the controller method. This works similarly to the default
     * Request and Session typed parameters, but for custom objects.
     *
     * @param {*} type
     * @param {(request: Request) => any} callback
     */
    registerTypedControllerArgument(type: any, callback: (request: Request) => Promise<any>): void;
    /**
     * Registers an error event listener.
     */
    registerErrorEventListener(callback: (e: ErrorEvent) => boolean | void | Promise<boolean> | Promise<void>, priority?: number): void;
    /**
     * Registers an upgrade event listener.
     */
    registerUpgradeEventListener(callback: (e: UpgradeEvent) => boolean | void | Promise<boolean> | Promise<void>, priority?: number): void;
    /**
     * Registers a request event listener.
     */
    registerRequestEventListener(callback: (e: RequestEvent) => boolean | void | Promise<boolean> | Promise<void>, priority?: number): void;
    /**
     * Registers a response event listener.
     */
    registerResponseEventListener(callback: (e: ResponseEvent) => boolean | void | Promise<boolean> | Promise<void>, priority?: number): void;
    /**
     * Registers a static request event listener.
     */
    registerStaticRequestEventListener(callback: (e: StaticRequestEvent) => boolean | void, priority?: number): void;
    /**
     * Registers a static response event listener.
     */
    registerStaticResponseEventListener(callback: (e: StaticResponseEvent) => boolean | void, priority?: number): void;
    /**
     * Registers a render template event listener.
     */
    registerRenderTemplateListener(callback: (e: RenderTemplateEvent) => Promise<void>, priority?: number): void;
    /**
     * Handles an incoming HTTP request.
     *
     * @param {RawHttpRequest} req
     * @param {RawHttpResponse} res
     */
    private handle;
    /**
     * Handles the controller method.
     *
     * @param controller
     * @param {string} method
     * @param {IRoute} route
     * @param {Request} request
     * @param {Profile} profile
     * @returns {Promise<Response>}
     * @private
     */
    private handleControllerAction;
}
export interface IConstructorOptions extends IServerOptions {
    /**
     * Whether to enable compression for responses.
     *
     * The application reads the "Accept-Encoding" header and compresses
     * the response using either Brotli or Gzip compression, depending on
     * what the client supports.
     */
    compression?: {
        /**
         * Whether to enable response compression based on the request's
         * "Accept-Encoding" header. No compression is applied if the client
         * does not support any of our compression algorithms.
         */
        enabled: boolean;
        /**
         * The minimum size of the response body before compression is applied.
         * This allows you to skip compression for small responses, as the
         * compression overhead may actually increase the size of the response
         * or may consume unnecessary CPU resources.
         */
        minSize?: number;
    };
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
    };
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
        renderEventListeners?: RenderTemplateEventListener[];
    };
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
    };
    profiler?: {
        /**
         * Enables the profiler.
         *
         * The profiler measures timings for every step during a single request
         * and stores it temporarily in memory.
         *
         * Profiles can be accessed from the browser at the "/_profiler" route.
         */
        enabled?: boolean;
        /**
         * A callback function that validates the incoming request.
         *
         * Returns true if the user making the request has access to the
         * profiler, false otherwise.
         *
         * @param {RequestEvent} event
         * @returns {Promise<boolean>}
         */
        firewall?: (event: RequestEvent) => Promise<boolean>;
        /**
         * The maximum amount of profiles to keep in memory at all times.
         */
        maxProfiles?: number;
    };
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
    /**
     * A list of event listeners that are invoked whenever an 'upgrade' request
     * was sent to the server to establish a bi-directional WebSocket
     * connection between the server and the browser.
     */
    upgradeEventListeners?: UpgradeEventListener[];
}
/**
 * Represents a service container.
 */
export interface IServiceContainer {
    get(ctor: new (...args: any[]) => any): any | Promise<any>;
}
/**
 * Represents a Harmony plugin that configures itself inside the server by
 * subscribing to events where necessary.
 */
export interface IHarmonyPlugin {
    install(server: Harmony): void;
}
export interface HarmonyEventListener {
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
export interface ErrorEventListener extends HarmonyEventListener {
    callback: (event: ErrorEvent) => boolean | void | Promise<boolean> | Promise<void>;
}
/**
 * Denotes an event listener that will have its callback invoked whenever a
 * successful request was made to an existing route.
 */
export interface RequestEventListener extends HarmonyEventListener {
    callback: (event: RequestEvent) => boolean | void | Promise<boolean> | Promise<void>;
}
/**
 * Denotes an event listener that will have its callback invoked whenever the
 * server is about to send a response back to the client. The callback may
 * make changes to the response attached to the event object.
 */
export interface ResponseEventListener extends HarmonyEventListener {
    callback: (event: ResponseEvent) => boolean | void | Promise<boolean> | Promise<void>;
}
/**
 * Denotes an event listener that will have its callback invoked whenever the
 * server received an "upgrade" request to establish a bi-directional WebSocket
 * connection with the client.
 *
 * The callback must return {true} to let Harmony know the request has been
 * dealt with, or {false}, {undefined} or void if the event handler could not
 * process the request. In this case, the next event handler will be invoked.
 */
export interface UpgradeEventListener extends HarmonyEventListener {
    callback: (event: UpgradeEvent) => boolean | void | Promise<boolean> | Promise<void>;
}
/**
 * Denotes an event listener that will have its callback invoked whenever a
 * static resource was requested from a public directory. This enables you
 * to intercept and add caching, transpiling or compiling functionality to
 * static asset handling.
 */
export interface StaticRequestEventListener extends HarmonyEventListener {
    callback: (event: StaticRequestEvent) => boolean | void | Promise<boolean> | Promise<void>;
}
/**
 * Denotes an event listener that will have its callback invoked whenever
 * a static resource is about to be served to the client. Use this event
 * to intercept the response for caching purposes, or to modify the event
 * by transpiling or compiling the resource contents.
 */
export interface StaticResponseEventListener extends HarmonyEventListener {
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
export interface RenderTemplateEventListener extends HarmonyEventListener {
    callback: (event: RenderTemplateEvent) => Promise<void>;
}
