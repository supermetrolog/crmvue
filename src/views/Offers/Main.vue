<template>
  <div class="all">
    <div class="row no-gutters search-main-container">
      <div class="container py-3">
        <div class="col-12 pt-3">
          <OfferSearchForm v-if="mounted" />
        </div>
      </div>
    </div>
    <div class="row no-gutters companies-actions mt-4">
      <div class="col-md-6 col-12 pt-1">
        <PaginationClassic
          :pagination="OFFERS_PAGINATION"
          @next="next"
          v-if="OFFERS_PAGINATION"
          class="d-inline"
          ref="firstPagination"
        />
        <RefreshButton
          class="ml-3"
          @click="getOffers(true)"
          :disabled="loader"
        />
      </div>
    </div>
    <div class="row no-gutters mt-2">
      <div class="col-12 companies-list-container">
        <Loader v-if="loader && !OFFERS.length" class="center" />
        <OfferTableView
          :offers="OFFERS"
          v-if="OFFERS.length && !this.isMobile"
          :loader="loader"
          @deleteFavoriteOffer="deleteFavoriteOffer"
        />
        <OffersMobileView
          :offers="OFFERS"
          v-if="OFFERS.length && this.isMobile"
          :loader="loader"
          @deleteFavoriteOffer="deleteFavoriteOffer"
        />
        <h1 class="text-center text-dark py-5" v-if="!OFFERS.length && !loader">
          НИЧЕГО НЕ НАЙДЕНО
        </h1>
      </div>
      <PaginationClassic
        class="mt-3 my-3"
        :pagination="OFFERS_PAGINATION"
        @next="nextAndScrollToStart"
        v-if="OFFERS_PAGINATION"
      />
    </div>
  </div>
</template>

<script>
import OffersMobileView from "../../components/offers/mobile/OffersMobileView.vue";
import OfferTableView from "@/components/offers/main/OfferTableView.vue";
import OfferSearchForm from "@/components/offers/forms/offer-form/OfferSearchForm.vue";
import { mapGetters, mapActions } from "vuex";
import { TableContentMixin } from "@/components/common/mixins.js";
import RefreshButton from "@/components/common/RefreshButton.vue";

export default {
  mixins: [TableContentMixin],
  name: "OffersMain",
  inject: ["isMobile"],
  components: {
    OfferTableView,
    OfferSearchForm,
    RefreshButton,
    OffersMobileView,
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
        console.log("FUUUUCK", this.FAVORITES_OFFERS, !this.FAVORITES_OFFERS);

        query.original_id = this.FAVORITES_OFFERS.map(
          (item) => item.original_id
        );
        query.type_id = [1, 2];
        query.object_id = this.FAVORITES_OFFERS.map((item) => item.object_id);
        query.complex_id = this.FAVORITES_OFFERS.map((item) => item.complex_id);
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
        behavior: "smooth",
        block: "end",
        alignToTop: false,
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
  },
};
</script>

<style>
</style>