import { RequestQueue } from 'apify';

type requestToQueue = {
    urlPath: string;
}

export const addUrlToqueue = async ({ urlPath }: requestToQueue) => {
    const requestQueue = await RequestQueue.open();
    // Enqueue the initial request
    await requestQueue.addRequest({ url: urlPath });
};

export const getBaseURL = (url: string) => {
    try {
        const parsedURL = new URL(url);
        return parsedURL.origin;
    } catch (e) {
        return null;
    }
};
