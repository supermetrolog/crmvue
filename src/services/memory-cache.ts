import { __DEV__ } from '@/const/const';
import { Logger } from '@/services/logger';

export type CacheOptions = {
    ttlMs?: number;
    maxEntries?: number;
    debug?: boolean;
};

type CacheEntry<V> = {
    value: V;
    expiresAt: number;
};

export class MemoryCache<V = any> {
    private store = new Map<string, CacheEntry<V>>();
    private ttlMs: number;
    private maxEntries: number;
    private logger: Logger;
    private debug = false;

    constructor(options: CacheOptions = {}) {
        this.ttlMs = options.ttlMs ?? 5 * 60 * 1000;
        this.maxEntries = options.maxEntries ?? 50;

        this.debug = options.debug ?? __DEV__;

        this.logger = new Logger({ enabled: this.debug, prefix: 'memory-cache' });
    }

    get(key: string): V | undefined {
        const entry = this.store.get(key);

        if (!entry) return undefined;

        if (entry.expiresAt <= Date.now()) {
            this.store.delete(key);
            return undefined;
        }

        this.logger.debug(`Get "${key}" from cache`);

        return entry.value;
    }

    set(key: string, value: V, ttlMs?: number) {
        const expiresAt = Date.now() + (ttlMs ?? this.ttlMs);

        if (this.store.has(key)) {
            this.store.delete(key);
        }

        this.logger.debug(`Set "${key}" to cache`);

        this.store.set(key, { value, expiresAt });

        this.trimIfNeeded();
    }

    has(key: string): boolean {
        const entry = this.store.get(key);

        if (!entry) {
            return false;
        }

        if (entry.expiresAt <= Date.now()) {
            this.store.delete(key);
            return false;
        }

        return true;
    }

    delete(key: string): boolean {
        this.logger.debug(`Delete "${key}" in cache`);

        return this.store.delete(key);
    }

    clear() {
        this.logger.debug('Clear cache');

        this.store.clear();
    }

    size(): number {
        this.pruneExpired();
        return this.store.size;
    }

    keys(): string[] {
        this.pruneExpired();

        return Array.from(this.store.keys());
    }

    pruneExpired() {
        const now = Date.now();

        for (const [k, v] of this.store) {
            if (v.expiresAt <= now) {
                this.store.delete(k);
            }
        }
    }

    private trimIfNeeded() {
        if (this.store.size <= this.maxEntries) {
            return;
        }

        const toDelete = this.store.size - this.maxEntries;
        const it = this.store.keys();

        for (let i = 0; i < toDelete; i++) {
            const k = it.next().value;

            if (k !== undefined) {
                this.store.delete(k);
            }
        }

        this.logger.debug(`Delete ${toDelete} items in cache`);
    }
}

class CacheFactory {
    private registry = new Map<string, MemoryCache<any>>();

    getCache<V = any>(name: string, options: CacheOptions = {}): MemoryCache<V> {
        if (this.registry.has(name)) {
            return this.registry.get(name)!;
        }

        const cache = new MemoryCache<V>(options);

        this.registry.set(name, cache);

        return cache;
    }

    setCache<V = any>(name: string, cache: MemoryCache<V>) {
        this.registry.set(name, cache);
    }

    deleteCache(name: string) {
        this.registry.delete(name);
    }

    clearAll() {
        this.registry.clear();
    }
}

export const cacheFactory = new CacheFactory();
