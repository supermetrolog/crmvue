export type CacheItem<T> = {
    timestamp: number;
    data: T;
};

export function createCacheKey(key: string) {
    return `plr:${key}`;
}

export function saveCache<T>(key: string, data: T) {
    const item: CacheItem<T> = {
        timestamp: Date.now(),
        data
    };

    localStorage.setItem(createCacheKey(key), JSON.stringify(item));
}

export function loadCache<T>(key: string, ttl = 24 * 60 * 60 * 1000): T | null {
    try {
        const raw = localStorage.getItem(createCacheKey(key));
        if (!raw) return null;

        const parsed: CacheItem<T> = JSON.parse(raw);
        if (Date.now() - parsed.timestamp > ttl) return null;

        return parsed.data;
    } catch {
        return null;
    }
}

export function removeCache(key: string) {
    localStorage.removeItem(createCacheKey(key));
}
