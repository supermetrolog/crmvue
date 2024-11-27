import { computed, shallowRef, unref, watch } from 'vue';
import { noop, tryOnBeforeMount, tryOnScopeDispose } from '@vueuse/core';
import { useRoute, useRouter } from 'vue-router';
import { toCleanObject } from '@/utils/helpers/object/toCleanObjects.js';

const compareArrays = (first, second) => {
    if (!Array.isArray(first) || !Array.isArray(second)) return false;
    if (first.length !== second.length) return false;
    if (first.length === 0) return false;

    return JSON.stringify(first) === JSON.stringify(second);
};

/**
 *
 * @param {reactive|Ref} form
 * @param options
 * @returns {{filtersCount: Ref<number>, resetForm: resetForm}}
 */
export function useSearchForm(form, options) {
    const route = useRoute();
    const router = useRouter();

    const {
        template = {},
        submit = noop,
        syncWithQuery = false,
        setQuery = noop,
        delay = 500
    } = options;

    const isProcessing = shallowRef(false);

    const filtersCount = computed(() => {
        return Object.keys(template).reduce((acc, key) => {
            if (!(key in form)) return acc;

            const value = form[key];
            if (value !== null && value !== '' && value !== undefined) {
                if (Array.isArray(value)) {
                    if (value.length) return acc + 1;
                } else return acc + 1;
            }

            return acc;
        }, 0);
    });

    function resetForm() {
        Object.assign(form, template);
    }

    function queryToForm() {
        const cleanedQuery = toCleanObject(route.query);

        Object.keys(template).forEach(key => {
            if (Array.isArray(cleanedQuery[key]) && !compareArrays(form[key], cleanedQuery[key]))
                form[key] = cleanedQuery[key];
            else form[key] = cleanedQuery[key] ?? template[key];
        });
    }

    async function onSubmit() {
        let _query = {};

        if (syncWithQuery) _query = toCleanObject({ ...route.query, ...unref(form) });
        else _query = toCleanObject(unref(form));

        isProcessing.value = true;
        if (syncWithQuery) await router.replace({ query: _query });
        submit(_query);
        isProcessing.value = false;
    }

    let stopFormWatch = noop;
    let stopQueryWatch = noop;
    let stopCustomQueryWatch = noop;
    let timeout = null;

    if (syncWithQuery) {
        stopCustomQueryWatch = watch(
            () => route.query,
            () => {
                if (!isProcessing.value) queryToForm();
            },
            { deep: true, immediate: true }
        );
    }

    stopFormWatch = watch(
        () => form,
        () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => onSubmit(), delay);
        },
        { deep: true, immediate: !syncWithQuery }
    );

    tryOnBeforeMount(async () => {
        if (setQuery !== noop) await setQuery();
    });

    function stop() {
        stopQueryWatch();
        stopFormWatch();
        stopCustomQueryWatch();
        clearTimeout(timeout);
    }

    tryOnScopeDispose(stop);

    return { filtersCount, resetForm };
}
