export declare class Node {
    private readonly tagName;
    private readonly attributes;
    private readonly children;
    /**
     * A set of void HTML element that don't require closing.
     *
     * @type {Set<string>}
     * @private
     */
    private voidElements;
    /**
     * A reference to our parent node.
     *
     * @type {Node}
     */
    parentNode?: Node;
    /**
     * A unique identifier for this node.
     *
     * @type {string}
     */
    private readonly key;
    /**
     * A set of scripts added to the final output.
     *
     * @type {string[]}
     * @private
     */
    readonly scripts: string[];
    constructor(tagName: string, attributes: {
        [name: string]: any;
    }, children: Node[] | string[]);
    /**
     * Returns the root node.
     *
     * @returns {Node}
     */
    get rootNode(): Node;
    /**
     * Returns true of this node represents a void element.
     *
     * @returns {boolean}
     * @private
     */
    private get isVoidElement();
    /**
     * Renders the HTML content of this node.
     *
     * @returns {string}
     */
    render(): string;
    private finalizeOutput;
    /**
     * Converts the given camelCase or PascalCase string to kebab-case.
     *
     * @param {string} str
     * @returns {string}
     * @private
     */
    private toKebabCase;
    /**
     * Creates the contents of a style-attribute based on the given object.
     *
     * @param {{[p: string]: string}} styles
     * @returns {string}
     */
    private createStyleAttributeOf;
    /**
     * Serialize attributes object into a string that fits into an HTML-tag.
     *
     * @param {{[p: string]: any}} attributes
     * @returns {string}
     */
    private serializeAttributes;
    /**
     * Returns a string suitable for a "class"-attribute based on the given
     * object.
     *
     * @param {{[p: string]: boolean}} obj
     * @returns {string}
     * @private
     */
    private getClassStringOf;
    /**
     * Returns an event name for using in {@link document.addEventListener}
     * based on the given attribute name.
     *
     * @param {string} name
     * @returns {string}
     * @private
     */
    private getEventNameOfAttribute;
}
