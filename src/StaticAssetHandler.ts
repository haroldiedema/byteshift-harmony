/* Byteshift Harmony                                                               _         _             __   _ _____
 *    A component-based HTTP server micro-framework                               | |__ _  _| |_ ___  ___ / /  (_) _/ /_
 *                                                                                | '_ \ || |  _/ -_|(_-</ _ \/ / _/ __/
 * (C)2020, Harold Iedema <harold@iedema.me>                                      |_.__/\_, |\__\___/___/_//_/_/_/ \__/
 * See LICENSE for licensing information                                                |__/             H A R M O N Y
 */
'use strict';

import {ErrorEvent}                                              from './Event/ErrorEvent';
import {StaticRequestEvent}                                      from './Event/StaticRequestEvent';
import {StaticResponseEvent}                                     from './Event/StaticResponseEvent';
import {NotFoundError}                                           from './Exception/NotFoundError';
import {HttpStatus, Response}                                    from './Response/Response';
import {StaticRequestEventListener, StaticResponseEventListener} from './Server';

import fs   from 'fs';
import path from 'path';

export class StaticAssetHandler
{
    private requestEventListeners: StaticRequestEventListener[]   = [];
    private responseEventListeners: StaticResponseEventListener[] = [];

    private readonly lookupMimeType: (fileExtension: string) => string;
    private readonly defaultMimeTypes: { [name: string]: string } = {
        txt:  'text/plain',
        html: 'text/html',
        js:   'text/javascript',
        css:  'text/css',
        gif:  'image/gif',
        png:  'image/png',
        svg:  'image/svg',
        json: 'application/json',
    };

    constructor(private readonly directories: string[], lookupMimeType?: (fileExtension: string) => string)
    {
        if (!lookupMimeType) {
            lookupMimeType = (fileExtension: string): string => {
                return this.defaultMimeTypes[fileExtension] || 'application/octet-stream';
            };
        }

        this.lookupMimeType = lookupMimeType;
    }

    /**
     * Registers a static request event listener.
     *
     * @param {StaticRequestEventListener} listener
     */
    public registerStaticRequestEventListener(listener: StaticRequestEventListener): void
    {
        this.requestEventListeners.push(listener);
        this.requestEventListeners = this.requestEventListeners.sort((a, b) => a.priority > b.priority ? -1 : 1);
    }

    /**
     * Registers a static response event listener.
     *
     * @param {StaticResponseEventListener} listener
     */
    public registerStaticResponseEventListener(listener: StaticResponseEventListener): void
    {
        this.responseEventListeners.push(listener);
        this.responseEventListeners = this.responseEventListeners.sort((a, b) => a.priority > b.priority ? -1 : 1);
    }

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
    public async onErrorEvent(event: ErrorEvent)
    {
        // Abort if this isn't a Not found error.
        if (!(event.error instanceof NotFoundError)) {
            return;
        }

        const fileName = this.lookup(event.request.path);

        // Abort if the file does not exist.
        if (!fileName) {
            return;
        }

        const mimeType = await this.lookupMimeType(path.extname(fileName).replace(/^\./, '').toLowerCase());

        // Run static request event listeners.
        const requestEvent = new StaticRequestEvent(event.request, fileName, mimeType);

        let cancelLoop = false;
        for (let listener of this.requestEventListeners) {
            cancelLoop = false === await listener.callback(requestEvent);

            if (requestEvent.hasResponse() && !event.hasResponse()) {
                event.setResponse(requestEvent.getResponse());
            }

            if (cancelLoop) {
                break;
            }
        }

        // Build the response based on the file contents & mime-type.
        const response = new Response(fs.readFileSync(fileName), HttpStatus.OK, mimeType);

        // Run static response event listeners.
        const responseEvent = new StaticResponseEvent(event.request, response, fileName, mimeType);
        cancelLoop          = false;

        for (let listener of this.responseEventListeners) {
            cancelLoop = false === await listener.callback(responseEvent);

            if (requestEvent.hasResponse() && !event.hasResponse()) {
                event.setResponse(requestEvent.getResponse());
            }

            if (cancelLoop) {
                break;
            }
        }

        // If we still don't have a response yet coming from attached event
        // listeners, we'll set the original one based on the file itself.
        if (! event.hasResponse()) {
            event.setResponse(response);
        }
    }

    /**
     * Looks up the absolute path of a file that matches the given name,
     * or undefined if no file could be found.
     *
     * @param {string} name
     * @returns {string | undefined}
     * @private
     */
    private lookup(name: string): string | undefined
    {
        for (let directory of this.directories) {
            let fileName = path.resolve(directory, name.replace(/^\//, ''));

            // Security measurement: Ensure the resolved file name is contained
            // within a public directory, and not above it. If a user tries to
            // fetch a file from a parent directory, we'll just pretend it
            // doesn't exist.
            if (false === fileName.toLowerCase().startsWith(directory.toLowerCase())) {
                continue;
            }

            if (fs.existsSync(fileName)) {
                return fileName;
            }
        }

        return undefined;
    }
}
