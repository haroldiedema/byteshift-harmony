/* Byteshift Harmony                                                               _         _             __   _ _____
 *    A component-based HTTP server micro-framework                               | |__ _  _| |_ ___  ___ / /  (_) _/ /_
 *                                                                                | '_ \ || |  _/ -_|(_-</ _ \/ / _/ __/
 * (C)2020, Harold Iedema <harold@iedema.me>                                      |_.__/\_, |\__\___/___/_//_/_/_/ \__/
 * See LICENSE for licensing information                                                |__/             H A R M O N Y
 */
'use strict';

import {IUploadedFile}  from '../Request/IUploadedFile';
import {Request}        from '../Request/Request';
import {Response}       from '../Response/Response';
import {IRoute}         from '../Router/Router';
import {RawHttpRequest} from '../Server/RawHttpRequest';

export class Profile
{
    public readonly id: string;
    public readonly name: string;
    public readonly createdAt: Date              = new Date();
    public readonly timings: Map<string, Timing> = new Map();

    public hRequest?: Request;
    public hRoute?: IRoute;
    public hResponse?: Response;

    private activeMeasurements: Map<string, number> = new Map();

    constructor(public readonly request: RawHttpRequest)
    {
        this.id   = `h${[...Array(8)].map(() => (~~(Math.random() * 36)).toString(36)).join('')}`;
        this.name = request.url;
    }

    /**
     * Returns the response HTTP status code.
     *
     * @returns {number}
     */
    public get statusCode(): number
    {
        return this.hResponse?.statusCode ?? 0;
    }

    /**
     * Returns a list of uploaded files, indexed by POST field name.
     *
     * @returns {{fieldName: string, files: IUploadedFile[]}[]}
     */
    public get files(): ({ fieldName: string, files: IUploadedFile[] })[]
    {
        if (!this.hRequest || this.hRequest.files.size === 0) {
            return [];
        }

        const result: ({ fieldName: string, files: IUploadedFile[] })[] = [];

        Object.keys(this.hRequest.files.all).forEach((fieldName: string) => {
            let files = this.hRequest.files.get(fieldName);
            if (!Array.isArray(files)) {
                files = [files];
            }

            result.push({fieldName: fieldName, files: files});
        });

        return result;
    }

    /**
     * Starts measuring the time of an event with the given name.
     *
     * Call {@link Profile.stop} to calculate the time needed for this event
     * and store it.
     *
     * @param {string} name
     */
    public start(name: string): void
    {
        this.activeMeasurements.set(name, this.getHrTime());
    }

    /**
     * Stops the time measurement of the event with the given name and stores
     * the result in this profile.
     *
     * @param {string} name
     */
    public stop(name: string): void
    {
        if (!this.activeMeasurements.has(name)) {
            return;
        }

        this.timings.set(name, {
            name:      name,
            startedAt: this.activeMeasurements.get(name),
            time:      this.getHrTime() - this.activeMeasurements.get(name),
        });

        this.activeMeasurements.delete(name);
    }

    /**
     * Returns the total time of every event captured in this profile.
     *
     * @returns {number}
     */
    public get totalTime(): number
    {
        let total = 0;

        for (const timing of this.timing) {
            total += timing.time;
        }

        return total;
    }

    /**
     * Returns timing information captured in this profile.
     *
     * @returns {Timing[]}
     */
    public get timing(): Timing[]
    {
        return Array.from(this.timings.values());
    }

    /**
     * Returns the current time in microseconds.
     *
     * @returns {number}
     * @private
     */
    private getHrTime(): number
    {
        const hrTime = process.hrtime();

        return hrTime[0] * 1000000 + hrTime[1] / 1000;
    }
}

type Timing = {
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
}
