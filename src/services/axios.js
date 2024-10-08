import { setRequestError } from '@/api/helpers/setRequestError.js';

let controller = new AbortController();

export function axiosRequestInterceptor(config) {
    config.signal = controller.signal;
    return config;
}

export function abortRequests() {
    controller.abort();
    controller = new AbortController();
}

export async function axiosResponseErrorInterceptor(error) {
    await setRequestError(error);
    return null;
}
