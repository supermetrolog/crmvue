<template>
  <div class="all">
    <!-- <div class="row no-gutters search-main-container">
      <div class="container py-3">
        <div class="col-12 pt-3">
          <OfferSearchForm v-if="mounted" />
        </div>
      </div>
    </div> -->
    <div class="row no-gutters companies-actions mt-4">
      <div class="col-md-6 col-12 pt-1">
        <PaginationClassic
          :pagination="LETTERS_PAGINATION"
          @next="next"
          v-if="LETTERS_PAGINATION"
          class="d-inline"
        />
        <RefreshButton class="ml-3" @click="getLetters" :disabled="loader" />
      </div>
    </div>
    <div class="row no-gutters mt-2">
      <div class="col-12 companies-list-container">
        <Loader v-if="loader && !LETTERS.length" class="center" />
        <LettersTableView
          :letters="LETTERS"
          v-if="LETTERS.length && !this.isMobile"
          :loader="loader"
        />
        <!-- <OffersMobileView
          :offers="OFFERS"
          v-if="OFFERS.length && this.isMobile"
          :loader="loader"
          @deleteFavoriteOffer="deleteFavoriteOffer"
        /> -->
        <h1
          class="text-center text-dark py-5"
          v-if="!LETTERS.length && !loader"
        >
          НИЧЕГО НЕ НАЙДЕНО
        </h1>
      </div>
      <PaginationClassic
        class="mt-3 my-3"
        :pagination="LETTERS_PAGINATION"
        @next="next"
        v-if="LETTERS_PAGINATION"
      />
    </div>
  </div>
</template>

<script>
import LettersTableView from "../../components/letters/main/LettersTableView.vue";
import { mapGetters, mapActions } from "vuex";
import { TableContentMixin } from "@/components/common/mixins.js";
import RefreshButton from "@/components/common/RefreshButton.vue";

export default {
  mixins: [TableContentMixin],
  name: "LettersMain",
  data() {
    return {};
  },
  inject: ["isMobile"],
  components: {
    RefreshButton,
    LettersTableView,
  },
  computed: {
    ...mapGetters(["LETTERS", "LETTERS_PAGINATION", "THIS_USER", "USERS"]),
  },
  methods: {
    ...mapActions(["SEARCH_LETTERS", "FETCH_USERS"]),
    async getContent(withLoader = true) {
      await this.FETCH_USERS();
      await this.getLetters(withLoader);
    },
    async getLetters(withLoader = true) {
      this.loader = withLoader;

      const query = {
        ...this.$route.query,
        expand:
          "users.userProfile,letterContacts,letterEmails,letterPhones,letterWays,letterOffers",
      };
      await this.SEARCH_LETTERS(query);
      this.loader = false;
    },
  },
};
</script>
