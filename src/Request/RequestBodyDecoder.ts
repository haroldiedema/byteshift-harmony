/* Byteshift Harmony                                                               _         _             __   _ _____
 *    A component-based HTTP server micro-framework                               | |__ _  _| |_ ___  ___ / /  (_) _/ /_
 *                                                                                | '_ \ || |  _/ -_|(_-</ _ \/ / _/ __/
 * (C)2020, Harold Iedema <harold@iedema.me>                                      |_.__/\_, |\__\___/___/_//_/_/_/ \__/
 * See LICENSE for licensing information                                                |__/             H A R M O N Y
 */
'use strict';

import {IncomingMessage, ServerResponse} from 'http';
import * as querystring                  from 'querystring';
import {getBoundary, parse}              from './MultipartParser';
import {RequestBody, RequestBodyPart}    from './RequestBody';

export class RequestBodyDecoder
{
    constructor(private readonly maxUploadSize: number)
    {
    }

    /**
     * Attempts to deserialize the request body into data suitable for a Bag.
     *
     * If this process fails, the body is most likely uploaded content like
     * a binary file.
     */
    public async decode(req: IncomingMessage, res: ServerResponse): Promise<RequestBody>
    {
        const body = await this.getRequestBody(req, res);
        const type = (req.headers['content-type'] || '');

        if (type.toLowerCase().startsWith('multipart/form-data')) {
            return this.parseMultipartFormData(res, type, body);
        }

        if (type.toLowerCase().startsWith('application/x-www-form-urlencoded')) {
            return this.parseFormUrlEncoded(res, body);
        }

        return new RequestBody(body, []);
    }

    /**
     * Parses the given body as a multipart/form-data payload.
     *
     * @param {ServerResponse} res
     * @param {string} type
     * @param {Buffer} body
     * @private
     */
    private parseMultipartFormData(res: ServerResponse, type: string, body: Buffer): RequestBody
    {
        return new RequestBody(body, parse(body, getBoundary(type)) as any);
    }

    /**
     * Parses the given body as a x-www-form-urlencoded payload.
     *
     * @param {ServerResponse} res
     * @param {Buffer} body
     * @returns {RequestBody}
     * @private
     */
    private parseFormUrlEncoded(res: ServerResponse, body: Buffer): RequestBody
    {
        try {
            const data: { [name: string]: any } = querystring.decode(body.toString());
            const parts: RequestBodyPart[]      = [];

            Object.keys(data).forEach((key: string) => {
                parts.push({
                    name: key,
                    data: Buffer.from(data[key])
                });
            });

            return new RequestBody(body, parts);
        } catch (e) {
            res.writeHead(413);
            res.end();
        }
    }

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
    private getRequestBody(req: IncomingMessage, res: ServerResponse): Promise<Buffer>
    {
        let body: Buffer[] = [],
            size: number   = 0;

        return new Promise((resolve, reject) => {
            req.on('data', (chunk) => {
                size += chunk.length;

                if (size > this.maxUploadSize) {
                    res.writeHead(413);
                    res.end();
                    req.socket.destroy();
                    throw new Error('Upload size too big.');
                }

                body.push(chunk);
            }).on('end', () => {
                resolve(Buffer.concat(body));
            }).on('error', (err) => {
                reject(err);
            });
        });
    }
}
