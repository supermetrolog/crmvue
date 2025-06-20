import { computed, ref, shallowRef, toValue } from 'vue';
import { noop } from '@vueuse/core';
import { useConfirm } from '@/composables/useConfirm.js';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.js';
import { isArray } from '@/utils/helpers/array/isArray.ts';

const supportsAbort = typeof AbortController === 'function';

/**
 * @param {function} callable
 * @param {object} config
 */
export function useAsync(callable, config = {}) {
    const {
        throwOnFailed = false,
        onFetchResponse = noop,
        onFetchError = noop,
        onFetchFinally = noop,
        immediate = false,
        initialData = null,
        abortBeforeFetch = false,
        confirmation = false,
        confirmationContent = {
            title: 'Вы уверены, что хотите выполнить эту операцию?',
            message: 'Это действие необратимо'
        },
        payload = null
    } = config;

    const isLoading = ref(false);
    const isError = ref(false);
    const isFinished = ref(false);
    const aborted = ref(false);

    const error = shallowRef(null);
    const data = shallowRef(initialData);

    const { confirm } = useConfirm();

    const canAbort = computed(() => supportsAbort && isLoading.value);

    let controller;

    function abort() {
        if (!supportsAbort) return;

        controller?.abort();

        controller = new AbortController();
        controller.signal.onabort = () => (aborted.value = true);
    }

    function setLoading(value) {
        isLoading.value = value;
        isFinished.value = !value;
    }

    async function execute(...args) {
        if (confirmation) {
            const confirmed = await confirm(confirmationContent);
            if (!confirmed) return false;
        }

        return await executeDangerously(...args);
    }

    async function executeDangerously(...args) {
        if (abortBeforeFetch) abort();

        setLoading(true);
        error.value = null;
        aborted.value = false;

        const _args = [];

        if (isNotNullish(payload)) {
            const _payload = toValue(payload);
            if (isArray(_payload)) _args.push(..._payload);
            else _args.push(_payload);
        } else {
            _args.push(...args);
        }

        return callable(..._args)
            .then(response => {
                onFetchResponse({ response, execute, args: _args });

                data.value = response;

                return response;
            })
            .catch(fetchError => {
                let errorData = fetchError.message || fetchError.name;

                onFetchError({ error: fetchError, execute });

                isError.value = true;
                error.value = errorData;

                if (throwOnFailed) throw fetchError;
                return null;
            })
            .finally(() => {
                setLoading(false);
                onFetchFinally({ execute, data: data.value, error: error.value });
            });
    }

    if (immediate) Promise.resolve().then(() => execute());

    return {
        isLoading,
        isFinished,
        isError,
        aborted,
        canAbort,
        abort,
        error,
        data,
        execute,
        executeDangerously
    };
}
