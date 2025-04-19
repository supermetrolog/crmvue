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
                <div class="col-12 my-2">
                    <div class="company-table__filters">
                        <Chip
                            v-for="item in humanizedSelectedQueryFilters"
                            :key="item.value"
                            @delete="removeFilter(item.value)"
                            :value="item.value"
                            :html="item.label"
                        />
                    </div>
                </div>
            </div>
            <div class="row">
                <UserFolders
                    v-model:selected="currentFolder"
                    morph="company"
                    class="col-12"
                    movable
                    editable
                    selectable
                />
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
import { computed, ref, watch } from 'vue';
import { useTableContent } from '@/composables/useTableContent.js';
import { useRoute, useRouter } from 'vue-router';
import { useDelayedLoader } from '@/composables/useDelayedLoader.js';
import Spinner from '@/components/common/Spinner.vue';
import { useMobile } from '@/composables/useMobile.js';
import Chip from '@/components/common/Chip.vue';
import { useSelectedFilters } from '@/composables/useSelectedFilters.js';
import { ActivePassive, CompanyCategories } from '@/const/const.js';
import { useConsultantsOptions } from '@/composables/options/useConsultantsOptions.js';
import { isArray } from '@/utils/helpers/array/isArray.js';
import { isEmptyArray } from '@/utils/helpers/array/isEmptyArray.js';
import { companyOptions } from '@/const/options/company.options.js';
import { toDateFormat } from '@/utils/formatters/date.js';
import UserFolders from '@/components/UserFolder/UserFolders.vue';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.js';
import { useDebounceFn } from '@vueuse/core';

const route = useRoute();
const router = useRouter();
const store = useStore();

const COMPANIES = computed(() => store.getters.COMPANIES);
const COMPANIES_PAGINATION = computed(() => store.getters.COMPANIES_PAGINATION);
const { consultantsOptions } = useConsultantsOptions();

const isMobile = useMobile();
const { isLoading, isLoadingOriginal } = useDelayedLoader(true);
const viewMode = ref(false);
const companyFormIsVisible = ref(false);
const firstPagination = ref(null);

const gettersForFilters = {
    consultant_id: value => {
        if (consultantsOptions.value.length)
            return consultantsOptions.value.find(element => Number(element.value) === Number(value))
                ?.label;
        return null;
    },
    categories: value => {
        if (isArray(value) && !isEmptyArray(value))
            return value.map(category => CompanyCategories[category]).join(', ');
        return null;
    },
    activityGroup: value => companyOptions.activityGroup[value],
    activityProfile: value => companyOptions.activityProfile[value],
    dateStart: value => toDateFormat(value, 'DD.MM.YYYY'),
    dateEnd: value => toDateFormat(value, 'DD.MM.YYYY'),
    status: value => {
        if (!value) return null;
        return ActivePassive[value];
    },
    productRanges: value => {
        return value.join(', ');
    },
    activity_group_ids: value => {
        if (isArray(value) && !isEmptyArray(value))
            return value.map(group => companyOptions.activityGroup[group]).join(', ');
        return null;
    },
    activity_profile_ids: value => {
        if (isArray(value) && !isEmptyArray(value))
            return value.map(profile => companyOptions.activityProfile[profile]).join(', ');
        return null;
    }
};

const { humanizedSelectedQueryFilters } = useSelectedFilters({}, gettersForFilters);

const getCompanies = async () => {
    isLoading.value = true;

    const query = { ...route.query };

    if (isNotNullish(currentFolder.value)) {
        query.folder_ids = [currentFolder.value];
    }

    await store.dispatch('SEARCH_COMPANIES', { query });

    isLoading.value = false;
};

const debouncedFetchCompanies = useDebounceFn(getCompanies, 300);

const { next, nextWithScroll, queryIsInitialized } = useTableContent(getCompanies, {
    scrollTo: firstPagination
});

const currentViewComponentName = computed(() => {
    if (isMobile) return CompanyGrid;
    return viewMode.value ? CompanyGrid : CompanyTable;
});

function removeFilter(filter) {
    const query = { ...route.query };

    delete query[filter];

    router.replace({ query });
}

// folders

const currentFolder = ref(null);

watch(currentFolder, debouncedFetchCompanies);
</script>
