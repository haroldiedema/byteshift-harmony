export interface ISessionStorage {
    /**
     * Retrieves an item from the session storage.
     *
     * @param {string} name
     * @returns {string}
     */
    get(name: string): string | undefined;
    /**
     * Stores an item to the session storage.
     *
     * @param {string} name
     * @param {string} value
     */
    set(name: string, value: string): void;
    /**
     * Deletes an item from the session storage.
     *
     * @param {string} name
     */
    delete(name: string): void;
    /**
     * Purges any expired session data from the storage.
     */
    gc(): void;
}
