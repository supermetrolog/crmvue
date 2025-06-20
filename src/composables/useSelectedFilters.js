import { computed, onMounted } from 'vue';
import { toValue } from '@vueuse/core';
import { useRoute, useRouter } from 'vue-router';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.js';
import { isEmpty } from '@/utils/helpers/common/isEmpty.js';
import { isArray } from '@/utils/helpers/array/isArray.ts';
import { isEmptyArray } from '@/utils/helpers/array/isEmptyArray.js';
import { isEmptyObject } from '@/utils/helpers/object/isEmptyObject.js';
import { isNullish } from '@/utils/helpers/common/isNullish.ts';
import { joinWithFilter } from '@/utils/helpers/array/joinWithFilter.js';
import { useStore } from 'vuex';

export const filtersAliases = {
    polygon: 'Область на карте',
    rangeMaxArea: 'До:',
    rangeMinArea: 'От:',
    rangeMaxDistanceFromMKAD: 'От МКАД:',
    rangeMinElectricity: 'От:',
    rangeMaxPricePerFloor: 'До:',
    rangeMinPricePerFloor: 'От:',
    rangeMinCeilingHeight: 'Потолки От:',
    rangeMaxCeilingHeight: 'Потолки До:',
    class: 'Класс:',
    heated: 'Отопление:',
    water: 'Вода',
    gas: 'Газ',
    steam: 'Пар',
    sewage_central: 'КНС',
    is_fake: 'Показать фейковые',
    racks: 'Стеллажи',
    railway: 'Ж/Д ветка',
    has_cranes: 'Краны',
    firstFloorOnly: 'Только 1 этаж',
    ad_realtor: 'Realtor.ru:',
    ad_cian: 'Циан:',
    ad_yandex: 'Яндекс:',
    ad_free: 'Бесплатно:',
    ad_avito: 'Авито:',
    favorites: 'Избранные',
    sort: 'Сортировка:',
    nameRu: 'Название Ru:',
    nameEng: 'Название Eng:',
    dateStart: 'Создано после:',
    dateEnd: 'Создано до:',
    status: 'Статус:',
    all: 'Поисковой запрос',
    search: 'Поисковой запрос',
    consultant_id: 'Консультант:',
    agent_id: 'Консультант:',
    productRanges: 'Номенклатура:',
    without_product_ranges: 'Без номенклатуры',
    with_passive_consultant: 'С неактивными консультантами',
    statuses: 'Статус:',
    user_ids: 'Сотрудник:',
    consultant_ids: 'Консультанты:',
    gaz: 'Газ',
    maxElectricity: 'Макс. электричество:',
    antiDustOnly: 'Только антипыль',
    trainLine: 'Ж/Д ветка',
    haveCranes: 'Нужны краны',
    shelving: 'Стеллажи',
    sewerage: 'Канализация',
    cian_regions: 'Регионы ЦИАН:',
    with_current_user_tasks: 'С активными задачами',
    requests_filter: 'Связь с запросами',
    categories: 'Категории'
};

const IGNORING_FILTERS = new Set([
    'page',
    'region_neardy',
    'outside_mkad',
    'type_id',
    'withoutOffersFromQuery'
]);

export function useSelectedFilters(form = {}, humanizeGetters = {}, options = {}) {
    const { useFakeRegion = true, ignore: localIgnoringFilters = new Set() } = toValue(options);

    const route = useRoute();

    function humanizeFilter(key, value) {
        const option = {
            value: key
        };

        const label = filtersAliases[key] ?? null;
        const _value = Object.hasOwn(toValue(humanizeGetters), key)
            ? toValue(humanizeGetters)[key](value)
            : null;

        if (isNullish(label) && isNullish(_value)) option.label = `[${key}]`;
        else option.label = joinWithFilter([label, _value], isNotNullish);

        return option;
    }

    const selectedQueryFilters = computed(() => {
        const filters = [];

        for (const key in route.query) {
            if (IGNORING_FILTERS.has(key) || localIgnoringFilters.has(key)) continue;

            const value = route.query[key];

            if (key === 'region' && useFakeRegion) {
                filters.push({ key, value: route.query.fakeRegion });
            } else if (
                isNotNullish(value) &&
                !isEmpty(value) &&
                key !== 'fakeRegion' &&
                !(isArray(value) && isEmptyArray(value))
            ) {
                filters.push({ key, value });
            }
        }

        return filters;
    });

    const selectedFilters = computed(() => {
        const filters = [];

        const query = toValue(form);

        if (isEmptyObject(query)) return filters;

        for (const key in query) {
            if (IGNORING_FILTERS.has(key) || localIgnoringFilters.has(key)) continue;

            const value = query[key];

            if (key === 'region' && useFakeRegion) {
                filters.push({ key, value: query.fakeRegion });
            } else if (
                isNotNullish(value) &&
                value !== '' &&
                key !== 'fakeRegion' &&
                !(isArray(value) && isEmptyArray(value))
            ) {
                filters.push({ key, value });
            }
        }

        return filters;
    });

    const humanizedSelectedFilters = computed(() => {
        return selectedFilters.value.map(filter => humanizeFilter(filter.key, filter.value));
    });

    const humanizedSelectedQueryFilters = computed(() => {
        return selectedQueryFilters.value.map(filter => humanizeFilter(filter.key, filter.value));
    });

    const filtersCount = computed(() => selectedFilters.value.length);
    const queryFiltersCount = computed(() => selectedQueryFilters.value.length);

    const store = useStore();

    onMounted(() => {
        if (!store.getters.REGION_LIST?.length) store.dispatch('FETCH_REGION_LIST');
    });

    const router = useRouter();

    function removeQueryFilterByKey(key) {
        const query = { ...route.query };

        delete query[key];

        router.replace({ query });
    }

    return {
        filtersCount,
        queryFiltersCount,
        selectedQueryFilters,
        selectedFilters,
        humanizedSelectedQueryFilters,
        humanizedSelectedFilters,
        removeQueryFilterByKey
    };
}
