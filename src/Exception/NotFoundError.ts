/* Byteshift Harmony                                                               _         _             __   _ _____
 *    A component-based HTTP server micro-framework                               | |__ _  _| |_ ___  ___ / /  (_) _/ /_
 *                                                                                | '_ \ || |  _/ -_|(_-</ _ \/ / _/ __/
 * (C)2020, Harold Iedema <harold@iedema.me>                                      |_.__/\_, |\__\___/___/_//_/_/_/ \__/
 * See LICENSE for licensing information                                                |__/             H A R M O N Y
 */
'use strict';

import {ServerError} from './ServerError';
import {HttpStatus}  from '../Response/Response';

export class NotFoundError extends ServerError
{
    constructor(message: string = 'The requested resource could not be found.')
    {
        super('Not Found', message, HttpStatus.NOT_FOUND);
    }
}
