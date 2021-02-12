/* Byteshift Elements                                                              _         _             __   _ _____
 *    A self-encapsulating WebComponent framework                                 | |__ _  _| |_ ___  ___ / /  (_) _/ /_
 *                                                                                | '_ \ || |  _/ -_|(_-</ _ \/ / _/ __/
 * (C)2020, Harold Iedema <harold@iedema.me>                                      |_.__/\_, |\__\___/___/_//_/_/_/ \__/
 * See LICENSE for licensing information                                                |__/                   H T T P
 */
'use strict';
import 'reflect-metadata';

type MethodType = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS';

interface IRouteOptions
{
    method?: MethodType | MethodType[];
}

export function Route(path: string, options?: IRouteOptions)
{
    options = options || {};

    return function(target: any, methodName: string, descriptor?: PropertyDescriptor) {
        if (typeof target.__ROUTES__ === 'undefined') {
            target.__ROUTES__ = {};
        }
        if (typeof target.__ROUTES__[methodName] === 'undefined') {
            target.__ROUTES__[methodName] = [];
        }

        // Extract method signature.
        const methodArgs = [];
        const paramTypes = Reflect.getMetadata('design:paramtypes', target, methodName);
        const paramRegEx = /^(\w+)\(([A-Za-z0-9_,\s]+)\)/i.exec(target[methodName].toString());
        const paramNames = (paramRegEx && paramRegEx[2]) ? paramRegEx[2].split(',').map(n => n.trim()) : [];

        if (paramNames) {
            for (let i = 0; i < paramNames.length; i++) {
                methodArgs.push({
                    name: paramNames[i],
                    type: paramTypes[i],
                });
            }
        }

        target.__ROUTES__[methodName].push({
            path:      path,
            method:    options.method || 'GET',
            signature: methodArgs,
        });
    };
}
