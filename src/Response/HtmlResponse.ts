/* Byteshift Harmony                                                               _         _             __   _ _____
 *    A component-based HTTP server micro-framework                               | |__ _  _| |_ ___  ___ / /  (_) _/ /_
 *                                                                                | '_ \ || |  _/ -_|(_-</ _ \/ / _/ __/
 * (C)2020, Harold Iedema <harold@iedema.me>                                      |_.__/\_, |\__\___/___/_//_/_/_/ \__/
 * See LICENSE for licensing information                                                |__/             H A R M O N Y
 */
'use strict';

import {Node}                 from '../SSR/Node';
import {HttpStatus, Response} from './Response';

export class HtmlResponse extends Response
{
    constructor(html: string|Node, statusCode: HttpStatus = HttpStatus.OK)
    {
        if (html instanceof Node) {
            html = html.render();
        }

        super(html, statusCode, 'text/html');
    }
}
