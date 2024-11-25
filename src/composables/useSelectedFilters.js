import { computed } from 'vue';
import { toValue } from '@vueuse/core';
import { useRoute } from 'vue-router';
import { filtersAliases } from '@/const/const.js';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.js';
import { isEmpty } from '@/utils/helpers/common/isEmpty.js';
import { isArray } from '@/utils/helpers/array/isArray.js';
import { isEmptyArray } from '@/utils/helpers/array/isEmptyArray.js';
import { isEmptyObject } from '@/utils/helpers/object/isEmptyObject.js';
import { isNullish } from '@/utils/helpers/common/isNullish.js';
import { joinWithFilter } from '@/utils/helpers/array/joinWithFilter.js';

export function useSelectedFilters(form = {}, humanizeGetters = {}) {
    const route = useRoute();

    function humanizeFilter(key, value) {
        const option = {
            value: key
        };

        const label = filtersAliases[key] ?? null;
        const _value = Object.hasOwn(toValue(humanizeGetters), key)
            ? toValue(humanizeGetters)[key](value)
            : null;

        console.log(_value, label, option, key, value);

        if (isNullish(label) && isNullish(_value)) option.label = '[не определено]';
        else option.label = joinWithFilter([label, _value], isNotNullish);

        return option;
    }

    const selectedQueryFilters = computed(() => {
        const filters = [];
        const query = { ...route.query };

        delete query.region_neardy;
        delete query.page;
        delete query.outside_mkad;

        for (const key in query) {
            const value = query[key];

            if (key === 'region') {
                filters.push({ key, value: query.fakeRegion });
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

        const query = { ...toValue(form) };

        if (isEmptyObject(query)) return filters;

        delete query.region_neardy;
        delete query.all;
        delete query.page;
        delete query.outside_mkad;

        for (const key in query) {
            const value = query[key];

            if (key === 'region') {
                filters.push(humanizeFilter(key, query.fakeRegion));
            } else if (
                value !== null &&
                value !== '' &&
                key !== 'fakeRegion' &&
                !(Array.isArray(value) && value.length === 0)
            ) {
                filters.push(humanizeFilter(key, value));
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

    return {
        filtersCount,
        queryFiltersCount,
        selectedQueryFilters,
        selectedFilters,
        humanizedSelectedQueryFilters,
        humanizedSelectedFilters
    };
}
