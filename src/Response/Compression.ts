import * as zlib         from 'zlib';
import {Request}         from '../Request/Request';
import {RawHttpResponse} from '../Server/RawHttpResponse';

export class Compression
{
    private static gzip: string    = 'gzip';
    private static deflate: string = 'deflate';
    private static brotli: string  = 'br';

    public static send(
        request: Request,
        response: RawHttpResponse,
        status: number,
        headers: Record<string, string>,
        content: Buffer,
        options: { enabled: boolean, minSize?: number },
    ): void
    {
        if (! options.enabled) {
            response.write(content);
            response.end();
            return;
        }

        const encoding: string = Compression.selectEncoding(request.headers.get('Accept-Encoding') || '');
        const minSize: number  = options.minSize || 1024;

        if (content.length < minSize || ! encoding) {
            return this.sendUncompressed(response, status, headers, content);
        }

        switch (encoding) {
            case this.brotli:
                return this.sendBrotli(response, status, headers, content);
            case this.gzip:
                return this.sendGzip(response, status, headers, content);
            case this.deflate:
                return this.sendDeflate(response, status, headers, content);
            default:
                return this.sendUncompressed(response, status, headers, content);
        }
    }

    private static sendUncompressed(
        response: RawHttpResponse,
        status: number,
        headers: Record<string, string>,
        content: Buffer,
    ): void
    {
        response.writeHead(status, headers);
        response.write(content);
        response.end();
    }

    private static sendGzip(
        response: RawHttpResponse,
        status: number,
        headers: Record<string, string>,
        content: Buffer,
    ): void
    {
        zlib.gzip(content, (err, compressed) => {
            if (err) {
                return Compression.sendUncompressed(response, status, headers, content);
            }

            headers['Content-Encoding'] = this.gzip;
            headers['Content-Length']   = String(compressed.length);
            headers['Vary']             = 'Accept-Encoding';

            response.writeHead(status, headers);
            response.write(compressed);
            response.end();
        });
    }

    private static sendBrotli(
        response: RawHttpResponse,
        status: number,
        headers: Record<string, string>,
        content: Buffer,
    ): void
    {
        zlib.brotliCompress(content, (err, compressed) => {
            if (err) {
                return Compression.sendUncompressed(response, status, headers, content);
            }

            headers['Content-Encoding'] = this.brotli;
            headers['Content-Length']   = String(compressed.length);
            headers['Vary']             = 'Accept-Encoding';

            response.writeHead(status, headers);
            response.write(compressed);
            response.end();
        });
    }

    private static sendDeflate(
        response: RawHttpResponse,
        status: number,
        headers: Record<string, string>,
        content: Buffer,
    ): void
    {
        zlib.deflate(content, (err, compressed) => {
            if (err) {
                return Compression.sendUncompressed(response, status, headers, content);
            }

            headers['Content-Encoding'] = this.deflate;
            headers['Content-Length']   = String(compressed.length);
            headers['Vary']             = 'Accept-Encoding';

            response.writeHead(status, headers);
            response.write(compressed);
            response.end();
        });
    }

    private static selectEncoding(acceptEncoding: string): string | null
    {
        if (acceptEncoding.includes(this.brotli)) {
            return this.brotli;
        }

        if (acceptEncoding.includes(this.gzip)) {
            return this.gzip;
        }

        if (acceptEncoding.includes(this.deflate)) {
            return this.deflate;
        }

        return null;
    }
}
