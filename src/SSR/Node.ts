/* Byteshift Harmony                                                               _         _             __   _ _____
 *    A component-based HTTP server micro-framework                               | |__ _  _| |_ ___  ___ / /  (_) _/ /_
 *                                                                                | '_ \ || |  _/ -_|(_-</ _ \/ / _/ __/
 * (C)2020, Harold Iedema <harold@iedema.me>                                      |_.__/\_, |\__\___/___/_//_/_/_/ \__/
 * See LICENSE for licensing information                                                |__/             H A R M O N Y
 */
'use strict';

import {HarmonyElements} from './Elements';

export class Node
{
    /**
     * A set of void HTML element that don't require closing.
     *
     * @type {Set<string>}
     * @private
     */
    private voidElements: Set<string> = new Set([
        'area', 'base', 'col', 'command',
        'meta', 'link', 'img', 'br', 'hr',
        'embed', 'param', 'source', 'track',
        'wbr',
    ]);

    /**
     * A reference to our parent node.
     *
     * @type {Node}
     */
    public parentNode?: Node = null;

    /**
     * A unique identifier for this node.
     *
     * @type {string}
     */
    private readonly key: string;

    /**
     * A set of scripts added to the final output.
     *
     * @type {string[]}
     * @private
     */
    public readonly scripts: string[] = [];

    constructor(
        private readonly tagName: string,
        private readonly attributes: { [name: string]: any },
        private readonly children: Node[] | string[],
    )
    {
        for (const child of children) {
            if (Array.isArray(child)) {
                for (const innerChild of child) {
                    innerChild.parentNode = this;
                }
            } else if (child instanceof Node) {
                child.parentNode = this;
            }
        }

        this.key = `h${[ ...Array(8) ].map(() => (~~(Math.random() * 36)).toString(36)).join('')}`;
    }

    /**
     * Returns the root node.
     *
     * @returns {Node}
     */
    public get rootNode(): Node
    {
        if (!this.parentNode) {
            return this;
        }

        return this.parentNode;
    }

    /**
     * Returns true of this node represents a void element.
     *
     * @returns {boolean}
     * @private
     */
    private get isVoidElement(): boolean
    {
        return this.voidElements.has(this.tagName);
    }

    /**
     * Renders the HTML content of this node.
     *
     * @returns {string}
     */
    public render(): string
    {
        const children: string[] = [];

        for (const child of this.children.flat(100)) {
            if (Array.isArray(child)) {
                for (const innerChild of child) {
                    if (innerChild instanceof Node) {
                        children.push(innerChild.render());
                    } else {
                        children.push(innerChild);
                    }
                }
            } else if (child instanceof Node) {
                children.push(child.render());
            } else {
                children.push(child);
            }
        }

        const tagName    = this.toKebabCase(this.tagName);
        const attributes = this.serializeAttributes(this.attributes);

        if (this.rootNode !== this) {
            this.rootNode.scripts.push(...this.scripts);
        }

        if (this.isVoidElement) {
            return this.finalizeOutput(`<${tagName}${attributes}>`);
        }

        if (HarmonyElements.factories.has(this.tagName)) {
            const htmlOrNode = HarmonyElements.factories.get(this.tagName)(this.attributes, children.flat(100).join(''));

            if (htmlOrNode instanceof Node) {
                htmlOrNode.parentNode = this;
                return this.finalizeOutput(htmlOrNode.render());
            }

            return this.finalizeOutput(htmlOrNode);
        }

        return this.finalizeOutput(`<${tagName} ${this.key}${attributes}>${children.flat(100).join('')}</${tagName}>`);
    }

    private finalizeOutput(html: string): string
    {
        const output: string[] = [html];

        if (! this.parentNode) {
            output.push(
                `<script type="text/javascript">`,
                ...this.scripts,
                `</script>`
            );
        }

        return output.join('\n');
    }

    /**
     * Converts the given camelCase or PascalCase string to kebab-case.
     *
     * @param {string} str
     * @returns {string}
     * @private
     */
    private toKebabCase(str: string): string
    {
        // Special case.
        if (str === 'colSpan') {
            return 'colspan';
        }

        if (str === 'htmlFor') {
            return 'for';
        }

        return str.replace(
            /[A-Z]+(?![a-z])|[A-Z]/g,
            ($: string, ofs: number) => (ofs ? '-' : '') + $.toLowerCase(),
        );
    }

    /**
     * Creates the contents of a style-attribute based on the given object.
     *
     * @param {{[p: string]: string}} styles
     * @returns {string}
     */
    private createStyleAttributeOf(styles: { [name: string]: string }): string
    {
        const result: string[] = [];

        Object.keys(styles).forEach((key: string) => {
            result.push(`${this.toKebabCase(key)}: ${styles[key]}`);
        });

        return result.join(';');
    }

    /**
     * Serialize attributes object into a string that fits into an HTML-tag.
     *
     * @param {{[p: string]: any}} attributes
     * @returns {string}
     */
    private serializeAttributes(attributes?: { [key: string]: any }): string
    {
        if (!attributes) {
            return '';
        }

        const result: string[] = [];

        Object.keys(attributes || {}).forEach((attr) => {
            let name  = this.toKebabCase(attr),
                value = attributes[attr];

            if (name === 'style') {
                value = this.createStyleAttributeOf(value);
            }
            if (name === 'class' && typeof value === 'object') {
                value = this.getClassStringOf(value);
            }

            if (typeof value === 'boolean') {
                if (value) {
                    result.push(name);
                }
            } else if (typeof value === 'function') {
                if (name.startsWith('on')) {
                    const eventName: string = this.getEventNameOfAttribute(name);
                    this.scripts.push(`document.querySelector('[${this.key}]').addEventListener('${eventName}', ${value.toString()});`);
                } else {
                    throw new Error(`Cannot embed native javascript unless it is being bound to an event.`);
                }
            } else {
                result.push(`${name}="${value.toString()}"`);
            }
        });

        return result.length > 0 ? (' ' + result.join(' ')) : '';
    }

    /**
     * Returns a string suitable for a "class"-attribute based on the given
     * object.
     *
     * @param {{[p: string]: boolean}} obj
     * @returns {string}
     * @private
     */
    private getClassStringOf(obj: {[name: string]: boolean}): string
    {
        const result: string[] = [];

        Object.keys(obj).forEach((name: string) => {
            if (obj[name]) {
                result.push(name);
            }
        });

        return result.join(' ');
    }

    /**
     * Returns an event name for using in {@link document.addEventListener}
     * based on the given attribute name.
     *
     * @param {string} name
     * @returns {string}
     * @private
     */
    private getEventNameOfAttribute(name: string): string
    {
        return `${name.substr(3).split('-').join('').toLowerCase()}`;
    }
}
