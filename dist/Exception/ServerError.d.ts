import { HttpStatus } from '../Response/Response';
export declare abstract class ServerError extends Error {
    readonly title: string;
    readonly message: string;
    readonly statusCode: HttpStatus;
    protected constructor(title: string, message: string, statusCode: HttpStatus);
}
