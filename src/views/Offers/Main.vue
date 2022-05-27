<template>
  <div class="all">
    <div class="row no-gutters search-main-container">
      <div class="container py-3">
        <div class="col-12 pt-3">
          <OfferSearchForm v-if="mounted" />
        </div>
      </div>
    </div>
    <hr />

    <div class="row no-gutters companies-actions">
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
export default {
  mixins: [TableContentMixin],
  name: "OffersMain",
  data() {
    return {
      companyFormVisible: false,
      viewMode: false,
      companyGroupsFormVisible: false,
    };
  },
  components: {
    OfferTableView,
    OfferSearchForm,
  },
  methods: {
    ...mapActions(["SEARCH_OFFERS"]),
    async getContent() {
      await this.getOffers();
    },
    async getOffers() {
      this.loader = true;
      const query = {
        ...this.$route.query,
        type_id: [2, 3],
        expand:
          "object,company.mainContact.phones,company.mainContact.emails,company.mainContact.phones,miniOffersMix,generalOffersMix.offer,consultant.userProfile",
      };
      await this.SEARCH_OFFERS({ query });
      this.loader = false;
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