/* Byteshift Harmony                                                               _         _             __   _ _____
 *    A component-based HTTP server micro-framework                               | |__ _  _| |_ ___  ___ / /  (_) _/ /_
 *                                                                                | '_ \ || |  _/ -_|(_-</ _ \/ / _/ __/
 * (C)2020, Harold Iedema <harold@iedema.me>                                      |_.__/\_, |\__\___/___/_//_/_/_/ \__/
 * See LICENSE for licensing information                                                |__/             H A R M O N Y
 */
'use strict';

import {Node} from './Node';

/**
 * Returns a custom HTML element suitable for SSR.
 */
export type HarmonyElementFactory = (attributes: { [name: string]: any }, html: string) => string|Node;

export const HarmonyElements = {
    factories: new Map<string, HarmonyElementFactory>(),
};
