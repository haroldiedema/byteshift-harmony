/* Byteshift Harmony                                                               _         _             __   _ _____
 *    A component-based HTTP server micro-framework                               | |__ _  _| |_ ___  ___ / /  (_) _/ /_
 *                                                                                | '_ \ || |  _/ -_|(_-</ _ \/ / _/ __/
 * (C)2020, Harold Iedema <harold@iedema.me>                                      |_.__/\_, |\__\___/___/_//_/_/_/ \__/
 * See LICENSE for licensing information                                                |__/             H A R M O N Y
 */
'use strict';

import {Socket}         from 'net';
import {Request}        from '../Request/Request';
import {RawHttpRequest} from '../Server/RawHttpRequest';
import {Session}        from '../Session/Session';

export class UpgradeEvent
{
    public constructor(
        public readonly request: Request,
        public readonly socket: Socket,
        public readonly session: Session | undefined,
        public readonly rawHttpRequest: RawHttpRequest,
        public readonly rawHttpHead: Buffer,
    )
    {
    }
}
