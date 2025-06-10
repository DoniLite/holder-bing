import { Actor } from 'apify';
import { PlaywrightCrawler } from 'crawlee';
import { router } from './routes.js';
import { Input } from './index.js';
// import { notifierFn } from './utils/notification.js';

// Initialize the Apify SDK
await Actor.init();

// Structure of input is defined in input_schema.json
const {
    startUrls = [
        {
            url: 'https://example.com',
            title: 'Example Domain',
        },
    ] as const,
    maxRequestsPerCrawl = 100,
} = await Actor.getInput<Input>() ?? {} as Input;

const proxyConfiguration = await Actor.createProxyConfiguration();

const crawler = new PlaywrightCrawler({
    proxyConfiguration,
    maxRequestsPerCrawl,
    requestHandler: router,
    // failedRequestHandler: notifierFn,
});

await crawler.run(startUrls);

// Exit successfully
await Actor.exit();
