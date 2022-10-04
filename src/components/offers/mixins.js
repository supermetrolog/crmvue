import { mapGetters, mapActions } from "vuex";
export const MixinOfferItem = {
  computed: {
    ...mapGetters(["FAVORITES_OFFERS", "THIS_USER"]),
  },
  methods: {
    ...mapActions([
      "ADD_FAVORITES_OFFER",
      "DELETE_FAVORITES_OFFERS",
      "SEARCH_FAVORITES_OFFERS",
    ]),
    getOfferUrl(offer) {
      const baseUrl = "https://pennylane.pro/complex/";
      let url = baseUrl + offer.complex_id;
      if (offer.type_id == 3) {
        return url;
      }
      if (offer.generalOffersMix) {
        url += "?offer_id=[" + offer.generalOffersMix.original_id + "]";
      } else {
        url += "?offer_id=[" + offer.original_id + "]";
      }
      return url;
    },
    async clickFavoriteOffer(offer) {
      if (
        !this.FAVORITES_OFFERS.find(
          (item) => item.original_id == offer.original_id
        )
      ) {
        return this.ADD_FAVORITES_OFFER(offer);
      }
      await this.DELETE_FAVORITES_OFFERS(offer);
      this.$emit("deleteFavoriteOffer", offer);
    },
    clickViewPdf(offer) {
      let url =
        this.$apiUrlHelper.url() +
        `pdf/presentations?type_id=${offer.type_id}&original_id=${offer.original_id}&object_id=${offer.object_id}&consultant=${this.THIS_USER.userProfile.medium_name}`;
      console.error(url);
      window.open(url, "_blank");
    },
  },
};
