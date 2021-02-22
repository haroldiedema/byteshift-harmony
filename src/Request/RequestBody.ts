/* Byteshift Harmony                                                               _         _             __   _ _____
 *    A component-based HTTP server micro-framework                               | |__ _  _| |_ ___  ___ / /  (_) _/ /_
 *                                                                                | '_ \ || |  _/ -_|(_-</ _ \/ / _/ __/
 * (C)2020, Harold Iedema <harold@iedema.me>                                      |_.__/\_, |\__\___/___/_//_/_/_/ \__/
 * See LICENSE for licensing information                                                |__/             H A R M O N Y
 */
'use strict';

import {Bag}           from '../Bag';
import {IUploadedFile} from './IUploadedFile';

export class RequestBody
{
    public fields: Bag<string | string[]>              = new Bag();
    public files: Bag<IUploadedFile | IUploadedFile[]> = new Bag();

    constructor(public readonly raw: Buffer, parts: RequestBodyPart[])
    {
        for (let part of parts) {
            this.addPartToBag(part, part.filename ? this.files : this.fields, !!part.filename);
        }
    }

    private addPartToBag(part: RequestBodyPart, bag: Bag<any>, isFile: boolean): void
    {
        const name = part.name;

        if (name.endsWith('[]')) {
            if (!bag.has(name)) {
                bag.set(name, []);
            }
            if (isFile) {
                bag.get(name).push({
                    name:     name,
                    fileName: part.filename,
                    mimeType: part.type,
                    data:     part.data,
                } as IUploadedFile);
            } else {
                bag.get(name).push(part.data.toString());
            }
        } else {
            if (isFile) {
                bag.set(name, {
                    name:     name,
                    fileName: part.filename,
                    mimeType: part.type,
                    data:     part.data,
                } as IUploadedFile);
            } else {
                bag.set(name, part.data.toString());
            }
        }
    }
}

export type RequestBodyPart = {
    name: string;
    data: Buffer;
    type?: string;
    filename?: string;
}

type UploadedFile = {
    fileName: string;
    fileType: string;
    data: Buffer;
}
