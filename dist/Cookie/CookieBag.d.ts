export declare class CookieBag {
    private _cookies;
    constructor();
    /**
     * Sets a cookie with the given name and value with a lifetime of the given
     * amount of seconds.
     */
    set(name: string, value: string, ttl?: number, domain?: string, path?: string, httpOnly?: boolean, secure?: boolean, sameSite?: true | 'strict' | 'lax' | 'none'): void;
    /**
     * Returns header value strings for all cookies currently in the bag.
     *
     * @returns {string[]}
     */
    serialize(): string[];
}
