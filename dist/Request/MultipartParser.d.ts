/// <reference types="node" />
declare type Input = {
    filename?: string;
    name?: string;
    type: string;
    data: Buffer;
};
export declare function parse(multipartBodyBuffer: Buffer, boundary: string): Input[];
export declare function getBoundary(header: string): string;
export {};
