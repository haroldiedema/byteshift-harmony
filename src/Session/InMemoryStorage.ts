/* Byteshift Harmony                                                               _         _             __   _ _____
 *    A component-based HTTP server micro-framework                               | |__ _  _| |_ ___  ___ / /  (_) _/ /_
 *                                                                                | '_ \ || |  _/ -_|(_-</ _ \/ / _/ __/
 * (C)2020, Harold Iedema <harold@iedema.me>                                      |_.__/\_, |\__\___/___/_//_/_/_/ \__/
 * See LICENSE for licensing information                                                |__/             H A R M O N Y
 */
'use strict';

import {ISessionStorage} from './ISessionStorage';

export class InMemoryStorage implements ISessionStorage
{
    private storage: Map<string, { ttl: number, data: string }> = new Map();

    /**
     * @inheritDoc
     */
    public delete(name: string): void
    {
        this.storage.delete(name);
    }

    /**
     * @inheritDoc
     */
    public gc(): void
    {
        const now: number       = new Date().getTime(),
              toPurge: string[] = [];

        this.storage.forEach((item: { ttl: number, data: string }, name: string) => {
            if (now > item.ttl) {
                toPurge.push(name);
            }
        });

        toPurge.forEach((name: string) => this.storage.delete(name));
    }

    /**
     * @inheritDoc
     */
    public get(name: string): string | undefined
    {
        return this.storage.has(name) ? this.storage.get(name).data : undefined;
    }

    /**
     * @inheritDoc
     */
    public set(name: string, value: string): void
    {
        // Store session data for 24h.
        this.storage.set(name, {data: value, ttl: (new Date()).getTime() + (86400 * 1000)});
    }
}
