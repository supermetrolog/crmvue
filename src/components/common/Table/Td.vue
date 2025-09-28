<template>
    <td
        :class="{
            sortable: isAscSort || isDescSort,
            sort_asc: isAscSort,
            sort_desc: isDescSort
        }"
        :style="{
            width: columnWidthInPx,
            minWidth: minColumnWidthInPx,
            maxWidth: maxColumnWidthInPx
        }"
    >
        <slot />
    </td>
</template>

<script setup lang="ts">
import { computed, toValue } from 'vue';
import { useRoute } from 'vue-router';
import { useTableColumnWidth } from '@/composables/useTableColumnWidth';

const props = defineProps<{
    sort?: string;
    name?: string;
}>();

const route = useRoute();

const currentSort = computed(() => {
    if (!props.sort) return false;

    const query = { ...route.query };
    if (!query.sort) return false;

    return query.sort.split(',').find(item => item === props.sort || item === `-${props.sort}`);
});

const isDescSort = computed(() => currentSort.value === `-${props.sort}`);
const isAscSort = computed(() => currentSort.value === props.sort);

const { widths, constraints } = useTableColumnWidth();

const columnWidth = computed(() => {
    if (!props.name) return undefined;

    return widths[props.name];
});

const columnWidthInPx = computed(() => (columnWidth.value ? `${columnWidth.value}px` : undefined));

const minColumnWidth = computed(() => {
    if (!props.name) {
        return undefined;
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
    if (!props.name) {
        return undefined;
    }

    if (constraints) {
        return toValue(constraints)[props.name!]?.max;
    }

    return undefined;
});

const maxColumnWidthInPx = computed(() =>
    maxColumnWidth.value ? `${maxColumnWidth.value}px` : undefined
);
</script>
