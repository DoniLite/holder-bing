import { Page } from "playwright";

export interface DomObjModel {
    #page: Page;

    returnAllLinks(): Promise<string[]>;
}