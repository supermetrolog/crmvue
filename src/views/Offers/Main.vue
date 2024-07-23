<template>
    <section>
        <div class="container-fluid">
            <div class="row">
                <FormComplex
                    v-if="complexFormModalVisible"
                    @close="toggleComplexFormModalVisible"
                />
                <FormModalOfferSearch
                    v-if="searchFormModalVisible"
                    @close="toggleSearchFormModalVisible"
                />
                <FormOfferSearchExternal
                    @openFilters="toggleSearchFormModalVisible"
                    class="col-12"
                    :offers-count="OFFERS_PAGINATION ? OFFERS_PAGINATION.totalCount : 0"
                    :objects-count="OFFERS_PAGINATION ? OFFERS_PAGINATION.totalCount : 0"
                />
                <div class="col-12 my-2">
                    <div class="company-table__filters">
                        <Chip
                            v-for="(item, index) in selectedFilterList"
                            :key="index"
                            @click="removeFilter"
                            :value="item.value"
                            :html="item.label"
                        />
                    </div>
                </div>
            </div>
            <div class="row justify-content-between">
                <PaginationClassic
                    v-if="OFFERS_PAGINATION"
                    ref="firstPagination"
                    @next="next"
                    class="col-12 col-md-6"
                    :pagination="OFFERS_PAGINATION"
                />
                <div class="company-table__actions col-12 col-md-4">
                    <Switch
                        v-if="!isMobile"
                        v-model="isCardView"
                        false-title="Таблица"
                        true-title="Карточки"
                    />
                    <Button @click="toggleComplexFormModalVisible" success :disabled="loader">
                        Создать комплекс
                    </Button>
                    <RefreshButton @click="getOffers(true)" :disabled="loader" />
                </div>
            </div>
            <div class="row">
                <div class="col-12 offers-page__table">
                    <AnimationTransition :speed="0.2">
                        <component
                            :is="currentViewComponentName"
                            v-if="OFFERS.length"
                            @favorite-deleted="deleteFavoriteOffer"
                            :offers="OFFERS"
                            :loader="loader"
                        />
                        <template v-else>
                            <Loader v-if="loader" />
                            <EmptyData v-else>Ничего не найдено</EmptyData>
                        </template>
                    </AnimationTransition>
                </div>
                <div class="col-12">
                    <PaginationClassic
                        v-if="OFFERS_PAGINATION"
                        @next="nextAndScrollToStart"
                        :pagination="OFFERS_PAGINATION"
                    />
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { TableContentMixin } from '@/components/common/mixins.js';
import RefreshButton from '@/components/common/RefreshButton.vue';
import FilterMixin from './mixins.js';
import FormModalOfferSearch from '@/components/Forms/Offer/FormModalOfferSearch.vue';
import FormOfferSearchExternal from '@/components/Forms/Offer/FormOfferSearchExternal.vue';
import PaginationClassic from '@/components/common/Pagination/PaginationClassic.vue';
import Loader from '@/components/common/Loader.vue';
import OfferTableMobile from '@/components/Offer/OfferTableMobile.vue';
import OfferTable from '@/components/Offer/OfferTable.vue';
import Chip from '@/components/common/Chip.vue';
import FormComplex from '@/components/Forms/Complex/FormComplex.vue';
import Button from '@/components/common/Button.vue';
import EmptyData from '@/components/common/EmptyData.vue';
import Switch from '@/components/common/Forms/Switch.vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';

export default {
    name: 'OffersMain',
    components: {
        AnimationTransition,
        Switch,
        EmptyData,
        Button,
        FormComplex,
        Chip,
        OfferTable,
        OfferTableMobile,
        Loader,
        PaginationClassic,
        FormOfferSearchExternal,
        FormModalOfferSearch,
        RefreshButton
    },
    mixins: [TableContentMixin, FilterMixin],
    inject: ['isMobile'],
    data() {
        return {
            complexFormModalVisible: false,
            isCardView: false
        };
    },
    computed: {
        ...mapGetters(['OFFERS_PAGINATION', 'OFFERS']),
        currentViewComponentName() {
            if (this.isMobile) return 'OfferTableMobile';
            return this.isCardView ? 'OfferTableMobile' : 'OfferTable';
        }
    },
    methods: {
        ...mapActions(['SEARCH_OFFERS', 'SEARCH_FAVORITES_OFFERS']),
        async getContent(withLoader = true) {
            await this.getOffers(withLoader);
        },
        async getOffers(withLoader = true) {
            this.loader = withLoader;

            const query = {
                ...this.$route.query,
                type_id: [2, 3],
                // type_id: [2],
                expand: 'contact.emails,contact.phones,object,company.mainContact.phones,company.mainContact.emails,offer,consultant.userProfile'
            };
            if (!this.FAVORITES_OFFERS.length) {
                await this.SEARCH_FAVORITES_OFFERS();
            }
            if (this.$route.query.favorites) {
                query.original_id = this.FAVORITES_OFFERS.map(item => item.original_id);
                query.type_id = [1, 2];
                query.object_id = this.FAVORITES_OFFERS.map(item => item.object_id);
                query.complex_id = this.FAVORITES_OFFERS.map(item => item.complex_id);
            }
            await this.SEARCH_OFFERS({ query });
            this.loader = false;
        },
        nextAndScrollToStart(page) {
            this.next(page);
            this.scrollToStart();
        },
        scrollToStart() {
            let options = {
                behavior: 'smooth',
                block: 'end',
                alignToTop: false
            };
            this.$refs.firstPagination.$el.scrollIntoView(options);
        },
        // Переопределено из миксина (судя по всему)
        initialRouteSettings() {},
        async deleteFavoriteOffer() {
            if (this.$route.query.favorites) {
                await this.SEARCH_FAVORITES_OFFERS();
                this.getContent(false);
            }
        },
        toggleComplexFormModalVisible() {
            this.complexFormModalVisible = !this.complexFormModalVisible;
        }
    }
};
</script>
