import { messenger } from '@/const/messenger.js';
import { useStore } from 'vuex';
import { computed, shallowReactive, watch } from 'vue';
import { createSharedComposable, useDocumentVisibility, useIntervalFn } from '@vueuse/core';
import { DELAY_BETWEEN_UPDATING_STATISTICS } from '@/configs/messenger.config.js';

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

    function updateStatistics() {
        store.dispatch('Messenger/updateStatistics', [messenger.dialogTypes.OBJECT]);
        store.dispatch('Messenger/updateStatistics', [messenger.dialogTypes.COMPANY]);
        store.dispatch('Messenger/updateStatistics', [messenger.dialogTypes.USER]);
    }

    const objectCounts = computed(() => store.state.Messenger.counts.object);
    const companiesCounts = computed(() => store.state.Messenger.counts.company);
    const userCounts = computed(() => store.state.Messenger.counts.user);

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

    let fetchingPromise = null;

    async function fetchStatistics() {
        console.log('fetch request');

        if (fetchingPromise) return fetchingPromise;

        console.log('fetch process');

        fetchingPromise = Promise.allSettled([
            fetchObjectsStatistics(),
            fetchCompaniesStatistics(),
            fetchUsersStatistics()
        ]);

        return fetchingPromise;
    }

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
        someIsLoading
    };
}

export const useSharedMessengerStatistic = createSharedComposable(useMessengerStatistic);
