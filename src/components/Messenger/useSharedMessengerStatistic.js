import { messenger } from '@/const/messenger.js';
import { useStore } from 'vuex';
import { computed, ref, shallowReactive, watch } from 'vue';
import { createSharedComposable, useDocumentVisibility, useIntervalFn } from '@vueuse/core';
import { DELAY_BETWEEN_UPDATING_STATISTICS } from '@/configs/messenger.config.js';
import { useCachedAsyncFunction } from '@/utils/use/useCachedAsyncFunction.js';

function useMessengerStatistic() {
    const store = useStore();

    const isInitialLoading = shallowReactive({
        objects: true,
        companies: true,
        users: true
    });

    const someIsLoading = computed(
        () => isInitialLoading.objects || isInitialLoading.companies || isInitialLoading.users
    );

    async function fetchObjectsStatistics() {
        isInitialLoading.objects = true;
        await store.dispatch('Messenger/updateStatistics', [messenger.dialogTypes.OBJECT]);
        isInitialLoading.objects = false;
    }

    async function fetchCompaniesStatistics() {
        isInitialLoading.companies = true;
        await store.dispatch('Messenger/updateStatistics', [messenger.dialogTypes.COMPANY]);
        isInitialLoading.companies = false;
    }

    async function fetchUsersStatistics() {
        isInitialLoading.users = true;
        await store.dispatch('Messenger/updateStatistics', [messenger.dialogTypes.USER]);
        isInitialLoading.users = false;
    }

    const objectCounts = computed(() => store.state.Messenger.counts.object);
    const companiesCounts = computed(() => store.state.Messenger.counts.company);
    const userCounts = computed(() => store.state.Messenger.counts.user);

    const fetchStatistics = useCachedAsyncFunction(async () => {
        await Promise.allSettled([
            fetchObjectsStatistics(),
            fetchCompaniesStatistics(),
            fetchUsersStatistics()
        ]);
    });

    // updating

    const isUpdating = ref(false);

    const updateStatistics = useCachedAsyncFunction(async () => {
        if (documentVisibility.value !== 'visible') {
            return;
        }

        isUpdating.value = true;

        await Promise.allSettled([
            store.dispatch('Messenger/updateStatistics', [messenger.dialogTypes.OBJECT]),
            store.dispatch('Messenger/updateStatistics', [messenger.dialogTypes.COMPANY]),
            store.dispatch('Messenger/updateStatistics', [messenger.dialogTypes.USER])
        ]);

        isUpdating.value = false;
    });

    const statisticsInterval = useIntervalFn(updateStatistics, DELAY_BETWEEN_UPDATING_STATISTICS);
    const documentVisibility = useDocumentVisibility();

    watch(documentVisibility, (current, prev) => {
        if (current === 'visible' && prev === 'hidden') {
            statisticsInterval.resume();
        } else {
            statisticsInterval.pause();
        }
    });

    return {
        objectCounts,
        companiesCounts,
        userCounts,
        updateStatistics,
        fetchCompaniesStatistics,
        fetchObjectsStatistics,
        fetchUsersStatistics,
        fetchStatistics,
        isInitialLoading,
        someIsLoading,
        isUpdating
    };
}

export const useSharedMessengerStatistic = createSharedComposable(useMessengerStatistic);
