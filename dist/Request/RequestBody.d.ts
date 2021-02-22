/// <reference types="node" />
import { Bag } from '../Bag';
import { IUploadedFile } from './IUploadedFile';
export declare class RequestBody {
    readonly raw: Buffer;
    fields: Bag<string | string[]>;
    files: Bag<IUploadedFile | IUploadedFile[]>;
    constructor(raw: Buffer, parts: RequestBodyPart[]);
    private addPartToBag;
}
export declare type RequestBodyPart = {
    name: string;
    data: Buffer;
    type?: string;
    filename?: string;
};
