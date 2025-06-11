<template>
    <th class="table__th th" :class="{ sortable: !!sort }">
        <div class="th__wrapper">
            <div @click="sortHandle" class="th__content">
                <slot />
                <i
                    v-if="isSorting"
                    class="fas ml-1 sortable__icon"
                    :class="{
                        'fa-sort-amount-down': isDescSort,
                        'fa-sort-amount-down-alt': isAscSort
                    }"
                />
            </div>
            <VDropdown v-if="$slots.filter">
                <template #trigger>
                    <div class="th__filter">
                        <i ref="filterIcon" :class="filterIcon" />
                        <span v-if="filtersCount" class="th__filter-badge">
                            {{ filtersCount }}
                        </span>
                    </div>
                </template>
                <DropdownContent :z-index="4001" class="th-dd-content">
                    <div class="p-3">
                        <slot name="filter" />
                        <div class="d-flex gap-2 mt-3 flex-wrap">
                            <slot name="actions">
                                <UiButton
                                    @click="$emit('confirm-filter')"
                                    color="light"
                                    icon="fa-solid fa-check"
                                    small
                                >
                                    Применить
                                </UiButton>
                                <UiButton
                                    @click="clearFilters"
                                    :disabled="filtersCount === 0"
                                    color="light"
                                    icon="fa-solid fa-trash"
                                    small
                                >
                                    Очистить
                                </UiButton>
                            </slot>
                        </div>
                    </div>
                </DropdownContent>
            </VDropdown>
        </div>
    </th>
</template>

<script setup>
import { computed, toRef, useTemplateRef } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useTippy } from 'vue-tippy';
import { DropdownContent } from 'v-dropdown';
import VDropdown from '@/components/common/Dropdown/VDropdown.vue';
import UiButton from '@/components/common/UI/UiButton.vue';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.js';

const route = useRoute();
const router = useRouter();

const emit = defineEmits(['sort', 'confirm-filter']);

const filters = defineModel('filters');

const props = defineProps({
    sort: {
        type: String,
        default: null
    },
    withRouter: {
        type: Boolean,
        default: true
    },
    filterIcon: {
        type: String,
        default: 'fa-solid fa-filter'
    },
    filterTooltip: {
        type: String,
        default: 'Открыть фильтр'
    }
});

const isDescSort = computed(() => {
    if (!props.withRouter) return false;

    const query = { ...route.query };
    if (!query.sort) return false;

    const words = query.sort.split(',');
    return words.some(item => item === `-${props.sort}`);
});

const isAscSort = computed(() => {
    if (!props.withRouter) return false;

    const query = { ...route.query };
    if (!query.sort) return false;

    const words = query.sort.split(',');
    return words.some(item => item === props.sort);
});

const isSorting = computed(() => Boolean(props.sort && (isDescSort.value || isAscSort.value)));

const sortHandle = () => {
    if (!props.sort) return;

    emit('sort', props.sort);
    if (!props.withRouter) return;

    const query = { ...route.query };

    if (!query.sort) {
        query.sort = props.sort;
        return router.push({ query });
    }

    const words = query.sort.split(',');
    let existSort = false;

    const newSortParams = [];

    words.forEach(element => {
        if (element === props.sort || element === `-${props.sort}`) {
            existSort = true;
            if (element === props.sort) newSortParams.push(`-${props.sort}`);
        } else {
            newSortParams.push(element);
        }
    });

    if (existSort) query.sort = newSortParams.join();
    else query.sort += `,${props.sort}`;

    if (!query.sort) {
        delete query.sort;
    }

    return router.push({ query });
};

useTippy(useTemplateRef('filterIcon'), {
    content: toRef(props, 'filterTooltip'),
    theme: 'white',
    arrow: false
});

function clearFilters() {
    const query = { ...route.query };

    Object.keys(filters.value).forEach(key => {
        delete query[key];
        filters.value[key] = null;
    });

    router.replace({ query });
}

const filtersCount = computed(() => {
    const query = { ...route.query };

    return Object.keys(filters.value).reduce(
        (acc, key) => acc + Number(isNotNullish(query[key])),
        0
    );
});
</script>
