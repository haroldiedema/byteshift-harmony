import { ServerError } from './ServerError';
/**
 * @deprecated Use {@link ForbiddenError} instead.
 */
export declare class AccessDeniedError extends ServerError {
    constructor(message?: string);
}
