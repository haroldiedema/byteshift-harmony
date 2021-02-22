/* Byteshift Harmony                                                               _         _             __   _ _____
 *    A component-based HTTP server micro-framework                               | |__ _  _| |_ ___  ___ / /  (_) _/ /_
 *                                                                                | '_ \ || |  _/ -_|(_-</ _ \/ / _/ __/
 * (C)2020, Harold Iedema <harold@iedema.me>                                      |_.__/\_, |\__\___/___/_//_/_/_/ \__/
 * See LICENSE for licensing information                                                |__/             H A R M O N Y
 */
'use strict';

import {Request}            from '../Request/Request';
import {Session}            from '../Session/Session';
import {ResponseAwareEvent} from './ResponseAwareEvent';

export class RenderTemplateEvent extends ResponseAwareEvent
{
    public constructor(
        public readonly options: any,
        public readonly request: Request,
        public readonly session: Session | undefined,
        public readonly templateFile: string,
        public readonly data: { [name: string]: any },
    )
    {
        super();
    }
}
