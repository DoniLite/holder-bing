import { Page } from 'playwright';
import { DomObjModel, MetaData } from './index.js';

export class DomManipulator implements DomObjModel {
    #page: Page;
    constructor(pageElement: Page) {
        this.#page = pageElement;
    }

    async returnAllLinks(): Promise<string[]> {
        const links = await this.#page.$$eval('a', (linkAnchors) => {
            return linkAnchors.map((linkAnchor) => linkAnchor.href);
        });
        return links;
    }

    async someMetaData<T extends MetaData, K = unknown>(doSomethingWithPage?: (page: Page) => K): Promise<T> {
        const metaData = await this.#page.$$eval('meta', (metaElements) => {
            const metaObj = {
                url: this.#page.url(),
                title: '',
                description: '',
            } as T;
            metaElements.forEach((meta) => {
                const name = meta.getAttribute('name');
                const content = meta.getAttribute('content');
                if (name && content) {
                    switch (name.toLowerCase()) {
                        case 'title':
                            metaObj.title = content;
                            break;
                        case 'description':
                            metaObj.description = content;
                            break;
                        default:
                            break;
                    }
                }
            });
            return metaObj;
        });
        if (doSomethingWithPage) {
            const tasksResult = await doSomethingWithPage(this.#page);
            return { ...metaData, ...tasksResult } as T & K;
        }
        return metaData as T;
    }
}
