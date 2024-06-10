import { ref } from 'vue';

/**
 * @function useInfiniteLoading
 * @description ``Composable`` для работы с компонентом ``InfiniteLoading``
 *
 * @param {function(number)} fetch - Функция для загрузки данных. Должна принимать один параметр - загружаемую страницу
 */
export function useInfiniteLoading(fetch) {
    /**
     * @description Текущий общий список элементов
     * @type {Ref<UnwrapRef<*[]>>}
     */
    const items = ref([]);
    /**
     * @description Объект пагинации для переданного запроса
     * @type {Ref<UnwrapRef<null>>}
     */
    const pagination = ref(null);

    /**
     * @function load
     * @description Функция загрузки данных для компонента ``InfiniteLoading``.
     *
     * @param {Object} $state
     * @param {function: void} $state.loaded - Сообщить о завершении текущей загрузки
     * @param {function: void} $state.complete - Сообщить о завершении загрузки последней страницы данных
     * @returns {Promise<void>}
     */
    const load = async $state => {
        if (pagination.value.currentPage === pagination.value.pageCount) {
            $state.complete();
            return;
        }

        const data = await fetch(pagination.value.currentPage + 1);
        if (data.data?.length) items.value.push(...data.data);
        if (data.pagination) pagination.value = data.pagination;

        if (pagination.value.currentPage === pagination.value.pageCount) $state.complete();
        else $state.loaded();
    };

    return { load, items, pagination };
}
