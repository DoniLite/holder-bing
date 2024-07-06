import { Actor } from 'apify';
import { Dictionary } from 'crawlee';

export class CustomDataset {
    dataset: string;
    constructor(dataset: string) {
        this.dataset = dataset;
    }

    async setData(...args: dataArgs[]): Promise<void> {
        const dataset = await Actor.openDataset(this.dataset);
        // Write a single row
        await dataset.pushData([...args]);
    }

    async exportData(): Promise<StoreData> {
        const dataset = await Actor.openDataset(this.dataset);
        const data = dataset.export();
        return data;
    }
}

type dataArgs = {
    [string: string]: string
}
type StoreData = Dictionary[];
