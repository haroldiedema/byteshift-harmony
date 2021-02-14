/* Byteshift Harmony                                                               _         _             __   _ _____
 *    A component-based HTTP server micro-framework                               | |__ _  _| |_ ___  ___ / /  (_) _/ /_
 *                                                                                | '_ \ || |  _/ -_|(_-</ _ \/ / _/ __/
 * (C)2020, Harold Iedema <harold@iedema.me>                                      |_.__/\_, |\__\___/___/_//_/_/_/ \__/
 * See LICENSE for licensing information                                                |__/             H A R M O N Y
 */
'use strict';

import {Response} from '../Response/Response';

export abstract class ResponseAwareEvent
{
    private response: Response;

    public setResponse(response: Response): void
    {
        this.response = response;
    }

    public hasResponse(): boolean
    {
        return this.response instanceof Response;
    }

    public getResponse(): Response
    {
        return this.response;
    }
}
