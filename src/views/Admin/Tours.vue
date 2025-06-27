<template>
    <section class="calls-page">
        <div class="container-fluid">
            <div class="row">
                <UiCol :cols="12">
                    <div class="white-block mb-3">
                        <div class="row">
                            <PaginationClassic
                                ref="firstPagination"
                                @next="setNextPage"
                                :pagination="pagination"
                                class="col-xxl-6 col-lg-8 col-2"
                                :loading="isLoading"
                            />
                        </div>
                    </div>
                    <Spinner v-if="isLoading && !tours.length" />
                    <EmptyData v-else-if="!tours.length">Список туров пуст..</EmptyData>
                    <TourTable v-if="tours.length" :loading="isLoading" :tours />
                    <div v-if="tours.length" v-show="!isLoading" class="white-block mt-3">
                        <PaginationClassic @next="setNextPage" :pagination="pagination" />
                    </div>
                </UiCol>
            </div>
        </div>
    </section>
</template>

<script setup>
import PaginationClassic from '@/components/common/Pagination/PaginationClassic.vue';
import api from '@/api/api.js';
import Spinner from '@/components/common/Spinner.vue';
import EmptyData from '@/components/common/EmptyData.vue';
import { onBeforeMount, ref, watch } from 'vue';
import UiCol from '@/components/common/UI/UiCol.vue';
import { useRoute, useRouter } from 'vue-router';
import { useDebounceFn } from '@vueuse/core';
import TourTable from '@/components/TourTable/TourTable.vue';

const route = useRoute();
const router = useRouter();

const isLoading = ref(false);

const tours = ref([]);
const pagination = ref(null);

async function fetchTours() {
    isLoading.value = true;

    const response = await api.tour.history(createQuery());
    if (response) {
        tours.value = response.data;
        pagination.value = response.pagination;
    }

    isLoading.value = false;
}

onBeforeMount(fetchTours);

const debouncedFetchTours = useDebounceFn(fetchTours, 200);

watch(() => route.query?.sort, debouncedFetchTours);
watch(() => route.query?.page, debouncedFetchTours);

function createQuery() {
    return {
        ...route.query
    };
}

function setNextPage(page) {
    router.replace({ query: { ...route.query, page } });
}
</script>
