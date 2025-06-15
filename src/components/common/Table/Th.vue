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
            <VDropdown v-if="sortingOptions">
                <template #trigger>
                    <div class="th__filter" :class="{ active: hasManualSort }">
                        <i
                            ref="sortIcon"
                            class="fa-solid"
                            :class="{
                                'fa-sort-amount-down': !isAscSort,
                                'fa-sort-amount-down-alt': isAscSort
                            }"
                        />
                    </div>
                </template>
                <DropdownContent :z-index="4001" class="th-dd-content th-dd-content__sort">
                    <div class="p-3 w-100">
                        <MultiSelect
                            v-model="sortingOption"
                            label="Сортировка"
                            placeholder="Выберите сортировку"
                            :options="sortingOptions"
                            :append-to-body="false"
                            class="mb-2"
                        >
                            <template #singlelabel="{ value }">
                                <i
                                    v-if="value.icon"
                                    :class="value.icon"
                                    class="mr-2 multiselect-option-icon"
                                />
                                <span>{{ value.label }}</span>
                            </template>
                        </MultiSelect>
                        <span class="form__subtitle">Порядок сортировки</span>
                        <div class="form__row mt-1">
                            <RadioChip
                                v-model="sortingOptionIsDesc"
                                label="Сначала старые"
                                :value="false"
                                :rounded="false"
                                icon="fa-solid fa-sort-amount-down"
                            />
                            <RadioChip
                                v-model="sortingOptionIsDesc"
                                label="Сначала новые"
                                :value="true"
                                :rounded="false"
                                icon="fa-solid fa-sort-amount-up-alt"
                            />
                        </div>
                        <div class="d-flex gap-2 mt-3 flex-wrap">
                            <slot name="actions">
                                <UiButton
                                    @click="clearSort"
                                    :disabled="!hasManualSort"
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
            <VDropdown v-if="$slots.filter">
                <template #trigger>
                    <div class="th__filter">
                        <i ref="filterIcon" :class="filterIcon" />
                        <span v-if="filtersCount" class="th__filter-badge">
                            {{ filtersCount }}
                        </span>
                    </div>
                </template>
                <DropdownContent :z-index="4001" class="th-dd-content th-dd-content__filter">
                    <div class="p-3 w-100">
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
import { computed, ref, toRef, useTemplateRef, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useTippy } from 'vue-tippy';
import { DropdownContent } from 'v-dropdown';
import VDropdown from '@/components/common/Dropdown/VDropdown.vue';
import UiButton from '@/components/common/UI/UiButton.vue';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.js';
import { isNullish } from '@/utils/helpers/common/isNullish.js';
import MultiSelect from '@/components/common/Forms/MultiSelect.vue';
import { isString } from '@/utils/helpers/string/isString.js';
import RadioChip from '@/components/common/Forms/RadioChip.vue';

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
    },
    sortTooltip: {
        type: String,
        default: 'Открыть сортировку'
    },
    sortingOptions: Array
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

// manual sort

const sortingOptionIsDesc = ref(false);

const sortingOption = computed({
    get() {
        const value = route.query.sort;

        if (isNullish(value)) {
            return null;
        }

        if (value.startsWith('-')) return value.substring(1);
        return value;
    },
    set: updateSortRoute
});

function updateSortRoute(value) {
    if (isNullish(value)) {
        return router.replace({ query: { ...route.query, sort: null } });
    }

    router.replace({
        query: { ...route.query, sort: sortingOptionIsDesc.value ? `-${value}` : value }
    });
}

watch(
    () => route.query.sort,
    value => {
        if (isString(value)) {
            sortingOptionIsDesc.value = value.startsWith('-');
        }
    },
    { immediate: true }
);

watch(
    sortingOptionIsDesc,
    () => {
        if (isNotNullish(sortingOption.value)) {
            updateSortRoute(sortingOption.value);
        }
    },
    { immediate: true }
);

const hasManualSort = computed(() => {
    if (isNullish(props.sortingOptions)) {
        return false;
    }

    return props.sortingOptions.some(
        item => item.value === sortingOption.value || item.value === `-${sortingOption.value}`
    );
});

function clearSort() {
    sortingOption.value = null;
}

useTippy(useTemplateRef('sortIcon'), {
    content: toRef(props, 'sortTooltip'),
    theme: 'white',
    arrow: false
});

// filters

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
