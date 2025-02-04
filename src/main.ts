import { Actor } from 'apify';
import { PlaywrightCrawler } from 'crawlee';
import { router } from './routes.js';
import { Input } from './index.js';

export enum NotifyType {
    'success',
    'failure',
    'warning',
}

const token = process.env.GOSTIFY_TOKEN;

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
    failedRequestHandler: async ({ request, log }) => {
        const hostServerRequest = await fetch('http://localhost:3081/api/notifications', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                hostService: 'Holder-Bing',
                type: NotifyType.failure,
                url: request.url,
                statusCode: 500,
                message: 'Failed to fetch',
            }),
        });
        if (!hostServerRequest.ok) {
            log.info(`Failed to send notification for ${request.url}`);
        }
        log.info('Error notificaticon sended to Host');
    },
});

await crawler.run(startUrls);

// Exit successfully
await Actor.exit();
