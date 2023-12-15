<template>
    <div class="companies-requests">
        <div class="row">
            <div class="container py-3">
                <div class="col-12 px-md-5 py-3">
                    <FormCompanyRequestSearch v-if="mounted" />
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-12">
                <PaginationClassic
                    v-if="REQUESTS_PAGINATION"
                    @next="next"
                    class="mt-3 my-3"
                    :pagination="REQUESTS_PAGINATION"
                />
            </div>
            <div class="col-12">
                <Loader v-if="loader && !REQUESTS.length" class="center" />
                <!--                <RequestTable-->
                <!--                    :loader="loader"-->
                <!--                    :requests="REQUESTS"-->
                <!--                    v-if="!this.isMobile"-->
                <!--                />-->
                <!--                <RequestTableMobile-->
                <!--                    :loader="loader"-->
                <!--                    :requests="REQUESTS"-->
                <!--                    v-if="this.isMobile"-->
                <!--                />-->
                <h1 v-if="!REQUESTS.length && !loader" class="text-center text-dark py-5">НИЧЕГО НЕ НАЙДЕНО</h1>
            </div>
            <div class="col-12">
                <PaginationClassic
                    v-if="REQUESTS_PAGINATION"
                    @next="next"
                    class="mt-3 my-3"
                    :pagination="REQUESTS_PAGINATION"
                />
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { TableContentMixin } from '@/components/common/mixins.js';
import FormCompanyRequestSearch from '@/components/Forms/Company/FormCompanyRequestSearch.vue';
import PaginationClassic from '@/components/common/Pagination/PaginationClassic.vue';
import Loader from '@/components/common/Loader.vue';

export default {
    name: 'CompaniesRequests',
    components: {
        Loader,
        PaginationClassic,
        FormCompanyRequestSearch
    },
    mixins: [TableContentMixin],
    inject: ['isMobile'],
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
    },
    computed: {
        ...mapGetters(['REQUESTS', 'REQUESTS_PAGINATION', 'THIS_USER'])
    }
};
</script>

<style></style>