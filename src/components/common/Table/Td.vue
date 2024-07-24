<template>
    <td :class="{ sortable: isAscSort || isDescSort, sort_asc: isAscSort, sort_desc: isDescSort }">
        <slot />
    </td>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const props = defineProps({
    sort: {
        type: String,
        default: null
    }
});

const isDescSort = computed(() => {
    const query = { ...route.query };
    if (!query.sort) return false;

    const words = query.sort.split(',');
    return words.some(item => item === `-${props.sort}`);
});

const isAscSort = computed(() => {
    const query = { ...route.query };
    if (!query.sort) return false;

    const words = query.sort.split(',');
    return words.some(item => item === props.sort);
});
</script>
