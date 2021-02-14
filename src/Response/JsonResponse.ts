/* Byteshift Harmony                                                               _         _             __   _ _____
 *    A component-based HTTP server micro-framework                               | |__ _  _| |_ ___  ___ / /  (_) _/ /_
 *                                                                                | '_ \ || |  _/ -_|(_-</ _ \/ / _/ __/
 * (C)2020, Harold Iedema <harold@iedema.me>                                      |_.__/\_, |\__\___/___/_//_/_/_/ \__/
 * See LICENSE for licensing information                                                |__/             H A R M O N Y
 */
'use strict';

import {HttpStatus, Response} from './Response';

export class JsonResponse extends Response
{
    constructor(data: any, statusCode: HttpStatus = HttpStatus.OK, pretty: boolean = true)
    {
        const json = pretty ? JSON.stringify(data, null, 4) : JSON.stringify(data);

        super(json, statusCode, 'application/json');
    }
}
