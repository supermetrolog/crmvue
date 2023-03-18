<template>
  <div class="all">
    <div class="row no-gutters search-main-container">
      <div class="container py-3">
        <div class="col-12 pt-3">
          <OfferSearchForm v-if="mounted" />
        </div>
      </div>
    </div>
    <div class="row no-gutters map-container">
      <div class="map-loader" v-if="allOffersLoader"></div>
      <div class="col-12">
        <YmapOffersView
          :list="allOffersForYmap"
          @selectionDone="filterByPolygon"
        />
      </div>
    </div>
  </div>
</template>

<script>
import OfferSearchForm from "@/components/offers/forms/offer-form/OfferSearchForm.vue";
import { mapGetters, mapActions } from "vuex";
import { TableContentMixin } from "@/components/common/mixins.js";
import YmapOffersView from "@/components/offers/map/YmapOffersView.vue";

import api from "@/api/api";
import { waitHash } from "../../utils";
export default {
  mixins: [TableContentMixin],
  name: "OffersMain",
  data() {
    return {
      allOffersForYmap: [],
      ymapOffersSearchHash: null,
      allOffersLoader: false,
    };
  },
  inject: ["isMobile"],
  components: {
    OfferSearchForm,
    YmapOffersView,
  },
  computed: {
    ...mapGetters([
      "OFFERS",
      "OFFERS_PAGINATION",
      "THIS_USER",
      "FAVORITES_OFFERS",
    ]),
  },
  methods: {
    ...mapActions(["SEARCH_OFFERS", "SEARCH_FAVORITES_OFFERS"]),
    filterByPolygon(coordinates) {
      console.log(coordinates);
      const query = { ...this.$route.query };
      query.polygon = coordinates;
      this.$router.replace({ query });
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
        fields: "latitude,longitude,address,complex_id,status,thumb,test_only",
        objectsOnly: 1,
        original_id: routeQuery.favorites
          ? this.FAVORITES_OFFERS.map((item) => item.original_id)
          : null,
        page: 1,
        noWith: 1,
        "per-page": 0,
      };
      if (query.original_id == null) {
        delete query.original_id;
      }
      const hash = waitHash(query);
      console.log(hash, this.ymapOffersSearchHash);
      if (hash == this.ymapOffersSearchHash) {
        return;
      }
      if (routeQuery.favorites) {
        if (!this.FAVORITES_OFFERS.length) {
          await this.SEARCH_FAVORITES_OFFERS();
        }
        query.original_id = this.FAVORITES_OFFERS.map(
          (item) => item.original_id
        );
        query.object_id = this.FAVORITES_OFFERS.map((item) => item.object_id);
        query.complex_id = this.FAVORITES_OFFERS.map((item) => item.complex_id);
      }
      this.allOffersLoader = withLoader;

      console.log(hash, this.ymapOffersSearchHash);
      this.ymapOffersSearchHash = hash;
      const data = await api.offers.search(query);
      console.error(Array.isArray(data.data));
      if (Array.isArray(data.data)) {
        console.warn(hash, this.ymapOffersSearchHash);
        if (hash == this.ymapOffersSearchHash) {
          this.allOffersForYmap = data.data;
        } else {
          return false;
        }
      }
      this.allOffersLoader = false;
      console.error(data);
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
  },
};
</script>

<style>
</style>