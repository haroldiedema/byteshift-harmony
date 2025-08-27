/// <reference types="node" />
import { Request } from '../Request/Request';
import { RawHttpResponse } from '../Server/RawHttpResponse';
export declare class Compression {
    private static gzip;
    private static deflate;
    private static brotli;
    static send(request: Request, response: RawHttpResponse, content: Buffer, options: {
        enabled: boolean;
        minSize?: number;
    }): void;
    private static sendUncompressed;
    private static sendGzip;
    private static sendBrotli;
    private static sendDeflate;
    private static selectEncoding;
}
