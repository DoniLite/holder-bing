import { createPlaywrightRouter } from 'crawlee';
import dotEnv from 'dotenv';
import { CustomDataset } from './DataSet.js';
import { Store } from './Store.js';
import { Input } from './index.js';
import { DomManipulator } from './Dom.js';

const server = process.env.NODE_ENV !== 'production' ? process.env.SERVER_PRODUCTION_HOST : process.env.SERVER_LOCAL_HOST;

export const router = createPlaywrightRouter();

router.addDefaultHandler(async ({ enqueueLinks, log, request }) => {
    dotEnv.config();
    const store = new Store();
    const { value, storeInstance } = await store.getToDefaultSote();
    const urls = [...value.startUrls];
    const Uri = [] as string[];
    urls.forEach((urlEl) => {
        Uri.push(urlEl.url);
    });
    await storeInstance.drop();
    log.info(`enqueueing new URLs`);
    await enqueueLinks({
        globs: [`${request.loadedUrl}/*`],
        urls: [...Uri],
        label: 'hoster',
    });
});

router.addHandler('hoster', async ({ request, page, log, enqueueLinks }) => {
    const title = await page.title();
    // const links = await page.$$('a');
    log.info(`${title}`, { url: request.loadedUrl });
    const inpt = {
        startUrls: [
            { url: request.loadedUrl, title },
        ],
    };
    const dom = new DomManipulator(page);
    const urls = await dom.returnAllLinks();
    const metaData = await dom.someMetaData();
    const storageData = {
        uris: urls,
        ...metaData,
    };
    const dataSet = new CustomDataset('MY_DATA_SET');
    await dataSet.setData(storageData);
    const store = new Store('INPUT');
    const { value } = await store.getToDefaultSote();
    value.startUrls = [...value.startUrls, ...inpt.startUrls];
    await store.setToDefaultSote(value);
    await enqueueLinks({
        label: 'details',
    });
});

router.addHandler('details', async ({ page, log }) => {
    const title = await page.title();
    const token = process.env.GOSTIFY_TOKEN;
    const dataSet = new CustomDataset('MY_DATA_SET');
    const store = new Store();
    const data = await dataSet.exportData();
    const input = {
        startUrls: [...data],
    } as Input;
    await store.setToDefaultSote(input);
    const serverCkecker = await fetch(`${server}store`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ data }),
    });
    if (!serverCkecker.ok) {
        log.error('Failed to store data to the server');
    }
    log.info('data sended to server');
    log.info(title);
});
