<template>
    <div class="pagination-classic__description">
        <span>
            <b>{{ current }}</b> страница из <b>{{ pagination.pageCount }}; </b>
        </span>
        <span>
            отображение строк <b>{{ countVisibleRows }}</b> (всего <b>{{ pagination.totalCount }}</b
            >)
        </span>
    </div>
</template>
<script setup>
import { computed } from 'vue';

const props = defineProps({
    pagination: Object,
    countVisibleRows: String
});

const current = computed(() => Math.min(props.pagination.pageCount, props.pagination.currentPage));
</script>
