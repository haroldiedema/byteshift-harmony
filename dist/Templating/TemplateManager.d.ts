import { Request } from '../Request/Request';
import { Response } from '../Response/Response';
import { RenderTemplateEventListener } from '../Harmony';
import { Session } from '../Session/Session';
import { ITemplate } from './Template';
export declare class TemplateManager {
    private readonly templateDirectories;
    private renderEventListeners;
    constructor(templateDirectories: string[]);
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
    registerRenderEventListener(listener: RenderTemplateEventListener): void;
    /**
     * Finds the actual template file by the given name and invokes the
     * registered render template event listeners.
     */
    render(request: Request, session: Session | undefined, template: ITemplate, data: {
        [name: string]: any;
    }): Promise<Response | void>;
    /**
     * Returns the absolute path to the template file with the given name.
     *
     * @param {string} name
     * @returns {string | undefined}
     * @private
     */
    private findTemplateFile;
}
