import { ExtraData } from "../../api/serializer/user.serializer.js";
import { ConfigurationService } from "../../api/services/configuration.service.js";

export function makeSerializerOptions(configurationService: ConfigurationService) {
    return {
        links: (data: unknown, extraData: unknown) => {
            const { url } = extraData as ExtraData;

            const path = url.substring(0, url.indexOf('/'));

            const links = {
            self: `${path}/${}`,
            } as Record<string, string>;

            return links;
        },
        topLevelMeta: (_data: unknown, extraData: unknown) => {
            const { url, paginationData } = extraData as ExtraData;

            return paginationData;
        },
        topLevelLinks: (_data: unknown, extraData: unknown) => {
            const { url, paginationData } = extraData as ExtraData;

            const links = {
            self: `${url}`,
            } as Record<string, string>;

            if (paginationData) {
            const queryMarkLocation = url.indexOf('?');
            const baseURL = url.substring(0, queryMarkLocation);
            const queryParams = url.substring(queryMarkLocation + 1);

            const lastPage = Math.floor(paginationData.totalRecords / paginationData.pageSize);
            const previousPage = paginationData.pageNumber <= 0 ? 0 : paginationData.pageNumber - 1;
            const nextPage = paginationData.pageNumber >= lastPage ? lastPage : paginationData.pageNumber + 1;

            const firstParsedURL = new URLSearchParams(queryParams);
            const lastParsedURL = new URLSearchParams(queryParams);
            const prevParsedURL = new URLSearchParams(queryParams);
            const nextParsedURL = new URLSearchParams(queryParams);

            firstParsedURL.set('page[number]', '1');
            lastParsedURL.set('page[number]', lastPage.toString());
            prevParsedURL.set('page[number]', previousPage.toString());
            nextParsedURL.set('page[number]', nextPage.toString());

            links.first = `${baseURL}${firstParsedURL}`;
            links.last = `${baseURL}${lastParsedURL}`;
            links.prev = `${baseURL}${prevParsedURL}`;
            links.next = `${baseURL}${nextParsedURL}`;
            }

            return links;
        },
    }
}