<template>
    <section>
        <div class="container-fluid">
            <div class="row mb-4">
                <FormCompanyGroup
                    v-if="companyGroupsFormVisible"
                    @closeCompanyGroupsForm="companyGroupsFormVisible = false"
                />
                <FormCompany
                    v-if="companyFormVisible"
                    @closeCompanyForm="clickCloseCompanyForm"
                    @created="createdCompany"
                />
                <FormCompanySearch v-if="mounted" class="col-12" />
            </div>
            <div class="row justify-content-between">
                <PaginationClassic
                    v-if="COMPANIES_PAGINATION"
                    ref="firstPagination"
                    @next="next"
                    class="col-6"
                    :pagination="COMPANIES_PAGINATION"
                />
                <div class="company-table__actions col-6">
                    <Button @click="companyGroupsFormVisible = true" success :disabled="loader">Создать группу компаний</Button>
                    <Button @click="companyFormVisible = true" success :disabled="loader">Создать компанию</Button>
                    <RefreshButton @click="getCompanies" :disabled="loader" />
                </div>
            </div>
            <div class="row">
                <div class="col-12 offers-page__table">
                    <Loader v-if="loader && !COMPANIES.length" class="center" />
                    <CompanyTable v-if="COMPANIES.length && !isMobile" :companies="COMPANIES" :loader="loader" />
                    <CompanyTableMobile v-if="COMPANIES.length && isMobile" :companies="COMPANIES" :loader="loader" />
                    <h1 v-if="!COMPANIES.length && !loader" class="text-center text-dark py-5">НИЧЕГО НЕ НАЙДЕНО</h1>
                </div>
                <div class="col-12">
                    <PaginationClassic v-if="COMPANIES_PAGINATION" @next="next" :pagination="COMPANIES_PAGINATION" />
                </div>
            </div>
        </div>
    </section>
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
import Button from '@/components/common/Button.vue';

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
        FormCompanyGroup,
        Button
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
    computed: {
        ...mapGetters(['COMPANIES', 'COMPANIES_PAGINATION', 'THIS_USER'])
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
    }
};
</script>

<style></style>