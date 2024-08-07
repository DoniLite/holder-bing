import { Actor } from 'apify';
import { Dictionary } from 'crawlee';
import { getBaseURL } from './utilities.js';
import { StoreData } from './index.js';

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

    async exportData<T extends keyof unknown>(): Promise<StoreData<T>> {
        const dataset = await Actor.openDataset(this.dataset);
        const data = await dataset.export();
        return data as StoreData<T>;
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
                memo.push(value);
            });
            return memo;
        }, memoParam);
        await this.setData(...safePageLinks);
    }
}

type dataArgs = {
    [key: string]: string | number | string[] | number[] ;
}
