export declare class Bag<T> {
    private keys;
    private data;
    constructor(obj?: {
        [name: string]: any;
    });
    /**
     * Returns the amount of entries in this bag.
     *
     * @return {number}
     */
    get size(): number;
    /**
     * Inserts all data from the given object in this bag.
     */
    insert(obj: {
        [name: string]: T;
    }): void;
    /**
     * Returns the data associated with the given name.
     *
     * @param {string} name
     * @return {*}
     */
    get(name: string): T;
    /**
     * Returns true if an item with the given name exists.
     *
     * @param {string} name
     * @return {boolean}
     */
    has(name: string): boolean;
    /**
     * Defines a key and stores the given data.
     *
     * @param name
     * @param data
     */
    set(name: string, data: T): void;
    /**
     * Returns all stored data with their initial defined key names.
     *
     * @return {{[p: string]: any}}
     */
    get all(): {
        [name: string]: T;
    };
    forEach(callback: (value: T, name: string) => any): void;
}
