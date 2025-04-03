import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { noop, unrefElement } from '@vueuse/core';

/**
 * @param {function: void} fetch
 * @param options
 * @param {function: void} options.initQuery
 * @param {Ref<HTMLElement>} options.scrollTo
 * @returns {{next: (function: void), nextWithScroll: (function: void), queryIsInitialized: Ref<boolean>}}
 */
export function useTableContent(fetch, options = {}) {
    const router = useRouter();
    const route = useRoute();
    const store = useStore();

    const queryIsInitialized = ref(false);

    let stop = noop;
    let { initQuery = noop, scrollTo = null } = options;

    /**
     * @param {number, string} page
     * @returns {Promise<void>}
     */
    async function next(page) {
        await router.replace({ query: { ...route.query, page } });
    }

    /**
     * @param {number, string} page
     * @returns {Promise<void>}
     */
    async function nextWithScroll(page) {
        await next(page);

        if (scrollTo === null) return;

        unrefElement(scrollTo).scrollIntoView({
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
                if (newPath === oldPath && newFullPath !== oldFullPath) {
                    fetch();
                }
            }
        );

        fetch();
    });

    onBeforeUnmount(() => stop());

    return { next, nextWithScroll, queryIsInitialized };
}
