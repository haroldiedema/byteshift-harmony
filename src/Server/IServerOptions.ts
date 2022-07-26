/* Byteshift Harmony                                                               _         _             __   _ _____
 *    A component-based HTTP server micro-framework                               | |__ _  _| |_ ___  ___ / /  (_) _/ /_
 *                                                                                | '_ \ || |  _/ -_|(_-</ _ \/ / _/ __/
 * (C)2020, Harold Iedema <harold@iedema.me>                                      |_.__/\_, |\__\___/___/_//_/_/_/ \__/
 * See LICENSE for licensing information                                                |__/             H A R M O N Y
 */
'use strict';

import http from 'http';
import tls  from 'tls';

export interface IServerOptions
{
    /**
     * HTTP server version.
     *
     * Defaults to 1.
     */
    httpVersion?: 1 | 2;

    /**
     * The port to listen on for incoming connections.
     *
     * Defaults to 8000.
     */
    port?: number;

    /**
     * The maximum size of a request body in bytes.
     *
     * Make sure to keep this number relatively low to prevent flood attacks.
     * Defaults to 1MB.
     */
    maxUploadSize?: number;

    /**
     * Whether to use an HTTPS server rather than HTTP.
     * Use the 'sslOptions' object to pass options to the HTTP server like SSL
     * certificate files, etc.
     *
     * Defaults to false.
     */
    enableHttps?: boolean;

    /**
     * Options to pass to {https.createServer} when 'useHttps' is enabled.
     */
    httpsOptions?: tls.SecureContextOptions & tls.TlsOptions & http.ServerOptions;

    /**
     * SNI (Server Name Identification) configuration used for serving multiple
     * domains over HTTPS with different certificates.
     */
    sni?: { [hostname: string]: tls.SecureContextOptions };
}
