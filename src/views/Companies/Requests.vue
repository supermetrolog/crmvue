<template>
    <section class="companies-requests">
        <div class="container-fluid">
            <div class="row mb-4">
                <FormCompanyRequestSearch class="col-8" />
            </div>
            <div class="row justify-content-between">
                <PaginationClassic
                    v-if="REQUESTS_PAGINATION"
                    @next="next"
                    class="col-6"
                    :pagination="REQUESTS_PAGINATION"
                />
                <div class="company-table__actions col-4">
                    <RefreshButton @click="getRequests" :disabled="loader" />
                </div>
            </div>
            <div class="row">
                <div class="col-12 offers-page__table">
                    <Loader v-if="loader && !REQUESTS.length" />
                    <CompanyRequestTable
                        v-if="!isMobile && REQUESTS.length"
                        :loader="loader"
                        :requests="REQUESTS"
                    />
                    <CompanyRequestTableMobile
                        v-if="isMobile && REQUESTS.length"
                        :loader="loader"
                        :requests="REQUESTS"
                    />
                    <h1 v-if="!REQUESTS.length && !loader" class="text-center text-dark py-5">НИЧЕГО НЕ НАЙДЕНО</h1>
                </div>
                <div class="col-12">
                    <PaginationClassic v-if="REQUESTS_PAGINATION" @next="next" :pagination="REQUESTS_PAGINATION" />
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { TableContentMixin } from '@/components/common/mixins.js';
import FormCompanyRequestSearch from '@/components/Forms/Company/FormCompanyRequestSearch.vue';
import PaginationClassic from '@/components/common/Pagination/PaginationClassic.vue';
import Loader from '@/components/common/Loader.vue';
import CompanyRequestTable from '@/components/Company/Request/CompanyRequestTable.vue';
import CompanyRequestTableMobile from '@/components/Company/Request/CompanyRequestTableMobile.vue';
import RefreshButton from '@/components/common/RefreshButton.vue';

export default {
    name: 'CompaniesRequests',
    components: {
        RefreshButton,
        CompanyRequestTableMobile,
        CompanyRequestTable,
        Loader,
        PaginationClassic,
        FormCompanyRequestSearch
    },
    mixins: [TableContentMixin],
    inject: ['isMobile'],
    computed: {
        ...mapGetters(['REQUESTS', 'REQUESTS_PAGINATION', 'THIS_USER'])
    },
    methods: {
        ...mapActions(['SEARCH_REQUESTS']),
        async getContent() {
            await this.getRequests();
        },
        async getRequests() {
            this.loader = true;
            const query = this.$route.query;
            await this.SEARCH_REQUESTS({ query });
            this.loader = false;
        }
    }
};
</script>

<style></style>
