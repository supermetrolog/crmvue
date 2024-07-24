let controller = new AbortController();

export function axiosRequestInterceptor(config) {
    config.signal = controller.signal;
    return config;
}

export function abortRequests() {
    controller.abort();
    controller = new AbortController();
}
