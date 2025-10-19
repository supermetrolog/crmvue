<template>
    <th
        ref="thEl"
        class="table__th th"
        :class="{
            sortable: !!sort
        }"
        :style="{
            width: columnWidthInPx,
            minWidth: minColumnWidthInPx,
            maxWidth: maxColumnWidthInPx
        }"
    >
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
                <DropdownContent
                    :z-index="4001"
                    class="th-dd-content th-dd-content__sort"
                    :data-tr-name="name"
                >
                    <div class="p-3 w-100">
                        <MultiSelect
                            v-model="sortingOption"
                            label="Сортировка"
                            placeholder="Выберите сортировку"
                            :options="sortingOptions"
                            :append-to-body="false"
                            class="mb-2 th-dd-content__sort-select"
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
                        <AnimationTransition :speed="0.4">
                            <div v-show="!sortingOptionOnlyAsc" class="th-dd-content__sort-order">
                                <span class="form__subtitle">Порядок сортировки</span>
                                <div class="form__row mt-1">
                                    <RadioChip
                                        v-model="sortingOptionIsDesc"
                                        :disabled="sortingOptionOnlyAsc"
                                        :label="sortingOptionAscLabel"
                                        :value="false"
                                        :rounded="false"
                                        icon="fa-solid fa-sort-amount-down"
                                    />
                                    <RadioChip
                                        v-model="sortingOptionIsDesc"
                                        :disabled="sortingOptionOnlyAsc"
                                        :label="sortingOptionDescLabel"
                                        :value="true"
                                        :rounded="false"
                                        icon="fa-solid fa-sort-amount-up-alt"
                                    />
                                </div>
                            </div>
                        </AnimationTransition>
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
                                <slot name="after-actions" />
                            </slot>
                        </div>
                    </div>
                </DropdownContent>
            </VDropdown>
            <VDropdown v-if="$slots.filter" ref="filterDropdownEl">
                <template #trigger>
                    <div class="th__filter">
                        <i ref="filterIcon" :class="filterIcon" />
                        <span v-if="filtersCount" class="th__filter-badge">
                            {{ filtersCount }}
                        </span>
                    </div>
                </template>
                <DropdownContent
                    :z-index="4001"
                    class="th-dd-content th-dd-content__filter"
                    style="max-width: 550px"
                >
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
        <ThResizer v-if="effectiveResizable" @mousedown="onMouseDown" @dbclick="onDblClick" />
    </th>
</template>

<script setup lang="ts">
import { computed, ref, toRef, toValue, useTemplateRef, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useTippy } from 'vue-tippy';
import { DropdownContent } from 'v-dropdown';
import VDropdown from '@/components/common/Dropdown/VDropdown.vue';
import UiButton from '@/components/common/UI/UiButton.vue';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish';
import { isNullish } from '@/utils/helpers/common/isNullish';
import MultiSelect from '@/components/common/Forms/MultiSelect.vue';
import { isString } from '@/utils/helpers/string/isString.js';
import RadioChip from '@/components/common/Forms/RadioChip.vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import { useTableColumnWidth } from '@/composables/useTableColumnWidth';
import { useTableColumnResize } from '@/composables/useTableColumnResize';
import ThResizer from '@/components/common/Table/ThResizer.vue';

const route = useRoute();
const router = useRouter();

const emit = defineEmits<{
    (e: 'sort', value: string): void;
    (e: 'confirm-filter'): void;
}>();

const filters = defineModel<Record<string, any>>('filters');

export type TableSortingOption = {
    value: string;
    label: string;
    icon?: string;
    asc?: string;
    desc?: string;
    onlyAsc?: boolean;
};

const props = withDefaults(
    defineProps<{
        sort?: string;
        withRouter?: boolean;
        filterIcon?: string;
        filterTooltip?: string;
        sortTooltip?: string;
        sortingOptions?: TableSortingOption[];
        name?: string;
        resizable?: boolean;
        minWidth?: number;
        maxWidth?: number;
    }>(),
    {
        withRouter: true,
        filterIcon: 'fa-solid fa-filter',
        filterTooltip: 'Открыть фильтр',
        sortTooltip: 'Открыть сортировку',
        resizable: true
    }
);

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

const sortingOptionOnlyAsc = computed(() => {
    if (!sortingOption.value) return false;

    if (!props.sortingOptions?.length) return false;

    const option = props.sortingOptions.find(item => item.value === sortingOption.value);
    if (!option) return false;

    return option.onlyAsc ?? false;
});

const sortingOptionDescLabel = computed(() => {
    if (sortingOption.value && props.sortingOptions?.length) {
        const option = props.sortingOptions.find(item => item.value === sortingOption.value);

        if (isNotNullish(option?.desc)) {
            return option.desc;
        }
    }

    return 'Сначала новые';
});

const sortingOptionAscLabel = computed(() => {
    if (sortingOption.value && props.sortingOptions?.length) {
        const option = props.sortingOptions.find(item => item.value === sortingOption.value);

        if (isNotNullish(option?.asc)) {
            return option.asc;
        }
    }

    return 'Сначала старые';
});

function updateSortRoute(value) {
    if (isNullish(value)) {
        return router.replace({ query: { ...route.query, sort: null } });
    }

    const option = props.sortingOptions?.find(item => item.value === value);
    const _sortingOptionOnlyAsc = option?.onlyAsc ?? false;

    router.replace({
        query: {
            ...route.query,
            sort: sortingOptionIsDesc.value && !_sortingOptionOnlyAsc ? `-${value}` : value
        }
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

const filterDropdownEl = useTemplateRef('filterDropdownEl');

function closeFilters() {
    filterDropdownEl.value?.close();
}

defineExpose({ closeFilters });

// resize

const {
    widths,
    resizable: isResizable,
    constraints,
    setColWidth,
    resetColWidth
} = useTableColumnWidth();

const thEl = useTemplateRef('thEl');

const effectiveResizable = computed(() => {
    if (!props.name) return false;

    return props.resizable ?? toValue(isResizable);
});

const columnWidth = computed(() => {
    if (!props.name) return undefined;
    return widths[props.name];
});

const columnWidthInPx = computed(() => (columnWidth.value ? `${columnWidth.value}px` : undefined));

const minColumnWidth = computed(() => {
    if (props.minWidth) {
        return props.minWidth;
    }

    if (constraints) {
        return toValue(constraints)[props.name!]?.min;
    }

    return undefined;
});

const minColumnWidthInPx = computed(() =>
    minColumnWidth.value ? `${minColumnWidth.value}px` : undefined
);

const maxColumnWidth = computed(() => {
    if (props.maxWidth) {
        return props.maxWidth;
    }

    if (constraints) {
        return toValue(constraints)[props.name!]?.max;
    }

    return undefined;
});

const maxColumnWidthInPx = computed(() =>
    maxColumnWidth.value ? `${maxColumnWidth.value}px` : undefined
);

const { start } = useTableColumnResize({
    onResize: ({ col, width }) => {
        if (!effectiveResizable.value) return;

        setColWidth(col, width);
    }
});

function onMouseDown(e: MouseEvent) {
    if (!props.name || !thEl.value) return;

    const startWidth = thEl.value.getBoundingClientRect().width;

    start(e, props.name, startWidth);
}

function onDblClick() {
    if (!effectiveResizable.value) return;

    resetColWidth(props.name);
}
</script>
