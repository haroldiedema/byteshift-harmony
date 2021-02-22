/// <reference types="node" />
import { IncomingMessage, ServerResponse } from 'http';
import { RequestBody } from './RequestBody';
export declare class RequestBodyDecoder {
    private readonly maxUploadSize;
    constructor(maxUploadSize: number);
    /**
     * Attempts to deserialize the request body into data suitable for a Bag.
     *
     * If this process fails, the body is most likely uploaded content like
     * a binary file.
     */
    decode(req: IncomingMessage, res: ServerResponse): Promise<RequestBody>;
    /**
     * Parses the given body as a multipart/form-data payload.
     *
     * @param {ServerResponse} res
     * @param {string} type
     * @param {Buffer} body
     * @private
     */
    private parseMultipartFormData;
    /**
     * Parses the given body as a x-www-form-urlencoded payload.
     *
     * @param {ServerResponse} res
     * @param {Buffer} body
     * @returns {RequestBody}
     * @private
     */
    private parseFormUrlEncoded;
    /**
     * Wait for the request to complete, then return the request body.
     *
     * Sends an HTTP 413 status back to the client if the request body exceeds
     * the maximum upload size.
     *
     * @param {IncomingMessage} req
     * @param {ServerResponse} res
     * @returns {Promise<Buffer>}
     * @private
     */
    private getRequestBody;
}
