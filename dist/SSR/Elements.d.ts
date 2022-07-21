import { Node } from './Node';
/**
 * Returns a custom HTML element suitable for SSR.
 */
export declare type HarmonyElementFactory = (attributes: {
    [name: string]: any;
}, html: string) => string | Node;
export declare const HarmonyElements: {
    factories: Map<string, HarmonyElementFactory>;
};
