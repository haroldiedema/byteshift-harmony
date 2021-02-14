/* Byteshift Harmony                                                               _         _             __   _ _____
 *    A component-based HTTP server micro-framework                               | |__ _  _| |_ ___  ___ / /  (_) _/ /_
 *                                                                                | '_ \ || |  _/ -_|(_-</ _ \/ / _/ __/
 * (C)2020, Harold Iedema <harold@iedema.me>                                      |_.__/\_, |\__\___/___/_//_/_/_/ \__/
 * See LICENSE for licensing information                                                |__/             H A R M O N Y
 */
'use strict';

import {ErrorEvent}   from '../Event/ErrorEvent';
import {ServerError}  from '../Exception/ServerError';
import {HtmlResponse} from '../Response/HtmlResponse';
import template       from './HarmonyErrorPage.html';

export class HarmonyErrorPage
{
    /**
     * @param {ErrorEvent} event
     * @returns {boolean | void}
     */
    public onServerError(event: ErrorEvent): void
    {
        let html  = template;
        let title = (event.error as ServerError).title || event.error.constructor.name;

        if ((event.error as ServerError).statusCode) {
            title = '<span> ' + (event.error as ServerError).statusCode + '</span> - ' + title;
        }

        html = html.replace('{{ title }}', title);
        html = html.replace('{{ message }}', event.error.message);
        html = html.replace('{{ trace }}', (event.error as Error).stack);

        event.setResponse(new HtmlResponse(html));
    }
}
