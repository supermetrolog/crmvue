import { createSharedComposable, MaybeRefOrGetter } from '@vueuse/core';
import { computed, readonly, ref, toValue, watchEffect } from 'vue';
import { ContactPosition } from '@/types/contact/contact';
import { loadCache, removeCache, saveCache } from '@/services/cache';
import api from '@/api/api';

const CACHE_KEY = 'contact-positions';
const CACHE_TTL = 24 * 60 * 60 * 1000;

export const useContactPositionShared = createSharedComposable(() => {
    const positionsMap = ref(new Map<number, ContactPosition>());

    const positions = computed(() => Array.from(positionsMap.value.values()));

    const loading = ref(false);
    const loaded = ref(false);

    async function load(force = false): Promise<ContactPosition[]> {
        if (positionsMap.value.size && !force) {
            return positions.value;
        }

        if (positionsMap.value.size === 0 && !force) {
            const fromStorage = loadCache<ContactPosition[]>(CACHE_KEY, CACHE_TTL);

            if (fromStorage) {
                rebuild(fromStorage);
                loaded.value = true;

                return fromStorage;
            }
        }

        loading.value = true;

        try {
            const data = await api.contactPosition.list();

            saveCache(CACHE_KEY, data);
            rebuild(data);

            loaded.value = true;

            return data;
        } finally {
            loading.value = false;
        }
    }

    function rebuild(data: ContactPosition[]): void {
        data.forEach(p => positionsMap.value.set(p.id, p));
    }

    function getById(id: number): ContactPosition | null {
        return positionsMap.value.get(id) ?? null;
    }

    async function reload() {
        removeCache(CACHE_KEY);

        positionsMap.value.clear();

        loaded.value = false;

        return load(true);
    }

    function addPosition(position: ContactPosition): void {
        positionsMap.value.set(position.id, position);
    }

    void load();

    return {
        positions,
        load,
        reload,
        getById,
        addPosition,
        loading,
        loaded
    };
});

export function useContactPosition(positionId: MaybeRefOrGetter<number | null>) {
    const shared = useContactPositionShared();

    const position = computed(() => {
        const positionIdValue = toValue(positionId);

        if (!positionIdValue) return null;

        return shared.getById(positionIdValue) ?? null;
    });

    const positionName = computed(() => position.value?.name ?? null);

    const refetched = ref(false);

    watchEffect(() => {
        if (toValue(positionId) && !position.value && shared.loaded.value && !refetched.value) {
            void shared.reload();
            refetched.value = true;
        }
    });

    return {
        position,
        positionName,
        loading: readonly(shared.loading),
        reload: shared.reload
    };
}
