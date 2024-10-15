import { useStore } from 'vuex';
import { computed, shallowRef } from 'vue';

export function useTagsOptions() {
    const store = useStore();

    const isFetching = shallowRef(false);

    const tagsOptions = computed(() => store.getters['Task/tagsOptions']);

    const refreshTagsOptions = async () => {
        if (isFetching.value) return;

        isFetching.value = true;
        await store.dispatch('Task/fetchTags');
        isFetching.value = false;
    };
    const getTagsOptions = async () => {
        if (!tagsOptions.value.length) await refreshTagsOptions();
        return tagsOptions.value;
    };

    if (!isFetching.value && tagsOptions.value.length) refreshTagsOptions();

    return { tagsOptions, refreshTagsOptions, getTagsOptions };
}
