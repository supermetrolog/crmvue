import { useStore } from 'vuex';
import { computed } from 'vue';
import { createOptionsComposable } from '@/composables/options/createOptionsComposable.js';

export function useTagsOptions() {
    const store = useStore();

    const {
        options: tagsOptions,
        getOptions: getTagsOptions,
        refresh: refreshTagsOptions,
        isFetching
    } = createOptionsComposable(
        computed(() => store.getters['Task/tagsOptions']),
        () => store.dispatch('Task/fetchTags')
    );

    return {
        tagsOptions,
        refreshTagsOptions,
        getTagsOptions,
        isFetching
    };
}
