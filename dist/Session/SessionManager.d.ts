import { RequestEvent } from '../Event/RequestEvent';
import { ResponseEvent } from '../Event/ResponseEvent';
import { Request } from '../Request/Request';
import { Session } from './Session';
import { ISessionStorage } from './ISessionStorage';
/**
 * Creates or restores and saves user session data during request and
 * response events.
 */
export declare class SessionManager {
    private sessionStorage;
    private cookieName;
    private sessionData;
    constructor(sessionStorage: ISessionStorage, cookieName: string);
    /**
     * Invoked when a request was received from the browser.
     *
     * @param {RequestEvent} event
     */
    onRequest(event: RequestEvent): Promise<void>;
    /**
     * Invoked right before the response is sent back to the browser.
     *
     * @param {ResponseEvent} event
     */
    onResponse(event: ResponseEvent): Promise<void>;
    /**
     * Returns a Session instance by the given request.
     *
     * @param {Request} request
     * @returns {Session | undefined}
     */
    getSessionByRequest(request: Request): Session;
    /**
     * Returns a random session id.
     *
     * @returns {string}
     * @private
     */
    private generateSessionId;
}
