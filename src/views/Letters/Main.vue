<template>
  <div class="all">
    <!-- <div class="row no-gutters search-main-container">
      <div class="container py-3">
        <div class="col-12 pt-3">
          <OfferSearchForm v-if="mounted" />
        </div>
      </div>
    </div> -->
    <div class="row no-gutters companies-actions mt-4"></div>
    <div class="row no-gutters mt-2">
      <div class="col-12 Letters-container">
        <Loader v-if="loader && !LETTERS.length" class="center" />
        <LettersList
          :letters="LETTERS"
          v-if="LETTERS.length && !this.isMobile"
          :loader="loader"
          :selectedLetterId="SELECTED_LETTER_ID"
          @letterClicked="letterSelected"
        />
        <LetterView
          v-if="selectedLetter"
          :letter="selectedLetter"
          :offers="selectedLetter.letterOffers"
          :emails="selectedLetterEmails"
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
      <RefreshButton class="ml-3" @click="getLetters" :disabled="loader" />
    </div>
  </div>
</template>

<script>
import LetterView from "../../components/letters/letter-view/LetterView.vue";
import LettersList from "../../components/letters/main/LettersList.vue";
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
    LettersList,
    LetterView,
  },
  computed: {
    ...mapGetters([
      "LETTERS",
      "LETTERS_PAGINATION",
      "THIS_USER",
      "USERS",
      "SELECTED_LETTER_ID",
    ]),
    selectedLetter() {
      return this.LETTERS.find(
        (letter) => letter.id === this.SELECTED_LETTER_ID
      );
    },
    selectedLetterEmails() {
      return this.selectedLetter.letterEmails.map((email) => email.email.email);
    },
  },
  methods: {
    ...mapActions(["SEARCH_LETTERS", "FETCH_USERS", "SELECT_LETTER"]),
    async getContent(withLoader = true) {
      await this.FETCH_USERS();
      await this.getLetters(withLoader);
    },
    async getLetters(withLoader = true) {
      this.loader = withLoader;

      const query = {
        ...this.$route.query,
        expand:
          "letterContacts.email,letterEmails.email,letterPhones.phone,letterOffers.offer,letterContacts.phone,user.userProfile,letterWays",
      };
      await this.SEARCH_LETTERS(query);
      this.loader = false;
    },

    letterSelected(id) {
      this.SELECT_LETTER(id);
    },
  },
};
</script>
