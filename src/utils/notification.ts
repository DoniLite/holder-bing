import {
    BrowserErrorHandler,
    Dictionary,
    PlaywrightCrawlingContext,
} from 'crawlee';
import { NotificationType } from '../index.js';
import { token } from './constants.js';

export const notifierFn: BrowserErrorHandler<
    PlaywrightCrawlingContext<Dictionary>
> = async ({ request, log }) => {
    const hostServerRequest = await fetch(
        'http://localhost:3081/api/notifications',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                hostService: 'Holder-Bing',
                type: NotificationType.failure,
                url: request.url,
                statusCode: 500,
                message: 'Failed to fetch',
            }),
        },
    );
    if (!hostServerRequest.ok) {
        log.info(`Failed to send notification for ${request.url}`);
    }
    log.info('Error notification sent to Host');
};
