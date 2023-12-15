<template>
    <div class="all">
        <transition
            mode="out-in"
            enter-active-class="animate__animated animate__zoomIn for__modal absolute"
            leave-active-class="animate__animated animate__zoomOut for__modal absolute"
        >
            <FormCompanyGroup
                v-if="companyGroupsFormVisible"
                @closeCompanyGroupsForm="companyGroupsFormVisible = false"
            />
        </transition>
        <transition
            mode="out-in"
            enter-active-class="animate__animated animate__zoomIn for__modal absolute"
            leave-active-class="animate__animated animate__zoomOut for__modal absolute"
        >
            <FormCompany
                v-if="companyFormVisible"
                @closeCompanyForm="clickCloseCompanyForm"
                @created="createdCompany"
            />
        </transition>
        <div class="row no-gutters search-main-container">
            <div class="container py-3">
                <div class="col-12 pt-3">
                    <FormCompanySearch v-if="mounted" />
                </div>
            </div>
        </div>
        <hr />

        <div class="row no-gutters companies-actions">
            <div class="col-md-6">
                <PaginationClassic
                    v-if="COMPANIES_PAGINATION"
                    @next="next"
                    :pagination="COMPANIES_PAGINATION"
                    class="d-inline"
                />
                <RefreshButton @click="getCompanies" class="ml-md-3 ml-2" :disabled="loader" />
            </div>
            <div class="col-md-6 text-right ml-auto">
                <button @click="companyGroupsFormVisible = true" class="btn btn-primary mr-md-2 ml-md-5">
                    Создать группу компаний
                </button>
                <button @click="companyFormVisible = true" class="btn btn-primary">Создать компанию</button>
            </div>
        </div>
        <div class="row no-gutters mt-2">
            <div class="col-12 companies-list-container">
                <Loader v-if="loader && !COMPANIES.length" class="center" />
                <CompanyTable v-if="COMPANIES.length && !this.isMobile" :companies="COMPANIES" :loader="loader" />
                <CompanyTableMobile v-if="COMPANIES.length && this.isMobile" :companies="COMPANIES" :loader="loader" />
                <h1 v-if="!COMPANIES.length && !loader" class="text-center text-dark py-5">НИЧЕГО НЕ НАЙДЕНО</h1>
            </div>
            <PaginationClassic
                v-if="COMPANIES_PAGINATION"
                @next="next"
                class="mt-3 my-3"
                :pagination="COMPANIES_PAGINATION"
            />
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { TableContentMixin } from '@/components/common/mixins.js';
import FormCompanyGroup from '@/components/Forms/Company/FormCompanyGroup.vue';
import FormCompany from '@/components/Forms/Company/FormCompany.vue';
import FormCompanySearch from '@/components/Forms/Company/FormCompanySearch.vue';
import Loader from '@/components/common/Loader.vue';
import CompanyTable from '@/components/Company/Table/CompanyTable.vue';
import PaginationClassic from '@/components/common/Pagination/PaginationClassic.vue';
import CompanyTableMobile from '@/components/Company/Table/CompanyTableMobile.vue';
import RefreshButton from '@/components/common/RefreshButton.vue';

export default {
    name: 'CompaniesMain',
    components: {
        RefreshButton,
        CompanyTableMobile,
        PaginationClassic,
        CompanyTable,
        Loader,
        FormCompanySearch,
        FormCompany,
        FormCompanyGroup
    },
    mixins: [TableContentMixin],
    inject: ['isMobile'],
    data() {
        return {
            companyFormVisible: false,
            viewMode: false,
            companyGroupsFormVisible: false
        };
    },
    methods: {
        ...mapActions(['FETCH_COMPANIES', 'SEARCH_COMPANIES']),
        async getContent() {
            await this.getCompanies();
        },
        async getCompanies() {
            this.loader = true;
            const query = this.$route.query;
            await this.SEARCH_COMPANIES({ query });
            this.loader = false;
        },

        clickCloseCompanyForm() {
            this.companyFormVisible = false;
        },
        createdCompany() {
            this.getContent();
        }
    },
    computed: {
        ...mapGetters(['COMPANIES', 'COMPANIES_PAGINATION', 'THIS_USER'])
    }
};
</script>

<style></style>