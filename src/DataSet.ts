import { Actor } from 'apify';

export class Dataset {
    dataset: string;
    constructor(dataset: string) {
        this.dataset = dataset;
    }

    async setData(...args: dataArgs[]): Promise<void> {
        const dataset = await Actor.openDataset('some-name');
        // Write a single row
        args.forEach(arg => {
            await dataset.pushData({ arg.key, value: arg.value });
        })
        await dataset.pushData({ key: 'bar' });
    }
}

type dataArgs = {
    key: string;
    value: unknown;
}
