/// <reference types="node" />
import { IncomingMessage } from 'http';
import { IUploadedFile } from '../Request/IUploadedFile';
import { Request } from '../Request/Request';
import { Response } from '../Response/Response';
import { IRoute } from '../Router/Router';
export declare class Profile {
    readonly request: IncomingMessage;
    readonly id: string;
    readonly name: string;
    readonly createdAt: Date;
    readonly timings: Map<string, Timing>;
    hRequest?: Request;
    hRoute?: IRoute;
    hResponse?: Response;
    private activeMeasurements;
    constructor(request: IncomingMessage);
    /**
     * Returns the response HTTP status code.
     *
     * @returns {number}
     */
    get statusCode(): number;
    /**
     * Returns a list of uploaded files, indexed by POST field name.
     *
     * @returns {{fieldName: string, files: IUploadedFile[]}[]}
     */
    get files(): ({
        fieldName: string;
        files: IUploadedFile[];
    })[];
    /**
     * Starts measuring the time of an event with the given name.
     *
     * Call {@link Profile.stop} to calculate the time needed for this event
     * and store it.
     *
     * @param {string} name
     */
    start(name: string): void;
    /**
     * Stops the time measurement of the event with the given name and stores
     * the result in this profile.
     *
     * @param {string} name
     */
    stop(name: string): void;
    /**
     * Returns the total time of every event captured in this profile.
     *
     * @returns {number}
     */
    get totalTime(): number;
    /**
     * Returns timing information captured in this profile.
     *
     * @returns {Timing[]}
     */
    get timing(): Timing[];
    /**
     * Returns the current time in microseconds.
     *
     * @returns {number}
     * @private
     */
    private getHrTime;
}
declare type Timing = {
    /**
     * The name of this timing event.
     */
    name: string;
    /**
     * The UNIX time in milliseconds this event was started.
     */
    startedAt: number;
    /**
     * The time in milliseconds it took to perform this event.
     */
    time: number;
};
export {};
