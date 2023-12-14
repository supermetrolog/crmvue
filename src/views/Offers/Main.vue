<template>
    <section>
        <div class="container-fluid">
            <div class="row">
                <FormModalOfferSearch
                    v-if="searchFormModalVisible"
                    ref="search"
                    @close="toggleSearchFormModalVisible"
                />
                <FormOfferSearchExternal
                    class="col-12"
                    :offersCount="OFFERS_PAGINATION ? OFFERS_PAGINATION.totalCount : 0"
                    :objectsCount="OFFERS_PAGINATION ? OFFERS_PAGINATION.totalCount : 0"
                    @openFilters="toggleSearchFormModalVisible"
                />
                <div class="col-12 my-2">
                    <div class="company-table__filters">
                        <Chip
                            v-for="(item, index) in selectedFilterList"
                            :key="index"
                            :value="item.value"
                            :html="item.label"
                            @click="removeFilter"
                        />
                    </div>
                </div>
            </div>
            <div class="row justify-content-between">
                <PaginationClassic
                    class="col-6"
                    :pagination="OFFERS_PAGINATION"
                    @next="next"
                    v-if="OFFERS_PAGINATION"
                    ref="firstPagination"
                />
                <div class="company-table__actions col-4">
                    <RefreshButton
                        @click="getOffers(true)"
                        :disabled="loader"
                    />
                </div>
            </div>
            <div class="row">
                <div class="col-12 offers-page__table">
                    <Loader v-if="loader && !OFFERS.length" class="center"/>
                    <OfferTable
                        :offers="OFFERS"
                        v-if="OFFERS.length && !this.isMobile"
                        :loader="loader"
                        @deleteFavoriteOffer="deleteFavoriteOffer"
                    />
                    <OfferTableMobile
                        :offers="OFFERS"
                        v-if="OFFERS.length && this.isMobile"
                        :loader="loader"
                        @deleteFavoriteOffer="deleteFavoriteOffer"
                    />
                    <h1 class="text-center text-dark py-5" v-if="!OFFERS.length && !loader">
                        НИЧЕГО НЕ НАЙДЕНО
                    </h1>
                </div>
                <div class="col-12">
                    <PaginationClassic
                        :pagination="OFFERS_PAGINATION"
                        @next="nextAndScrollToStart"
                        v-if="OFFERS_PAGINATION"
                    />
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import {TableContentMixin} from "@/components/common/mixins.js";
import RefreshButton from "@/components/common/RefreshButton.vue";
import FilterMixin from "./mixins.js";
import FormModalOfferSearch from "@/components/Forms/Offer/FormModalOfferSearch.vue";
import FormOfferSearchExternal from "@/components/Forms/Offer/FormOfferSearchExternal.vue";
import PaginationClassic from "@/components/common/Pagination/PaginationClassic.vue";
import Loader from "@/components/common/Loader.vue";
import OfferTableMobile from "@/components/Offer/OfferTableMobile.vue";
import OfferTable from "@/components/Offer/OfferTable.vue";
import Chip from "@/components/common/Chip.vue";

export default {
    mixins: [TableContentMixin, FilterMixin],
    name: "OffersMain",
    inject: ["isMobile"],
    components: {
        Chip,
        OfferTable,
        OfferTableMobile,
        Loader,
        PaginationClassic,
        FormOfferSearchExternal,
        FormModalOfferSearch,
        RefreshButton,
    },
    computed: {
        ...mapGetters(["OFFERS_PAGINATION", "OFFERS"])
    },
    methods: {
        ...mapActions(["SEARCH_OFFERS", "SEARCH_FAVORITES_OFFERS"]),
        async getContent(withLoader = true) {
            await this.getOffers(withLoader);
        },
        async getOffers(withLoader = true) {
            this.loader = withLoader;

            const query = {
                ...this.$route.query,
                type_id: [2, 3],
                // type_id: [2],
                expand:
                    "contact.emails,contact.phones,object,company.mainContact.phones,company.mainContact.emails,offer,consultant.userProfile",
            };
            if (!this.FAVORITES_OFFERS.length) {
                await this.SEARCH_FAVORITES_OFFERS();
            }
            if (this.$route.query.favorites) {

                query.original_id = this.FAVORITES_OFFERS.map(
                    (item) => item.original_id
                );
                query.type_id = [1, 2];
                query.object_id = this.FAVORITES_OFFERS.map((item) => item.object_id);
                query.complex_id = this.FAVORITES_OFFERS.map((item) => item.complex_id);
            }
            await this.SEARCH_OFFERS({query});
            this.loader = false;
        },

        nextAndScrollToStart(page) {
            this.next(page);
            this.scrollToStart();
        },
        scrollToStart() {
            let options = {
                behavior: "smooth",
                block: "end",
                alignToTop: false,
            };
            this.$refs.firstPagination.$el.scrollIntoView(options);
        },
        // Переопределено из миксина (судя по всему)
        initialRouteSettings() {
        },
        async deleteFavoriteOffer() {
            if (this.$route.query.favorites) {
                await this.SEARCH_FAVORITES_OFFERS();
                this.getContent(false);
            }
        },
    },
};
</script>

<style>
</style>