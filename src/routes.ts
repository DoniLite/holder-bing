import { createPlaywrightRouter, Dictionary } from 'crawlee';
import dotEnv from 'dotenv';
import { CustomDataset } from './DataSet.js';
import { Store } from './Store.js';
import { Input } from './main.js';

export const router = createPlaywrightRouter();

router.addDefaultHandler(async ({ enqueueLinks, log, request }) => {
    dotEnv.config();
    log.info(`enqueueing new URLs`);
    await enqueueLinks({
        globs: [`${request.loadedUrl}/*`],
        label: 'hoster',
    });
});

router.addHandler('hoster', async ({ request, page, log, enqueueLinks }) => {
    const title = await page.title();
    // const links = await page.$$('a');
    log.info(`${title}`, { url: request.loadedUrl });
    const dataSet = new CustomDataset('MY_DATA_SET');
    const store = new Store('INPUT');
    await store.setValue('url', request.loadedUrl);
    await dataSet.setData({
        url: request.loadedUrl,
        title,
    });
    const data = [] as Dictionary[];
    await dataSet.reduceUrl(data);
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
    const serverCkecker = await fetch('http://localhost:3081/api/store', {
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
