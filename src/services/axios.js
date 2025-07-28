import { setRequestError } from '@/api/helpers/setRequestError.js';
import axios from 'axios';
import { getApiUrl } from '@/utils/url.js';

const ACCESS_TOKEN_PREFIX = 'Bearer';

export function setAccessToken(token) {
    axios.defaults.headers.common['Authorization'] = `${ACCESS_TOKEN_PREFIX} ${token}`;
}

export function abortRequests() {
    controller.abort();
    controller = new AbortController();
}

let controller = new AbortController();

function axiosRequestInterceptor(config) {
    config.signal = controller.signal;
    return config;
}

async function axiosResponseErrorInterceptor(error) {
    await setRequestError(error);
    throw error;
}

export function initAxios() {
    axios.defaults.baseURL = getApiUrl();
    axios.interceptors.request.use(axiosRequestInterceptor);
    axios.interceptors.response.use(response => response, axiosResponseErrorInterceptor);
}
