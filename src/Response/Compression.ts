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
            response.write(content);
            response.end();
            return;
        }

        switch (encoding) {
            case this.brotli:
                return this.sendBrotli(response, content);
            case this.gzip:
                return this.sendGzip(response, content);
            case this.deflate:
                return this.sendDeflate(response, content);
            default:
                return this.sendUncompressed(response, content);
        }
    }

    private static sendUncompressed(response: RawHttpResponse, content: Buffer): void
    {
        response.write(content);
        response.end();
    }

    private static sendGzip(response: RawHttpResponse, content: Buffer): void
    {
        zlib.gzip(content, (err, compressed) => {
            if (err) {
                return Compression.sendUncompressed(response, content);
            }
            response.setHeader('Content-Encoding', this.gzip);
            response.setHeader('Vary', 'Accept-Encoding');
            response.write(compressed);
            response.end();
        });
    }

    private static sendBrotli(response: RawHttpResponse, content: Buffer): void
    {
        zlib.brotliCompress(content, (err, compressed) => {
            if (err) {
                return Compression.sendUncompressed(response, content);
            }
            response.setHeader('Content-Encoding', this.brotli);
            response.setHeader('Vary', 'Accept-Encoding');
            response.write(compressed);
            response.end();
        });
    }

    private static sendDeflate(response: RawHttpResponse, content: Buffer): void
    {
        zlib.deflate(content, (err, compressed) => {
            if (err) {
                return Compression.sendUncompressed(response, content);
            }
            response.setHeader('Content-Encoding', this.deflate);
            response.setHeader('Vary', 'Accept-Encoding');
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
