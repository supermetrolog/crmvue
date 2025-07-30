import { notify } from '@kyvg/vue3-notification';
import { AxiosResponse } from 'axios';
import { isNullish } from '@/utils/helpers/common/isNullish';
import { isObject } from '@vueuse/core';
import { isArray } from '@/utils/helpers/array/isArray';

function showNotify(text: string) {
    notify({
        group: 'app',
        type: 'success',
        duration: 5000,
        title: 'Успешно',
        text
    });
}

interface ResponseStatusData<T = any> {
    message?: string;
    data: T;
}

function setNotify(response: AxiosResponse) {
    if (isArray(response.data.message)) {
        for (const text of response.data.message) {
            showNotify(text);
        }
    } else {
        showNotify(response.data.message);
    }
}

export function confirmResponse(response: AxiosResponse<ResponseStatusData>): void {
    if (isNullish(response)) {
        return;
    }

    if (isObject(response.data) && 'message' in response.data) {
        setNotify(response);
    }
}
