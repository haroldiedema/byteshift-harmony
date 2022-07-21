import { Profile } from './Profile';
export declare class Profiler {
    readonly isEnabled: boolean;
    readonly profiles: Profile[];
    constructor(isEnabled: boolean);
    /**
     * Returns true if a profile with the given ID exists.
     *
     * @param {string} id
     * @returns {boolean}
     */
    has(id: string): boolean;
    /**
     * Returns a profile with the given ID, or NULL if no such profile exists.
     *
     * @param {string} id
     * @returns {Profile | null}
     */
    get(id: string): Profile | null;
    /**
     * Stores the given profile.
     *
     * @param {Profile} profile
     */
    save(profile: Profile): void;
}
