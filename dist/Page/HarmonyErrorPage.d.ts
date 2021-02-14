import { ErrorEvent } from '../Event/ErrorEvent';
export declare class HarmonyErrorPage {
    /**
     * @param {ErrorEvent} event
     * @returns {boolean | void}
     */
    onServerError(event: ErrorEvent): void;
}
