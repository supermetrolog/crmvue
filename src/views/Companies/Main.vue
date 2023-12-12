<template>
    <div class="all">
        <transition
            mode="out-in"
            enter-active-class="animate__animated animate__zoomIn for__modal absolute"
            leave-active-class="animate__animated animate__zoomOut for__modal absolute"
        >
            <FormCompanyGroup
                @closeCompanyGroupsForm="companyGroupsFormVisible = false"
                v-if="companyGroupsFormVisible"
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
                    <FormCompanySearch v-if="mounted"/>
                </div>
            </div>
        </div>
        <hr/>

        <div class="row no-gutters companies-actions">
            <div class="col-md-6">
                <PaginationClassic
                    :pagination="COMPANIES_PAGINATION"
                    @next="next"
                    v-if="COMPANIES_PAGINATION"
                    class="d-inline"
                />
                <RefreshButton
                    class="ml-md-3 ml-2"
                    @click="getCompanies"
                    :disabled="loader"
                />
            </div>
            <div class="col-md-6 text-right ml-auto">
                <button
                    class="btn btn-primary mr-md-2 ml-md-5"
                    @click="companyGroupsFormVisible = true"
                >
                    Создать группу компаний
                </button>
                <button class="btn btn-primary" @click="companyFormVisible = true">
                    Создать компанию
                </button>
            </div>
        </div>
        <div class="row no-gutters mt-2">
            <div class="col-12 companies-list-container">
                <Loader v-if="loader && !COMPANIES.length" class="center"/>
                <CompanyTable
                    :companies="COMPANIES"
                    v-if="COMPANIES.length && !this.isMobile"
                    :loader="loader"
                />
                <CompanyTableMobile
                    :companies="COMPANIES"
                    v-if="COMPANIES.length && this.isMobile"
                    :loader="loader"
                />
                <h1
                    class="text-center text-dark py-5"
                    v-if="!COMPANIES.length && !loader"
                >
                    НИЧЕГО НЕ НАЙДЕНО
                </h1>
            </div>
            <PaginationClassic
                class="mt-3 my-3"
                :pagination="COMPANIES_PAGINATION"
                @next="next"
                v-if="COMPANIES_PAGINATION"
            />
        </div>
    </div>
</template>

<script>
import {mapGetters, mapActions} from "vuex";
import {TableContentMixin} from "@/components/common/mixins.js";
import FormCompanyGroup from "@/components/forms/templates/Company/FormCompanyGroup.vue";
import FormCompany from "@/components/forms/templates/Company/FormCompany.vue";
import FormCompanySearch from "@/components/forms/templates/Company/FormCompanySearch.vue";
import Loader from "@/components/common/Loader.vue";
import CompanyTable from "@/components/Company/Table/CompanyTable.vue";
import PaginationClassic from "@/components/Pagination/PaginationClassic.vue";
import CompanyTableMobile from "@/components/Company/Table/CompanyTableMobile.vue";
import RefreshButton from "@/components/common/RefreshButton.vue";

export default {
    mixins: [TableContentMixin],
    name: "CompaniesMain",
    data() {
        return {
            companyFormVisible: false,
            viewMode: false,
            companyGroupsFormVisible: false,
        };
    },
    inject: ["isMobile"],
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
    methods: {
        ...mapActions(["FETCH_COMPANIES", "SEARCH_COMPANIES"]),
        async getContent() {
            await this.getCompanies();
        },
        async getCompanies() {
            this.loader = true;
            const query = this.$route.query;
            await this.SEARCH_COMPANIES({query});
            this.loader = false;
        },

        clickCloseCompanyForm() {
            this.companyFormVisible = false;
        },
        createdCompany() {
            this.getContent();
        },
    },
    computed: {
        ...mapGetters(["COMPANIES", "COMPANIES_PAGINATION", "THIS_USER"]),
    },
};
</script>

<style>
</style>