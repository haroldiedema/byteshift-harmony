import { Response } from '../Response/Response';
export declare abstract class ResponseAwareEvent {
    private response;
    setResponse(response: Response): void;
    hasResponse(): boolean;
    getResponse(): Response;
}
