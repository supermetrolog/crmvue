<template>
    <section class="companies-requests">
        <div class="container-fluid">
            <div class="row mb-4">
                <FormCompanyRequestSearch v-if="queryIsInitialized" class="col-8" />
            </div>
            <div class="row justify-content-between">
                <PaginationClassic
                    v-if="REQUESTS_PAGINATION"
                    ref="firstPagination"
                    @next="next"
                    class="col-6"
                    :pagination="REQUESTS_PAGINATION"
                />
                <div class="company-table__actions col-4">
                    <RefreshButton @click="fetchRequests" :disabled="isLoadingOriginal" />
                </div>
            </div>
            <div class="row">
                <div class="col-12 offers-page__table">
                    <AnimationTransition :speed="0.2">
                        <CompanyRequestTable
                            v-if="!isMobile && REQUESTS.length"
                            :loader="isLoadingOriginal"
                            :requests="REQUESTS"
                        />
                        <CompanyRequestTableMobile
                            v-else-if="isMobile && REQUESTS.length"
                            :loader="isLoadingOriginal"
                            :requests="REQUESTS"
                        />
                        <Spinner v-else-if="isLoading" />
                        <EmptyData v-else>Ничего не найдено...</EmptyData>
                    </AnimationTransition>
                </div>
                <div class="col-12">
                    <PaginationClassic
                        v-if="REQUESTS_PAGINATION"
                        @next="nextWithScroll"
                        :pagination="REQUESTS_PAGINATION"
                    />
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { useStore } from 'vuex';
import FormCompanyRequestSearch from '@/components/Forms/Company/FormCompanyRequestSearch.vue';
import PaginationClassic from '@/components/common/Pagination/PaginationClassic.vue';
import CompanyRequestTable from '@/components/Company/Request/CompanyRequestTable.vue';
import CompanyRequestTableMobile from '@/components/Company/Request/CompanyRequestTableMobile.vue';
import RefreshButton from '@/components/common/RefreshButton.vue';
import { computed, ref } from 'vue';
import { useTableContent } from '@/composables/useTableContent.js';
import { useDelayedLoader } from '@/composables/useDelayedLoader.js';
import { useRoute } from 'vue-router';
import EmptyData from '@/components/common/EmptyData.vue';
import Spinner from '@/components/common/Spinner.vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import { useMobile } from '@/composables/useMobile.js';

const store = useStore();
const route = useRoute();

const { isLoading, isLoadingOriginal } = useDelayedLoader();

const firstPagination = ref(null);
const isMobile = useMobile();

const REQUESTS = computed(() => store.getters.REQUESTS);
const REQUESTS_PAGINATION = computed(() => store.getters.REQUESTS_PAGINATION);

const fetchRequests = async () => {
    isLoading.value = true;
    await store.dispatch('SEARCH_REQUESTS', { query: route.query });
    isLoading.value = false;
};

const { next, nextWithScroll, queryIsInitialized } = useTableContent(fetchRequests, {
    scrollTo: firstPagination
});
</script>
