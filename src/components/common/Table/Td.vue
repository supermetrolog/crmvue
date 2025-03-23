<template>
    <td :class="{ sortable: isAscSort || isDescSort, sort_asc: isAscSort, sort_desc: isDescSort }">
        <slot />
    </td>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const props = defineProps({
    sort: String
});

const route = useRoute();

const currentSort = computed(() => {
    if (!props.sort) return false;

    const query = { ...route.query };
    if (!query.sort) return false;

    return query.sort.split(',').find(item => item === props.sort || item === `-${props.sort}`);
});

const isDescSort = computed(() => currentSort.value === `-${props.sort}`);
const isAscSort = computed(() => currentSort.value === props.sort);
</script>
