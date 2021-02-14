/* Byteshift Harmony                                                               _         _             __   _ _____
 *    A component-based HTTP server micro-framework                               | |__ _  _| |_ ___  ___ / /  (_) _/ /_
 *                                                                                | '_ \ || |  _/ -_|(_-</ _ \/ / _/ __/
 * (C)2020, Harold Iedema <harold@iedema.me>                                      |_.__/\_, |\__\___/___/_//_/_/_/ \__/
 * See LICENSE for licensing information                                                |__/             H A R M O N Y
 */
'use strict';

import {RequestEvent}    from '../Event/RequestEvent';
import {ResponseEvent}   from '../Event/ResponseEvent';
import {Request}         from '../Request';
import {Session}         from './Session';
import {ISessionStorage} from './ISessionStorage';

/**
 * Creates or restores and saves user session data during request and
 * response events.
 */
export class SessionManager
{
    private sessionData: Map<Request, Session> = new Map();

    public constructor(private sessionStorage: ISessionStorage, private cookieName: string)
    {
    }

    /**
     * Invoked when a request was received from the browser.
     *
     * @param {RequestEvent} event
     */
    public onRequest(event: RequestEvent): void
    {
        const _id = event.request.cookies.get(this.cookieName);
        this.sessionData.set(event.request, new Session(_id ? this.sessionStorage.get(_id) : '{}'));
    }

    /**
     * Invoked right before the response is sent back to the browser.
     *
     * @param {ResponseEvent} event
     */
    public onResponse(event: ResponseEvent): void
    {
        const sessionId = event.request.cookies.get(this.cookieName) || this.generateSessionId();
        this.sessionStorage.set(sessionId, this.sessionData.get(event.request).toString());

        event.response.cookies.set(this.cookieName, sessionId, 0);
    }

    /**
     * Returns a Session instance by the given request.
     *
     * @param {Request} request
     * @returns {Session | undefined}
     */
    public getSessionByRequest(request: Request): Session
    {
        return this.sessionData.get(request);
    }

    /**
     * Returns a random session id.
     *
     * @returns {string}
     * @private
     */
    private generateSessionId(): string
    {
        return [...Array(64)].map(_ => (~~(Math.random() * 36)).toString(36)).join('');
    }
}
