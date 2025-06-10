import { KeyValueStore } from "apify";
import { Page } from "playwright";

export interface DomObjModel {
    #page: Page;

    returnAllLinks(): Promise<string[]>;
    someMetaData<T extends MetaData, K = unknown>(doSomethingWithPage?: (page: Page) => Promise<K>): Promise<T & K >;
}

export interface MetaData {
    url: string;
    title: string;
    description: string;
}

export type ValueAndStore<T = unknown> = {
    value: T;
    storeInstance: KeyValueStore
}

export interface Input {
    startUrls: UrlData[];
    maxRequestsPerCrawl?: number;
}

export type UrlData = {
    url: string;
    title: string;
};

export type StoreData<T extends keyof unknown> = Dictionary<T>[];

export enum NotificationType {
    'success',
    'failure',
    'warning',
}