export function useCachedAsyncFunction(asyncFn) {
    let cachedPromise;

    async function cachedFunction(...args) {
        if (cachedPromise) return cachedPromise;

        cachedPromise = asyncFn(...args).finally(() => {
            cachedPromise = null;
        });
    }

    return cachedFunction;
}
