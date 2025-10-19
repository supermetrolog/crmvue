import { onBeforeMount, onScopeDispose, reactive, ref, toValue, watch } from 'vue';
import { noop } from '@vueuse/core';
import { useRoute, useRouter } from 'vue-router';
import { toCleanObject } from '@/utils/helpers/object/toCleanObjects.js';
import { isArray } from '@/utils/helpers/array/isArray.ts';
import { isObject } from '@/utils/helpers/object/isObject.js';
import { cloneObject } from '@/utils/helpers/object/cloneObject.js';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.ts';

const compareArrays = (first, second) => {
    if (!Array.isArray(first) || !Array.isArray(second)) return false;
    if (first.length !== second.length) return false;
    if (first.length === 0) return false;

    return JSON.stringify(first) === JSON.stringify(second);
};

export function useSearchForm(template, options) {
    const route = useRoute();
    const router = useRouter();

    const form = reactive({});

    const {
        submit = noop,
        syncWithQuery = false,
        setQuery = noop,
        delay = 500,
        transform = null
    } = options;

    const isProcessing = ref(false);

    function resetForm() {
        Object.keys(template).forEach(key => {
            if (isArray(template[key]) || isObject(template[key])) {
                form[key] = cloneObject(template[key]);
            } else {
                form[key] = template[key];
            }
        });
    }

    resetForm();

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

        if (syncWithQuery) _query = toCleanObject({ ...route.query, ...toValue(form) });
        else _query = toCleanObject(toValue(form));

        if (isNotNullish(transform)) {
            _query = transform(_query);
        }

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
        form,
        () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => onSubmit(), delay);
        },
        { deep: true, immediate: !syncWithQuery }
    );

    onBeforeMount(() => {
        if (setQuery !== noop) setQuery();
    });

    function stop() {
        stopQueryWatch();
        stopFormWatch();
        stopCustomQueryWatch();
        clearTimeout(timeout);
    }

    onScopeDispose(stop);

    return {
        resetForm,
        form
    };
}
