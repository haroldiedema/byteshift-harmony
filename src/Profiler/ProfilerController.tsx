/* Byteshift Harmony                                                               _         _             __   _ _____
 *    A component-based HTTP server micro-framework                               | |__ _  _| |_ ___  ___ / /  (_) _/ /_
 *                                                                                | '_ \ || |  _/ -_|(_-</ _ \/ / _/ __/
 * (C)2020, Harold Iedema <harold@iedema.me>                                      |_.__/\_, |\__\___/___/_//_/_/_/ \__/
 * See LICENSE for licensing information                                                |__/             H A R M O N Y
 */
'use strict';

import {HtmlResponse} from '../Response/HtmlResponse';
import {Response}     from '../Response/Response';
import {Route}        from '../Router/Route';
import {Node}         from '../SSR/Node';
import {h}            from '../SSR/Renderer';
import {Profile}      from './Profile';
import {Profiler}     from './Profiler';

export class ProfilerController
{
    constructor(private readonly profiler: Profiler)
    {
    }

    @Route('/_profiler', {method: 'GET'})
    public indexAction(): HtmlResponse
    {
        let message: string = this.profiler.profiles.length === 0
                              ? 'There are no profiles. Make a request to capture a profile.'
                              : 'Select a profile from the list on the left.';

        return new HtmlResponse(this.document(
            <div class="title-message">
                {message}
            </div>,
        ));
    }

    @Route('/_profiler/:id', {method: 'GET'})
    public profileAction(id: string): Response
    {
        if (!this.profiler.has(id)) {
            return new HtmlResponse(this.document(
                <div class="title-message">
                    The requested profile no longer exists.
                </div>,
            ));
        }

        const profile = this.profiler.get(id);

        return new HtmlResponse(this.document((
            <div id="app">
                <h2>Timeline</h2>
                {this.renderTimelineElementsOf(profile)}

                <h2>Request</h2>
                <table>
                    <tbody>
                        <tr>
                            <td class="label">Request method</td>
                            <td class="value">{profile.request.method}</td>
                        </tr>
                        <tr>
                            <td class="label">URL</td>
                            <td class="value">{profile.hRequest?.path ?? 'N/A'}</td>
                        </tr>
                        <tr>
                            <td class="label">Client IP</td>
                            <td class="value">{profile.hRequest?.clientIp ?? 'N/A'}</td>
                        </tr>
                        <tr>
                            <td class="label">Controller</td>
                            <td class="value">{profile.hRoute?._controller[0].name ?? '-'}.{profile.hRoute?._controller[1]}</td>
                        </tr>

                        <tr><td colSpan={2} class="table-header">Request headers</td></tr>
                        {Object.keys(profile.hRequest?.headers.all ?? {}).map(name => {
                            return (
                                <tr>
                                    <td class="label">{name}</td>
                                    <td class="value">{profile.hRequest.headers.get(name)}</td>
                                </tr>
                            );
                        })}

                        {profile.hRequest?.query.size > 0 ? ([
                            <tr><td colSpan={2} class="table-header">Query parameters</td></tr>,
                            ...Object.keys(profile.hRequest?.query.all ?? {}).map(name => {
                                return (
                                    <tr>
                                        <td class="label">{name}</td>
                                        <td class="value">{profile.hRequest.query.get(name)}</td>
                                    </tr>
                                );
                            })
                        ]) : null}

                        {profile.hRequest?.post.size > 0 ? ([
                            <tr><td colSpan={2} class="table-header">Post fields</td></tr>,
                            ...Object.keys(profile.hRequest?.post.all ?? {}).map(name => {
                                return (
                                    <tr>
                                        <td class="label">{name}</td>
                                        <td class="value">{profile.hRequest.post.get(name)}</td>
                                    </tr>
                                );
                            })
                        ]) : null}

                        {profile.hRequest?.cookies.size > 0 ? ([
                            <tr><td colSpan={2} class="table-header">Cookies</td></tr>,
                            ...Object.keys(profile.hRequest?.cookies.all ?? {}).map(name => {
                                return (
                                    <tr>
                                        <td class="label">{name}</td>
                                        <td class="value">{profile.hRequest.cookies.get(name)}</td>
                                    </tr>
                                );
                            })
                        ]) : null}

                        {profile.files.length > 0 ? ([
                            <tr><td colSpan={2} class="table-header">Uploaded files</td></tr>,
                            ...profile.files.map(file => {
                                return (
                                    <tr>
                                        <td class="label">{file.fieldName}</td>
                                        <td class="value">
                                            <table>
                                                <tbody>
                                                    {file.files.map(uploadedFile => {
                                                        return [
                                                            <tr>
                                                                <td class="label">File name</td>
                                                                <td class="value">{uploadedFile.fileName}</td>
                                                            </tr>,
                                                            <tr>
                                                                <td class="label">Name</td>
                                                                <td class="value">{uploadedFile.name}</td>
                                                            </tr>,
                                                            <tr>
                                                                <td class="label">Mime type</td>
                                                                <td class="value">{uploadedFile.mimeType}</td>
                                                            </tr>,
                                                            <tr>
                                                                <td class="label">Size in bytes</td>
                                                                <td class="value">{uploadedFile.data.length}</td>
                                                            </tr>,
                                                        ];
                                                    })}
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                );
                            })
                        ]) : null}

                    </tbody>
                </table>
                <h2>Response</h2>
                <table>
                    <tbody>
                        <tr>
                            <td class="label">Status code</td>
                            <td class="value">{profile.statusCode || 'N/A'}</td>
                        </tr>
                        <tr>
                            <td class="label">Response class</td>
                            <td class="value">{profile.hResponse?.constructor.name ?? 'N/A'}</td>
                        </tr>
                        <tr>
                            <td class="label">Size in bytes</td>
                            <td class="value">{profile.hResponse?.content.length ?? 'N/A'}</td>
                        </tr>
                        {profile.hResponse?.headers.size > 0 ? ([
                            <tr><td colSpan={2} class="table-header">Response headers</td></tr>,
                            ...Object.keys(profile.hResponse?.headers.all ?? {}).map(name => {
                                return (
                                    <tr>
                                        <td class="label">{name}</td>
                                        <td class="value">{profile.hResponse?.headers.get(name)}</td>
                                    </tr>
                                );
                            })
                        ]) : null}
                    </tbody>
                </table>
            </div>
        ), id));
    }

    /**
     * Renders a timeline of the given profile.
     *
     * @param {Profile} profile
     * @returns {Node}
     * @private
     */
    private renderTimelineElementsOf(profile: Profile): Node
    {
        return (
            <div>
                <div id="timelineHeader">
                    <div>
                        0ms
                    </div>
                    <div>
                        {(profile.totalTime / 1000).toFixed(3)}ms
                    </div>
                </div>
                <div id="timeline">
                    {this.createTimelineOf(profile).map(item => {
                        return (
                            <div class="item" style={{marginLeft: item.x + '%', width: item.w + '%'}}>
                                <div class="label">
                                    <span>{item.t}</span>
                                    {item.n}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    /**
     * Creates a normalized timeline of the given profile.
     *
     * @param {Profile} profile
     * @returns {any[]}
     * @private
     */
    private createTimelineOf(profile: Profile): any[]
    {
        const timeStart     = Math.min(...profile.timing.map(t => t.startedAt)),
              timeEnd       = Math.max(...profile.timing.map(t => t.startedAt + t.time)),
              result: any[] = [];

        for (const timing of profile.timing) {
            result.push({
                x: this.convertRange(timing.startedAt, [timeStart, timeEnd], [0, 100]),
                w: this.convertRange(timeStart + timing.time, [timeStart, timeEnd], [0, 100]),
                n: timing.name,
                t: (timing.time / 1000).toFixed(3) + 'ms',
            });
        }

        return result;
    }

    /**
     * Converts the scale of {value} from {r1} to {r2}.
     *
     * @param {number} value
     * @param {number[]} r1
     * @param {number[]} r2
     * @returns {number}
     * @private
     */
    private convertRange(value: number, r1: number[], r2: number[]): number
    {
        return (value - r1[0]) * (r2[1] - r2[0]) / (r1[1] - r1[0]) + r2[0];
    }

    /**
     * Renders the common base document of the profiler.
     *
     * @param {Node}   content
     * @param {string} activeProfileId
     * @returns {Node}
     * @private
     */
    private document(content: Node, activeProfileId?: string): Node
    {
        return (
            <html>
            <head>
                <title>Harmony Profiler</title>
                <meta charset="UTF-8"/>
                <style>{this.getDocumentStylesheet()}</style>
            </head>
            <body>
            <header>
                <h1>Harmony Profiler</h1>
            </header>
            <main>
                <aside>
                    {Array.from(this.profiler.profiles).reverse().map((profile) => {
                        return (
                            <a href={`/_profiler/${profile.id}`} class={{active: activeProfileId === profile.id}}>
                                <span class="status">[{profile.request.method}]</span>
                                <span class="status">[{profile.statusCode}]</span>
                                {profile.name}
                                <span>{profile.createdAt.toLocaleString()}</span>
                            </a>
                        );
                    })}
                </aside>
                <section>
                    {content}
                </section>
            </main>
            </body>
            </html>
        );
    }

    private getDocumentStylesheet(): string
    {
        return `
        * { box-sizing: border-box; }
        ::-webkit-scrollbar {
            width: 12px;
        }
         
        ::-webkit-scrollbar-track {
            -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3); 
            border-radius: 0;
        }
         
        ::-webkit-scrollbar-thumb {
            border-radius: 0;
            -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.5); 
        }
        
        body,html {
            padding: 0;
            margin: 0;
            font-family: arial, sans-serif;
            font-size: 14px;
            color: #eee;
            background: #303030;
        }
        header {
            background: #3a3a3a;
            display: flex;
            flex-direction: row;
            width: 100%;
            height: 64px;
            padding: 15px;
        }
        header > h1 {
            padding: 0;
            margin: 0;
        }
        main {
            display: flex;
            flex-direction: row;
            width: 100%;
            height: calc(100vh - 64px);
        }
        main > aside {
            background: #303030;
            width: 400px;
            border-right: 1px solid #ccc;
            overflow-x: hidden;
            overflow-y: auto;
        }
        main > section {
            display: block;
            position: relative;
            width: 100%;
            height: 100%;
            border-top: 1px solid #666;
            overflow-x: hidden;
            overflow-y: scroll;
        }
        main > aside > a {
            display: block;
            max-width: 460px;
            padding: 10px 15px;
            border-top: 1px solid #666;
            text-decoration: none;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: #ddd;
        }
        main > aside > a:last-child {
            border-bottom: 1px solid #666;
        }
        main > aside > a:hover {
            background: #3a3a3a;
            cursor: pointer;
        }
        main > aside > a.active {
            background: #3a3a3a;
            font-weight: bold;
        }
        main > aside > a > span {
            display: block;
            font-size: 10px;
            font-weight: normal;
            color: #666;
        }
        main > aside > a > span.status {
            display: inline;
            font-size: 12px;
            font-weight: bold;
            color: #666;
            margin-right: 8px;
        }
        main > section > .title-message {
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 18px;
            color: #ddd;
            text-shadow: 1px 0 #555;
            text-align: center;
            width: 100%;
            height: 100%;
        }
        #app {
            padding: 20px;
        }
        #app > h1 {
            margin: 0;
            margin-bottom: 20px;
            color: #ddd;
        }
        #app > h1 > span {
            margin: 0 10px;
            color: #666;
        }
        #timeline {
            margin-bottom: 20px;
            width: 100%;
            padding: 10px;
            background: #303030;
            border: 1px solid #666;
            border-top: 0;
            position: relative;
            overflow-x: scroll;
        }
        #timeline > .item {
            position: relative;
            display: block;
            height: 4px;
            margin-bottom: 16px;
            color: #ccc;
            background: #ca6;
        }
        #timeline > .item > .label {
            position: absolute;
            font-family: arial, sans-serif;
            font-size: 9px;
            top: 4px;
            left: 0;
            white-space: nowrap;
            border-left: 2px solid #ca6;
            border-bottom: 1px dotted #ca6;
            padding-left: 2px;
            margin-right: 15px;
        }
        #timeline > .item > .label span {
            color: #999;
            margin-right: 6px;
        }
        #timelineHeader {
            display: flex;
            width: 100%;
            background: #3a3a3a;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            border: 1px solid #666;
            border-bottom: 0;
            font-family: arial, sans-serif;
            font-size: 10px;
            color: #ddd;
            padding: 10px;
        }
        h2 {
            margin: 0;
            padding: 0;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
            font-family: monospace;
            font-size: 11px;
            color: #ddd;
            background: #3a3a3a;
        }
        
        table .label {
            text-align: right;
            padding: 4px;
            border: 1px solid #666;
            white-space: nowrap;
        }
        table .value {
            padding: 4px;
            color: #fff;
            border: 1px solid #666;
            width: 99%;
        }
        table .table-header {
            border: 1px solid #666;
            padding: 4px;
            font-weight: bold;
            font-size: 12px;
            background: #444;
        }
        table table {
            margin: 0;
        }
        `;
    }
}
