import { setRequestError } from '@/api/helpers/setRequestError.js';
import axios from 'axios';

const ACCESS_TOKEN_PREFIX = 'Bearer';

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
    throw error;
}

export function setAccessToken(token) {
    axios.defaults.headers.common['Authorization'] = `${ACCESS_TOKEN_PREFIX} ${token}`;
}
