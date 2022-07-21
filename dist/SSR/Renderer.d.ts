import { Node } from './Node';
/**
 * JSX rendering function.
 */
export declare function h(tagName: string, attributes?: {
    [name: string]: any;
}, ...children: Node[] | string[]): Node;
