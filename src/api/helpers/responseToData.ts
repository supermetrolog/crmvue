import { notify } from '@kyvg/vue3-notification';
import { AxiosResponse } from 'axios';
import { isNullish } from '@/utils/helpers/common/isNullish';
import { isObject } from '@vueuse/core';
import { isArray } from '@/utils/helpers/array/isArray';

function showNotify(text: string, title: string = 'Успешно') {
    notify({
        group: 'app',
        type: 'success',
        duration: 5000,
        title,
        text
    });
}

interface ResponseStatusData<T = any> {
    message?: string;
    data: T;
}

export interface ResponseStatusWithMessage {
    message: string;
    success: boolean;
}

function setNotify(response: AxiosResponse) {
    const title = response.statusText;

    if (isArray(response.data.message)) {
        for (const text of response.data.message) {
            showNotify(text, title);
        }
    } else {
        showNotify(response.data.message, title);
    }
}

export function responseToData<T = ResponseStatusData | any>(response: AxiosResponse<T>): T {
    if (isNullish(response)) return response;

    if (isObject(response.data)) {
        if ('message' in response.data && ('success' in response.data || 'data' in response.data)) {
            if (response.data.message?.length > 0) {
                setNotify(response);
            }

            return (response.data?.data ?? response.data) as T;
        }
    }

    return response.data;
}
