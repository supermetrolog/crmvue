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
        <YmapView :list="allOffersForYmap" />
      </div>
    </div>
    <div class="row no-gutters companies-actions mt-4">
      <div class="col-6">
        <PaginationClassic
          :pagination="OFFERS_PAGINATION"
          @next="next"
          v-if="OFFERS_PAGINATION"
        />
      </div>
    </div>
    <div class="row no-gutters mt-2">
      <div class="col-12 companies-list-container">
        <Loader v-if="loader && !OFFERS.length" class="center" />
        <OfferTableView
          :offers="OFFERS"
          v-if="OFFERS.length"
          :loader="loader"
        />
        <h1 class="text-center text-dark py-5" v-if="!OFFERS.length && !loader">
          НИЧЕГО НЕ НАЙДЕНО
        </h1>
      </div>
      <PaginationClassic
        class="mt-3 my-3"
        :pagination="OFFERS_PAGINATION"
        @next="next"
        v-if="OFFERS_PAGINATION"
      />
    </div>
  </div>
</template>

<script>
import OfferTableView from "@/components/offers/main/OfferTableView.vue";
import OfferSearchForm from "@/components/offers/forms/offer-form/OfferSearchForm.vue";
import { mapGetters, mapActions } from "vuex";
import { TableContentMixin } from "@/components/common/mixins.js";
import YmapView from "@/components/common/YmapView.vue";

import api from "@/api/api";
import { waitHash } from "../../utils";
export default {
  mixins: [TableContentMixin],
  name: "OffersMain",
  data() {
    return {
      companyFormVisible: false,
      viewMode: false,
      companyGroupsFormVisible: false,
      allOffersForYmap: [],
      ymapOffersSearchHash: null,
      allOffersLoader: false,
    };
  },
  components: {
    OfferTableView,
    OfferSearchForm,
    YmapView,
  },
  methods: {
    ...mapActions(["SEARCH_OFFERS"]),
    async getContent() {
      this.getAllOffersForYmap();
      await this.getOffers();
    },
    async getOffers() {
      this.loader = true;
      const query = {
        ...this.$route.query,
        type_id: [2, 3],
        // type_id: [2],
        expand:
          "object,company.mainContact.phones,company.mainContact.emails,miniOffersMix,generalOffersMix.offer,consultant.userProfile",
      };
      await this.SEARCH_OFFERS({ query });
      this.loader = false;
    },
    async getAllOffersForYmap() {
      const routeQuery = { ...this.$route.query };
      delete routeQuery.page;
      const query = {
        ...routeQuery,
        type_id: [2],
        fields: "latitude,longitude,address,complex_id,status,thumb",
        objectsOnly: 1,
        page: 1,
        noWith: 1,
        "per-page": 0,
      };
      const hash = waitHash(query);
      console.log(hash, this.ymapOffersSearchHash);
      if (hash == this.ymapOffersSearchHash) {
        return;
      }
      this.allOffersLoader = true;

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
    initialRouteSettings() {},
    clickCloseCompanyForm() {
      this.companyFormVisible = false;
    },
  },
  computed: {
    ...mapGetters(["OFFERS", "OFFERS_PAGINATION", "THIS_USER"]),
  },
};
</script>

<style>
</style>