<template>
    <div class="pagination-classic" :class="{ disabled: isDisabled || disabled || loading }">
        <div v-if="loading || !pagination" class="pagination-classic__pages skeleton-body">
            <PaginationPage v-for="number of 7" :key="number" class="skeleton skeleton--rect">
                {{ number }}
            </PaginationPage>
        </div>
        <div v-else class="pagination-classic__pages">
            <PaginationPage @click="next(1)" navigate :disabled="isFirstPage">
                <i class="fa-solid fa-angles-left"></i>
            </PaginationPage>
            <PaginationPage
                @click="next(pagination.currentPage - 1)"
                navigate
                :disabled="isFirstPage"
            >
                <i class="fa-solid fa-angle-left"></i>
            </PaginationPage>
            <PaginationPage
                v-for="number of pageList"
                :key="number"
                @click="next(number)"
                :active="number === pagination.currentPage"
                :class="{ loading: nextPage === number && isDisabled }"
            >
                {{ number }}
            </PaginationPage>
            <PaginationPage
                @click="next(pagination.currentPage + 1)"
                navigate
                :disabled="isLastPage"
            >
                <i class="fa-solid fa-angle-right"></i>
            </PaginationPage>
            <PaginationPage @click="next(pagination.pageCount)" navigate :disabled="isLastPage">
                <i class="fa-solid fa-angles-right"></i>
            </PaginationPage>
        </div>
        <PaginationDescription
            v-if="withDescription && !loading && pagination"
            :pagination="pagination"
            :count-visible-rows="countVisibleRows"
        />
    </div>
</template>

<script setup>
import PaginationPage from '@/components/common/Pagination/PaginationPage.vue';
import PaginationDescription from '@/components/common/Pagination/PaginationDescription.vue';
import { computed, onUnmounted, shallowRef, watch } from 'vue';

const emit = defineEmits(['next']);
const props = defineProps({
    pagination: {
        totalCount: Number,
        perPage: Number,
        pageCount: Number,
        currentPage: Number
    },
    offset: {
        type: Number,
        default: 2
    },
    withDescription: {
        type: Boolean,
        default: true
    },
    disabled: Boolean,
    loading: Boolean
});

let timeout = null;
const nextPage = shallowRef(props.pagination?.currentPage);

watch(
    () => props.pagination?.currentPage,
    () => {
        nextPage.value = props.pagination?.currentPage;
    }
);

const isLastPage = computed(
    () =>
        props.pagination.pageCount === props.pagination.currentPage ||
        props.pagination.pageCount === 0
);
const isFirstPage = computed(() => props.pagination.currentPage === 1);
const countVisibleRows = computed(() => {
    const from = props.pagination.perPage * (props.pagination.currentPage - 1);
    const to = Math.min(
        props.pagination.perPage * props.pagination.currentPage,
        props.pagination.totalCount
    );

    return from + ' - ' + to;
});

const pageList = computed(() => {
    if (!props.pagination) return [];

    let min = props.pagination.currentPage - props.offset;
    let max = props.pagination.currentPage + props.offset;

    if (min < 1) max += 1 - min;
    if (max > props.pagination.pageCount) min -= max - props.pagination.pageCount;

    max = Math.min(max, props.pagination.pageCount);
    min = Math.max(min, 1);

    return Array.from(Array(max - min + 1).keys()).map((_, key) => min + key);
});

const isDisabled = computed(() => props.pagination?.currentPage !== nextPage.value);

const next = page => {
    if (isDisabled.value) return;

    nextPage.value = page;
    emit('next', page);
};

onUnmounted(() => {
    clearTimeout(timeout);
});
</script>
