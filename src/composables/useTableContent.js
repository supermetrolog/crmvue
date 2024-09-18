import { onBeforeUnmount, onMounted, shallowRef, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { noop } from '@vueuse/core';

/**
 * Composable для работы с таблицами, синхронизированными с `query`
 *
 * @param {function: void} fetch - Функция обновления данных
 * @param options - Дополнительная конфигурация
 * @param {function: void} options.initQuery - Функция инициализации query-параметров
 * @param {Ref<HTMLElement>} options.scrollTo - Элемент, к которому необходимо совершить скролл после `next()`
 * @returns {{next: (function: void), nextWithScroll: (function: void), queryIsInitialized: Ref<boolean>}}
 */
export function useTableContent(fetch, options = {}) {
    const router = useRouter();
    const route = useRoute();
    const store = useStore();

    /**
     * Флаг инициализации `query`.
     * @type {shallowRef<boolean>}
     */
    const queryIsInitialized = shallowRef(false);

    let stop = noop;
    let { initQuery = noop, scrollTo = null } = options;

    /**
     * Перейти к определенной странице. Фиксирует номер страницы в `query`.
     *
     * @param {number, string} page - номер страницы
     * @returns {Promise<void>}
     */
    async function next(page) {
        const query = { ...route.query, page };
        await router.replace({ query });
    }

    /**
     * Перейти к определенной странице и проскроллить к определенному элементу. Фиксирует номер страницы в `query`.
     *
     * @param {number, string} page - номер страницы
     * @returns {Promise<void>}
     */
    async function nextWithScroll(page) {
        await next(page);

        if (scrollTo === null) return;

        (scrollTo.value.$el ?? scrollTo.value).scrollIntoView({
            behavior: 'smooth',
            block: 'end',
            alignToTop: false
        });
    }

    if (initQuery === noop)
        initQuery = async () => {
            const query = { ...route.query };
            const queryIsEmpty = Object.keys(query).length === 0;
            if (queryIsEmpty) query.consultant_id = store.getters.THIS_USER.id;
            await router.replace({ query });
        };

    onMounted(async () => {
        await initQuery();
        queryIsInitialized.value = true;

        stop = watch(
            () => [route.path, route.fullPath],
            ([newPath, newFullPath], [oldPath, oldFullPath]) => {
                if (newPath === oldPath && newFullPath !== oldFullPath) fetch();
            }
        );

        fetch();
    });

    onBeforeUnmount(() => stop());

    return { next, nextWithScroll, queryIsInitialized };
}
