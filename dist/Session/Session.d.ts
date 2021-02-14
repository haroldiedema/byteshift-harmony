export declare class Session {
    private readonly data;
    constructor(sessionData: string);
    /**
     * Returns true if a stored item with the given key exists in the session.
     *
     * @param {string} key
     * @returns {boolean}
     */
    has(key: string): boolean;
    /**
     * Retrieves a value associated with the given key from the session.
     *
     * @param {string} key
     * @param {any}    defaultValue
     * @returns {any}
     */
    get(key: string, defaultValue?: any): any;
    /**
     * Stores the given value by the specified key in the session.
     *
     * @param {string} key
     * @param {any}    value
     */
    set(key: string, value: any): void;
    /**
     * Deletes a stored item from the session with the given key.
     *
     * @param {string} key
     */
    delete(key: string): void;
    /**
     * Returns a JSON-string representation of the data in this session.
     *
     * @returns {string}
     */
    toString(): string;
}
