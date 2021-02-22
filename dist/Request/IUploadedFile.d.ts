/// <reference types="node" />
export interface IUploadedFile {
    name: string;
    fileName: string;
    mimeType: string;
    data: Buffer;
}
