import { useStore } from 'vuex';
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { cloneObject } from '@/utils/helpers/object/cloneObject.js';

export function useTimelineStep(step) {
    const store = useStore();
    const route = useRoute();

    const data = ref(cloneObject(step.value));

    watch(step, () => {
        data.value = cloneObject(step.value);
    });

    const currentRequest = computed(() => {
        if (Array.isArray(store.getters.COMPANY_REQUESTS)) {
            return store.getters.COMPANY_REQUESTS.find(
                item => item.id === Number(route.query.request_id)
            );
        }

        return null;
    });

    return { data, currentRequest };
}
