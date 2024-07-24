<template>
    <section>
        <div class="container-fluid">
            <div class="row mb-2 mb-md-4">
                <FormCompany
                    v-if="companyFormIsVisible"
                    @close="companyFormIsVisible = false"
                    @created="getCompanies"
                />
                <FormCompanySearch v-if="queryIsInitialized" class="col-12" />
            </div>
            <div class="row">
                <div class="col-12">
                    <div class="d-flex flex-column flex-md-row justify-content-between">
                        <PaginationClassic
                            v-if="COMPANIES_PAGINATION && COMPANIES.length"
                            ref="firstPagination"
                            @next="next"
                            :pagination="COMPANIES_PAGINATION"
                        />
                        <div class="company-table__actions justify-content-start">
                            <Switch
                                v-if="!isMobile"
                                v-model="viewMode"
                                false-title="Таблица"
                                true-title="Карточки"
                            />
                            <Button
                                @click="companyFormIsVisible = true"
                                success
                                :disabled="isLoadingOriginal"
                            >
                                Создать компанию
                            </Button>
                            <RefreshButton @click="getCompanies" :disabled="isLoadingOriginal" />
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-12 offers-page__table">
                    <AnimationTransition :speed="0.2">
                        <component
                            :is="currentViewComponentName"
                            v-if="COMPANIES.length"
                            :companies="COMPANIES"
                            :loader="isLoadingOriginal"
                        />
                        <Spinner v-else-if="isLoading" />
                        <EmptyData v-else>Ничего не найдено</EmptyData>
                    </AnimationTransition>
                </div>
                <div class="col-12">
                    <PaginationClassic
                        v-if="COMPANIES_PAGINATION"
                        @next="nextWithScroll"
                        :pagination="COMPANIES_PAGINATION"
                    />
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { useStore } from 'vuex';
import FormCompany from '@/components/Forms/Company/FormCompany.vue';
import FormCompanySearch from '@/components/Forms/Company/FormCompanySearch.vue';
import CompanyTable from '@/components/Company/Table/CompanyTable.vue';
import CompanyGrid from '@/components/Company/CompanyGrid.vue';
import PaginationClassic from '@/components/common/Pagination/PaginationClassic.vue';
import RefreshButton from '@/components/common/RefreshButton.vue';
import Button from '@/components/common/Button.vue';
import Switch from '@/components/common/Forms/Switch.vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import EmptyData from '@/components/common/EmptyData.vue';
import { computed, ref } from 'vue';
import { useTableContent } from '@/composables/useTableContent.js';
import { useRoute } from 'vue-router';
import { useDelayedLoader } from '@/composables/useDelayedLoader.js';
import Spinner from '@/components/common/Spinner.vue';
import { useMobile } from '@/composables/useMobile.js';

const route = useRoute();
const store = useStore();

const COMPANIES = computed(() => store.getters.COMPANIES);
const COMPANIES_PAGINATION = computed(() => store.getters.COMPANIES_PAGINATION);

const isMobile = useMobile();
const { isLoading, isLoadingOriginal } = useDelayedLoader(true);
const viewMode = ref(false);
const companyFormIsVisible = ref(false);
const firstPagination = ref(null);

const getCompanies = async () => {
    isLoading.value = true;
    await store.dispatch('SEARCH_COMPANIES', { query: route.query });
    isLoading.value = false;
};

const { next, nextWithScroll, queryIsInitialized } = useTableContent(getCompanies, {
    scrollTo: firstPagination
});

const currentViewComponentName = computed(() => {
    if (isMobile) return CompanyGrid;
    return viewMode.value ? CompanyGrid : CompanyTable;
});
</script>
