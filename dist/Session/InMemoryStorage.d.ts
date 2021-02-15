import { ISessionStorage } from './ISessionStorage';
export declare class InMemoryStorage implements ISessionStorage {
    private storage;
    /**
     * @inheritDoc
     */
    delete(name: string): void;
    /**
     * @inheritDoc
     */
    gc(): void;
    /**
     * @inheritDoc
     */
    get(name: string): string | undefined;
    /**
     * @inheritDoc
     */
    set(name: string, value: string): void;
}
