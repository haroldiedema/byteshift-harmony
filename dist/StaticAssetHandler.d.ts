import { ErrorEvent } from './Event/ErrorEvent';
import { StaticRequestEventListener, StaticResponseEventListener } from './Harmony';
export declare class StaticAssetHandler {
    private readonly directories;
    private requestEventListeners;
    private responseEventListeners;
    private readonly lookupMimeType;
    private readonly defaultMimeTypes;
    constructor(directories: string[], lookupMimeType?: (fileExtension: string) => string);
    /**
     * Registers a static request event listener.
     *
     * @param {StaticRequestEventListener} listener
     */
    registerStaticRequestEventListener(listener: StaticRequestEventListener): void;
    /**
     * Registers a static response event listener.
     *
     * @param {StaticResponseEventListener} listener
     */
    registerStaticResponseEventListener(listener: StaticResponseEventListener): void;
    /**
     * Serves static assets based on the request path.
     *
     * This method is invoked when an error occurs. We'll listen to a
     * NotFoundError in particular, since this error is thrown when a request
     * was made but no matching route could be found. In this case we'll try
     * to lookup a file that matches the request path and serve its contents
     * if we found one.
     *
     * @param {ErrorEvent} event
     */
    onErrorEvent(event: ErrorEvent): Promise<void>;
    /**
     * Looks up the absolute path of a file that matches the given name,
     * or undefined if no file could be found.
     *
     * @param {string} name
     * @returns {string | undefined}
     * @private
     */
    private lookup;
}
