import { NotificationsOptions, notify } from '@kyvg/vue3-notification';
import { AxiosResponse } from 'axios';
import { isNullish } from '@/utils/helpers/common/isNullish';
import { isObject } from '@vueuse/core';

const notifyOptions: NotificationsOptions = {
    group: 'app',
    type: 'success',
    duration: 5000
};

interface ResponseStatusData<T = any> {
    message?: string;
    data: T;
}

function setNotify(response: AxiosResponse) {
    const data = response.data;

    notifyOptions.title = response.statusText;

    if (Array.isArray(data.message)) {
        data.message.forEach(element => {
            notifyOptions.text = element;
            notify(notifyOptions);
        });
    } else {
        notifyOptions.text = data.message;
        notify(notifyOptions);
    }
}

export function responseToData<T = ResponseStatusData | any>(
    response: AxiosResponse<T> | null
): T | null {
    if (isNullish(response)) return null;

    if (isObject(response.data)) {
        if ('message' in response.data && 'data' in response.data) {
            setNotify(response);
            return response.data.data;
        }
    }

    return response.data;
}
