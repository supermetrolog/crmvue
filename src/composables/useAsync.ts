import { computed, ComputedRef, Ref, ref, ShallowRef, shallowRef, toValue } from 'vue';
import { MaybeRefOrGetter, noop } from '@vueuse/core';
import { useConfirm } from '@/composables/useConfirm';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish';
import { captureException } from '@sentry/vue';

const supportsAbort = typeof AbortController === 'function';

type ConfirmationContent = {
    title: string;
    message?: string;
};

type UseAsyncConfig<Args extends any[], R> = {
    throwOnFailed?: boolean;
    captured?: boolean;
    onFetchResponse?: (ctx: {
        response: R;
        execute: UseAsyncReturn<Args, R>['execute'];
        args: Args;
    }) => void;
    onFetchError?: (error: unknown, execute: UseAsyncReturn<Args, R>['execute']) => void;
    onFetchFinally?: (ctx: {
        execute: UseAsyncReturn<Args, R>['execute'];
        data: R | null;
        error: string | null;
    }) => void;
    immediate?: boolean;
    initialData?: R | null;
    abortBeforeFetch?: boolean;
    confirmation?: boolean;
    confirmationContent?: ConfirmationContent;
    payload?: MaybeRefOrGetter<Args | [Args[0]] | Args[0]>;
};

type UseAsyncReturn<Args extends any[], R> = {
    isLoading: Ref<boolean>;
    isFinished: Ref<boolean>;
    isError: Ref<boolean>;
    aborted: Ref<boolean>;
    canAbort: ComputedRef<boolean>;
    abort: () => void;
    error: ShallowRef<string | null>;
    data: ShallowRef<R | null>;
    execute: (...args: Args) => Promise<R | null | false>;
    executeDangerously: (...args: Args) => Promise<R | null>;
};

export function useAsync<Args extends any[], R>(
    callable: (...args: Args) => Promise<R> | R,
    config: UseAsyncConfig<Args, R> = {}
): UseAsyncReturn<Args, R> {
    const {
        throwOnFailed = false,
        captured = true,
        onFetchResponse = noop as UseAsyncConfig<Args, R>['onFetchResponse'],
        onFetchError = noop as UseAsyncConfig<Args, R>['onFetchError'],
        onFetchFinally = noop as UseAsyncConfig<Args, R>['onFetchFinally'],
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

    const error = shallowRef<string | null>(null);
    const data = shallowRef<R | null>(initialData);

    const { confirm } = useConfirm();

    const canAbort = computed(() => supportsAbort && isLoading.value);

    let controller: AbortController | null = null;

    function abort() {
        if (!supportsAbort) return;

        controller?.abort();

        controller = new AbortController();
        controller.signal.onabort = () => (aborted.value = true);
    }

    function setLoading(value: boolean) {
        isLoading.value = value;
        isFinished.value = !value;
    }

    async function execute(...args: Args): Promise<R | null | false> {
        if (confirmation) {
            const confirmed = await confirm(confirmationContent);
            if (!confirmed) return false;
        }

        return await executeDangerously(...args);
    }

    async function executeDangerously(...args: Args): Promise<R | null> {
        if (abortBeforeFetch) abort();

        setLoading(true);

        error.value = null;
        aborted.value = false;

        let finalArgs: Args;

        if (isNotNullish(payload)) {
            const p = toValue(payload) as unknown;

            if (Array.isArray(p)) {
                finalArgs = p as unknown as Args;
            } else {
                finalArgs = [p] as unknown as Args;
            }
        } else {
            finalArgs = args;
        }

        return Promise.resolve(callable(...finalArgs))
            .then(response => {
                onFetchResponse?.({ response, execute, args: finalArgs });

                data.value = response;

                return response;
            })
            .catch((fetchError: unknown) => {
                const message =
                    fetchError instanceof Error
                        ? fetchError.message || fetchError.name
                        : String(fetchError);

                onFetchError?.(fetchError, execute);

                if (captured) {
                    captureException(fetchError);
                }

                isError.value = true;
                error.value = message;

                if (throwOnFailed) throw fetchError;

                return null;
            })
            .finally(() => {
                setLoading(false);

                onFetchFinally?.({ execute, data: data.value, error: error.value });
            });
    }

    if (immediate) {
        Promise.resolve().then(() => executeDangerously(...([] as unknown as Args)));
    }

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
