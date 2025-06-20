import { responseToData } from '@/api/helpers/responseToData.ts';

/**
 * @typedef PaginationData
 * @property {number} pageCount
 * @property {number} perPage
 * @property {number} totalCount
 * @property {number} currentPage
 */

/**
 *
 * @param response
 * @return {?PaginationData}
 */
export function responseToPagination(response) {
    if (response == null) return null;

    return {
        totalCount: +response.headers['x-pagination-total-count'],
        perPage: +response.headers['x-pagination-per-page'],
        pageCount: +response.headers['x-pagination-page-count'],
        currentPage: +response.headers['x-pagination-current-page']
    };
}

/**
 *
 * @param response
 * @return {{pagination: ?PaginationData, data: (*|null)}}
 */
export function responseToPaginatedData(response) {
    return {
        data: responseToData(response) ?? [],
        pagination: responseToPagination(response)
    };
}
