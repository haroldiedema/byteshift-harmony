export declare class Cookie {
    name: string;
    value: string;
    maxAge: number;
    domain: string;
    path: string;
    expires: Date;
    httpOnly: boolean;
    secure: boolean;
    sameSite: SameSite;
    constructor(name: string, value: string);
    serialize(): string;
}
declare type SameSite = true | 'strict' | 'lax' | 'none';
export {};
