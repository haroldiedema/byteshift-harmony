/* Byteshift Harmony                                                               _         _             __   _ _____
 *    A component-based HTTP server micro-framework                               | |__ _  _| |_ ___  ___ / /  (_) _/ /_
 *                                                                                | '_ \ || |  _/ -_|(_-</ _ \/ / _/ __/
 * (C)2020, Harold Iedema <harold@iedema.me>                                      |_.__/\_, |\__\___/___/_//_/_/_/ \__/
 * See LICENSE for licensing information                                                |__/             H A R M O N Y
 */
'use strict';

import {Profile} from './Profile';

export class Profiler
{
    public readonly profiles: Profile[] = [];

    constructor(public readonly isEnabled: boolean, private readonly maxProfiles: number)
    {
    }

    /**
     * Returns true if a profile with the given ID exists.
     *
     * @param {string} id
     * @returns {boolean}
     */
    public has(id: string): boolean
    {
        return !! this.profiles.find(p => p.id === id);
    }

    /**
     * Returns a profile with the given ID, or NULL if no such profile exists.
     *
     * @param {string} id
     * @returns {Profile | null}
     */
    public get(id: string): Profile|null
    {
        let profile;

        if (! (profile = this.profiles.find(p => p.id === id))) {
            return null;
        }

        return profile;
    }

    /**
     * Stores the given profile.
     *
     * @param {Profile} profile
     */
    public save(profile: Profile): void
    {
        if (! this.isEnabled) {
            return;
        }

        this.profiles.push(profile);

        if (this.profiles.length > (this.maxProfiles ?? 50)) {
            this.profiles.shift();
        }
    }
}
