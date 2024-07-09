import { Actor } from 'apify';
import { Input, ValueAndStore } from './index.js';

export class Store {
    private storeName: string | undefined;
    constructor(storeName?: string) {
        this.storeName = storeName;
    }

    async getValue<T extends keyof unknown>(key: string): Promise<ValueAndStore<T>> {
        const store = await Actor.openKeyValueStore(this.storeName);
        const value = await store.getValue<T>(key) as T;
        return {
            value,
            storeInstance: store,
        };
    }

    async setValue(key: string, value: unknown): Promise<void> {
        const store = await Actor.openKeyValueStore(this.storeName);
        await store.setValue(key, value);
    }

    async setToDefaultSote(value: Input): Promise<void> {
        const store = await Actor.openKeyValueStore();
        await store.setValue('INPUT', value);
    }

    async getToDefaultSote<T extends Input>(): Promise<ValueAndStore<T>> {
        const store = await Actor.openKeyValueStore();
        const inputs = await store.getValue<Input>('INPUT') as T;
        return {
            value: inputs,
            storeInstance: store,
        };
    }
}
