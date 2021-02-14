/* Byteshift Harmony                                                               _         _             __   _ _____
 *    A component-based HTTP server micro-framework                               | |__ _  _| |_ ___  ___ / /  (_) _/ /_
 *                                                                                | '_ \ || |  _/ -_|(_-</ _ \/ / _/ __/
 * (C)2020, Harold Iedema <harold@iedema.me>                                      |_.__/\_, |\__\___/___/_//_/_/_/ \__/
 * See LICENSE for licensing information                                                |__/             H A R M O N Y
 */
'use strict';

import * as fs                       from 'fs';
import path                          from 'path';
import {RenderTemplateEvent}         from '../Event/RenderTemplateEvent';
import {InternalServerError}         from '../Exception/InternalServerError';
import {NotFoundError}               from '../Exception/NotFoundError';
import {Request}                     from '../Request';
import {Response}                    from '../Response/Response';
import {RenderTemplateEventListener} from '../Harmony';
import {Session}                     from '../Session/Session';
import {ITemplate}                   from './Template';

export class TemplateManager
{
    private renderEventListeners: RenderTemplateEventListener[] = [];

    public constructor(private readonly templateDirectories: string[])
    {
    }

    /**
     * Registers a template render event listener.
     *
     * This callback is invoked after a controller method has been executed and
     * returned an object with data to be passed to a template. The callback is
     * responsible for rendering the template based on the given file name and
     * optional data object.
     *
     * If the callback returns void, the next listener in the list will be
     * executed. If the callback returns a string, that string is used as
     * response and no further render event listeners will be executed.
     *
     * @param listener
     */
    public registerRenderEventListener(listener: RenderTemplateEventListener): void
    {
        this.renderEventListeners.push(listener);
        this.renderEventListeners = this.renderEventListeners.sort((a, b) => a.priority > b.priority ? -1 : 1);
    }

    /**
     * Finds the actual template file by the given name and invokes the
     * registered render template event listeners.
     */
    public async render(
        request: Request,
        session: Session | undefined,
        template: ITemplate,
        data: { [name: string]: any },
    ): Promise<Response | void>
    {
        data = data || {};

        const fileName = this.findTemplateFile(template.name);
        if (! fileName) {
            throw new NotFoundError('The template "' + template.name + '" could not be found. Looked in "' + this.templateDirectories.join('", "') + '".');
        }

        const event = new RenderTemplateEvent(template.options, request, session, fileName, data);
        for (let listener of this.renderEventListeners) {
            await listener.callback(event);

            if (event.hasResponse()) {
                return event.getResponse();
            }
        }

        throw new InternalServerError('No available template renderer is able to render "' + template.name + '".');
    }

    /**
     * Returns the absolute path to the template file with the given name.
     *
     * @param {string} name
     * @returns {string | undefined}
     * @private
     */
    private findTemplateFile(name: string): string | undefined
    {
        for (let directory of this.templateDirectories) {
            const fileName = path.resolve(directory, name);

            if (fs.existsSync(fileName)) {
                return fileName;
            }
        }

        return undefined;
    }
}
