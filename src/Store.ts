import { Actor } from 'apify';

export class Store {
    private storeName: string;
    constructor(storeName: string) {
        this.storeName = storeName;
    }

    async getValue(key: string): Promise<unknown> {
        const store = await Actor.openKeyValueStore(this.storeName);
        const value = await store.getValue(key);
        return value;
    }

    async setValue(key: string, value: unknown): Promise<void> {
        const store = await Actor.openKeyValueStore(this.storeName);
        await store.setValue(key, value);
    }
}
