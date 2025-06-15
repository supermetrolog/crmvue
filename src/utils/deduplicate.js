const promiseMap = new Map();

export async function deduplicate(key, handler) {
    if (promiseMap.has(key)) {
        return promiseMap.get(key);
    }

    const promise = handler().finally(() => {
        promiseMap.delete(key);
    });

    promiseMap.set(key, promise);

    return promise;
}
