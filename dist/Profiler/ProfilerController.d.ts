import { HtmlResponse } from '../Response/HtmlResponse';
import { Response } from '../Response/Response';
import { Profiler } from './Profiler';
export declare class ProfilerController {
    private readonly profiler;
    constructor(profiler: Profiler);
    indexAction(): HtmlResponse;
    profileAction(id: string): Response;
    /**
     * Renders a timeline of the given profile.
     *
     * @param {Profile} profile
     * @returns {Node}
     * @private
     */
    private renderTimelineElementsOf;
    /**
     * Creates a normalized timeline of the given profile.
     *
     * @param {Profile} profile
     * @returns {any[]}
     * @private
     */
    private createTimelineOf;
    /**
     * Converts the scale of {value} from {r1} to {r2}.
     *
     * @param {number} value
     * @param {number[]} r1
     * @param {number[]} r2
     * @returns {number}
     * @private
     */
    private convertRange;
    /**
     * Renders the common base document of the profiler.
     *
     * @param {Node}   content
     * @param {string} activeProfileId
     * @returns {Node}
     * @private
     */
    private document;
    private getDocumentStylesheet;
}
