/* Byteshift Harmony                                                               _         _             __   _ _____
 *    A component-based HTTP server micro-framework                               | |__ _  _| |_ ___  ___ / /  (_) _/ /_
 *                                                                                | '_ \ || |  _/ -_|(_-</ _ \/ / _/ __/
 * (C)2020, Harold Iedema <harold@iedema.me>                                      |_.__/\_, |\__\___/___/_//_/_/_/ \__/
 * See LICENSE for licensing information                                                |__/             H A R M O N Y
 */
'use strict';

export function Template(name: string, options?: {[name: string]: any})
{
    options = options || {};

    return function(target: any, methodName: string, descriptor?: PropertyDescriptor) {
        if (typeof target.__TEMPLATES__ === 'undefined') {
            const __TEMPLATES__: {[name: string]: ITemplate} = {};
            Object.defineProperty(target, '__TEMPLATES__', {
                configurable: false,
                enumerable: false,
                get() {
                    return __TEMPLATES__;
                }
            });
        }

        if (typeof target.__TEMPLATES__[methodName] !== 'undefined') {
            throw new Error('Multiple @Template annotations found for method "' + methodName + '".');
        }

        target.__TEMPLATES__[methodName] = {name, options};
    };
}

export interface ITemplate
{
    /**
     * The name of the template.
     */
    name: string;

    /**
     * An options object passed to any subscribed render template event.
     */
    options?: any;
}
