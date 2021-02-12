/* Byteshift Elements                                                              _         _             __   _ _____
 *    A self-encapsulating WebComponent framework                                 | |__ _  _| |_ ___  ___ / /  (_) _/ /_
 *                                                                                | '_ \ || |  _/ -_|(_-</ _ \/ / _/ __/
 * (C)2020, Harold Iedema <harold@iedema.me>                                      |_.__/\_, |\__\___/___/_//_/_/_/ \__/
 * See LICENSE for licensing information                                                |__/                   H T T P
 */
'use strict';

import {HttpStatus, Response} from '@/Response';

export class JsonResponse extends Response
{
    constructor(data: any, statusCode: HttpStatus = HttpStatus.OK, pretty: boolean = true)
    {
        const json = pretty ? JSON.stringify(data, null, 4) : JSON.stringify(data);

        super(json, statusCode, 'application/json');
    }
}
