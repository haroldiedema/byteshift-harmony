/* Byteshift Harmony                                                               _         _             __   _ _____
 *    A component-based HTTP server micro-framework                               | |__ _  _| |_ ___  ___ / /  (_) _/ /_
 *                                                                                | '_ \ || |  _/ -_|(_-</ _ \/ / _/ __/
 * (C)2020, Harold Iedema <harold@iedema.me>                                      |_.__/\_, |\__\___/___/_//_/_/_/ \__/
 * See LICENSE for licensing information                                                |__/             H A R M O N Y
 */
'use strict';

import {ResponseAwareEvent} from './ResponseAwareEvent';
import {ServerError}        from '../Exception/ServerError';
import {Request}            from '../Request';

export class ErrorEvent extends ResponseAwareEvent
{
    public constructor(
        public readonly error: ServerError | Error,
        public readonly request: Request,
        public readonly controller: any,
        public readonly methodName: string,
    )
    {
        super();
    }
}
