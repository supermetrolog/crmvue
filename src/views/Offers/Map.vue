<template>
    <section>
        <div class="container-fluid">
            <div ref="searchContainer" class="row">
                <teleport to="body">
                    <FormModalOfferSearch
                        v-if="mounted && searchFormModalVisible"
                        ref="search"
                        @close="searchFormModalVisible = false"
                    />
                </teleport>
                <FormOfferSearchExternal
                    v-if="mounted"
                    @openFilters="searchFormModalVisible = true"
                    class="col-12"
                    :offers-count="offersCount"
                    :objects-count="objectsCount"
                    :is-map="true"
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
            <div class="row">
                <div v-if="allOffersLoader" class="map-loader"></div>
                <div class="col-12">
                    <OfferYmap
                        @selectionDone="filterByPolygon"
                        @removedDone="removedPolygonFromFilters"
                        :list="allOffersForYmap"
                        :polygon-coordinates="polygonCoordinates"
                        :styles="ymapStyles"
                    />
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import { mapActions } from 'vuex';
import { TableContentMixin } from '@/components/common/mixins.js';
import api from '@/api/api';
import { waitHash } from '@/utils';
import FilterMixin from './mixins.js';
import FormModalOfferSearch from '@/components/Forms/Offer/FormModalOfferSearch.vue';
import FormOfferSearchExternal from '@/components/Forms/Offer/FormOfferSearchExternal.vue';
import OfferYmap from '@/components/Offer/OfferYmap.vue';
import Chip from '@/components/common/Chip.vue';

export default {
    name: 'OffersMap',
    components: {
        Chip,
        OfferYmap,
        FormOfferSearchExternal,
        FormModalOfferSearch
    },
    mixins: [TableContentMixin, FilterMixin],
    inject: ['isMobile'],
    data() {
        return {
            searchFormModalVisible: false,
            mounted: false,
            allOffersForYmap: [],
            ymapOffersSearchHash: null,
            allOffersLoader: false,
            objectsCount: null,
            offersCount: null,
            ymapStyles: {
                width: '100%',
                height: '100vh'
            }
        };
    },
    computed: {
        polygonCoordinates() {
            if (this.$route.query.polygon && Array.isArray(this.$route.query.polygon)) {
                return this.$route.query.polygon.map(coords => {
                    return coords.split(',');
                });
            }
            return [];
        }
    },
    methods: {
        ...mapActions(['SEARCH_OFFERS', 'SEARCH_FAVORITES_OFFERS']),
        async filterByPolygon(coordinates) {
            const query = { ...this.$route.query };
            query.polygon = coordinates;
            await this.$router.replace({ query });
            const search = this.$refs.search;

            if (search) {
                search.form.polygon = coordinates;
            }
        },
        removedPolygonFromFilters() {
            const query = { ...this.$route.query };
            if (query.polygon) {
                delete query.polygon;
                this.$router.replace({ query });
            }
            const search = this.$refs.search;

            if (search) {
                search.form.polygon = null;
            }
        },
        getContent(withLoader = true) {
            this.getAllOffersForYmap(withLoader);
        },
        async getAllOffersForYmap(withLoader = true) {
            const routeQuery = { ...this.$route.query };
            delete routeQuery.page;
            delete routeQuery.sort;
            if (routeQuery.favorites) {
                await this.SEARCH_FAVORITES_OFFERS();
            }
            const query = {
                ...routeQuery,
                type_id: [2, 3],
                fields: 'latitude,longitude,address,complex_id,status,thumb,test_only,id',
                objectsOnly: 1,
                original_id: routeQuery.favorites
                    ? this.FAVORITES_OFFERS.map(item => item.original_id)
                    : null,
                page: 1,
                noWith: 1,
                'per-page': 0
            };
            if (query.original_id == null) {
                delete query.original_id;
            }
            const hash = waitHash(query);
            if (hash === this.ymapOffersSearchHash) {
                return;
            }
            if (routeQuery.favorites) {
                if (!this.FAVORITES_OFFERS.length) {
                    await this.SEARCH_FAVORITES_OFFERS();
                }
                query.original_id = this.FAVORITES_OFFERS.map(item => item.original_id);
                query.object_id = this.FAVORITES_OFFERS.map(item => item.object_id);
                query.complex_id = this.FAVORITES_OFFERS.map(item => item.complex_id);
            }
            this.allOffersLoader = withLoader;

            this.ymapOffersSearchHash = hash;
            const data = await api.offers.searchMap(query);
            if (Array.isArray(data.data)) {
                delete query.objectsOnly;
                const offersCount = await api.offers.searchCount(query);
                if (hash === this.ymapOffersSearchHash) {
                    this.allOffersForYmap = data.data;
                    this.objectsCount = data.pagination.totalCount;
                    this.offersCount = +offersCount;
                } else {
                    return false;
                }
            }
            this.allOffersLoader = false;
            return data;
        },
        // Переопределено из миксина (судя по всему)
        initialRouteSettings() {},
        async deleteFavoriteOffer() {
            if (this.$route.query.favorites) {
                await this.SEARCH_FAVORITES_OFFERS();
                this.getContent(false);
            }
        },
        setYmapSize() {
            this.ymapStyles.height =
                window.innerHeight -
                this.$refs.searchContainer.getClientRects()[0].height -
                105 +
                'px';
        }
    },
    updated() {
        this.setYmapSize();
    },
    mounted() {
        this.setYmapSize();
    }
};
</script>
