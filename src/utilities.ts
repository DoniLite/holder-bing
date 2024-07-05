import { RequestQueue } from 'apify';

type requestToQueue = {
    urlPath: string;
}

export const addUrlToqueue = async ({ urlPath }: requestToQueue) => {
    const requestQueue = await RequestQueue.open();
    // Enqueue the initial request
    await requestQueue.addRequest({ url: urlPath });
};
