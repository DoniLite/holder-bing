import { Actor } from 'apify';
import { Dictionary } from 'crawlee';
import { getBaseURL } from './utilities.js';

export class CustomDataset {
    dataset: string;
    constructor(dataset = 'default') {
        this.dataset = dataset;
    }

    async setData(...args: dataArgs[]): Promise<void> {
        const dataset = await Actor.openDataset(this.dataset);
        // Write a single row
        // dataset.reduce()
        await dataset.pushData([...args]);
    }

    async exportData(): Promise<StoreData> {
        const dataset = await Actor.openDataset(this.dataset);
        const data = dataset.export();
        return data;
    }

    async reduceUrl(memoParam: Dictionary[]): Promise<void> {
        const dataset = await Actor.openDataset(this.dataset);
        const safePageLinks = await dataset.reduce<Dictionary[]>((memo, value) => {
            memo = [];
            const url = getBaseURL(value.url);
            memo.forEach((page) => {
                if (page.url === url) {
                    return;
                }
                memo.push(page);
            });
            return memo;
        }, memoParam);
        await this.setData(...safePageLinks);
    }
}

type dataArgs = {
    [string: string]: string
}
type StoreData = Dictionary[];
