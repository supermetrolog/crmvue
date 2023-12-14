<!--<template>-->
<!--&lt;!&ndash;  <div class="all">&ndash;&gt;-->
<!--&lt;!&ndash;    <div class="row no-gutters search-main-container">&ndash;&gt;-->
<!--&lt;!&ndash;      <div class="container py-3">&ndash;&gt;-->
<!--&lt;!&ndash;        <div class="col-12 pt-3">&ndash;&gt;-->
<!--&lt;!&ndash;          <OfferSearchForm v-if="mounted" />&ndash;&gt;-->
<!--&lt;!&ndash;        </div>&ndash;&gt;-->
<!--&lt;!&ndash;      </div>&ndash;&gt;-->
<!--&lt;!&ndash;    </div>&ndash;&gt;-->
<!--&lt;!&ndash;    <div class="row no-gutters map-container">&ndash;&gt;-->
<!--&lt;!&ndash;      <div class="map-loader" v-if="allOffersLoader"></div>&ndash;&gt;-->
<!--&lt;!&ndash;      <div class="col-12">&ndash;&gt;-->
<!--&lt;!&ndash;        &lt;!&ndash; <YmapOffersView&ndash;&gt;-->
<!--&lt;!&ndash;          :list="allOffersForYmap"&ndash;&gt;-->
<!--&lt;!&ndash;          @selectionDone="filterByPolygon"&ndash;&gt;-->
<!--&lt;!&ndash;        /> &ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;      </div>&ndash;&gt;-->
<!--&lt;!&ndash;    </div>&ndash;&gt;-->
<!--&lt;!&ndash;  </div>&ndash;&gt;-->
<!--</template>-->

<!--<script>-->
<!--import OfferSearchForm from "@/components/offers/forms/offer-form/FormOfferSearch.vue";-->
<!--import { mapGetters, mapActions } from "vuex";-->
<!--import { TableContentMixin } from "@/components/common/mixins.js";-->
<!--// import YmapOffersView from "@/components/offers/map/YmapOffersViewTest.vue";-->

<!--import api from "@/api/api";-->
<!--import { waitHash } from "../../../../crmvue/src/utils/index.js";-->
<!--export default {-->
<!--  mixins: [TableContentMixin],-->
<!--  name: "OffersMapTest",-->
<!--  data() {-->
<!--    return {-->
<!--      allOffersForYmap: [],-->
<!--      ymapOffersSearchHash: null,-->
<!--      allOffersLoader: false,-->
<!--    };-->
<!--  },-->
<!--  inject: ["isMobile"],-->
<!--  components: {-->
<!--    OfferSearchForm,-->
<!--    // YmapOffersView,-->
<!--  },-->
<!--  computed: {-->
<!--    ...mapGetters([-->
<!--      "OFFERS",-->
<!--      "OFFERS_PAGINATION",-->
<!--      "THIS_USER",-->
<!--      "FAVORITES_OFFERS",-->
<!--    ]),-->
<!--  },-->
<!--  methods: {-->
<!--    ...mapActions(["SEARCH_OFFERS", "SEARCH_FAVORITES_OFFERS"]),-->
<!--    filterByPolygon(coordinates) {-->
<!--      const query = { ...this.$route.query };-->
<!--      query.polygon = coordinates;-->
<!--      this.$router.replace({ query });-->
<!--    },-->
<!--    getContent(withLoader = true) {-->
<!--      this.getAllOffersForYmap(withLoader);-->
<!--    },-->
<!--    async getAllOffersForYmap(withLoader = true) {-->
<!--      const routeQuery = { ...this.$route.query };-->
<!--      delete routeQuery.page;-->
<!--      delete routeQuery.sort;-->
<!--      if (routeQuery.favorites) {-->
<!--        await this.SEARCH_FAVORITES_OFFERS();-->
<!--      }-->
<!--      const query = {-->
<!--        ...routeQuery,-->
<!--        type_id: [2, 3],-->
<!--        fields:-->
<!--          "latitude,longitude,address,complex_id,status,thumb,test_only,id",-->
<!--        objectsOnly: 1,-->
<!--        original_id: routeQuery.favorites-->
<!--          ? this.FAVORITES_OFFERS.map((item) => item.original_id)-->
<!--          : null,-->
<!--        page: 1,-->
<!--        noWith: 1,-->
<!--        "per-page": 0,-->
<!--      };-->
<!--      if (query.original_id == null) {-->
<!--        delete query.original_id;-->
<!--      }-->
<!--      const hash = waitHash(query);-->
<!--      if (hash == this.ymapOffersSearchHash) {-->
<!--        return;-->
<!--      }-->
<!--      if (routeQuery.favorites) {-->
<!--        if (!this.FAVORITES_OFFERS.length) {-->
<!--          await this.SEARCH_FAVORITES_OFFERS();-->
<!--        }-->
<!--        query.original_id = this.FAVORITES_OFFERS.map(-->
<!--          (item) => item.original_id-->
<!--        );-->
<!--        query.object_id = this.FAVORITES_OFFERS.map((item) => item.object_id);-->
<!--        query.complex_id = this.FAVORITES_OFFERS.map((item) => item.complex_id);-->
<!--      }-->
<!--      this.allOffersLoader = withLoader;-->

<!--      this.ymapOffersSearchHash = hash;-->
<!--      const data = await api.offers.search(query);-->
<!--      if (Array.isArray(data.data)) {-->
<!--        if (hash == this.ymapOffersSearchHash) {-->
<!--          this.allOffersForYmap = data.data;-->
<!--        } else {-->
<!--          return false;-->
<!--        }-->
<!--      }-->
<!--      this.allOffersLoader = false;-->
<!--      return data;-->
<!--    },-->
<!--    // Переопределено из миксина (судя по всему)-->
<!--    initialRouteSettings() {},-->
<!--    async deleteFavoriteOffer() {-->
<!--      if (this.$route.query.favorites) {-->
<!--        await this.SEARCH_FAVORITES_OFFERS();-->
<!--        this.getContent(false);-->
<!--      }-->
<!--    },-->
<!--  },-->
<!--};-->
<!--</script>-->

<!--<style>-->
<!--</style>-->