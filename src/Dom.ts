import { Page } from 'playwright';
import { DomObjModel } from './index.js';

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
}
