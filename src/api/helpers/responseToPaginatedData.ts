import { responseToData } from '@/api/helpers/responseToData';
import { AxiosResponse } from 'axios';

export type PaginationConfig = {
    totalCount: number;
    perPage: number;
    pageCount: number;
    currentPage: number;
};

export function responseToPagination(
    response: AxiosResponse | null | undefined
): PaginationConfig | null {
    if (response == null) {
        return null;
    }

    return {
        totalCount: +response.headers['x-pagination-total-count'],
        perPage: +response.headers['x-pagination-per-page'],
        pageCount: +response.headers['x-pagination-page-count'],
        currentPage: +response.headers['x-pagination-current-page']
    };
}

export function responseToPaginatedData<T = any>(response: AxiosResponse) {
    return {
        data: responseToData<T[]>(response) ?? [],
        pagination: responseToPagination(response)
    };
}
