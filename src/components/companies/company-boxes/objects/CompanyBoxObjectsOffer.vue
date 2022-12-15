<template>
  <div
    class="CompanyBoxObjectsOffer"
    :class="{ passive: offer.status != 1 }"
    :title="offer.description || 'нет описания'"
  >
    <a class="CompanyBoxObjectsOffer-wrapper" :href="offerUrl" target="_blank">
      <div class="CompanyBoxObjectsOffer-block">
        <span class="CompanyBoxObjectsOffer-visual_id">{{
          offer.visual_id
        }}</span>
        <span>{{ offer.deal_type_name }}</span>
      </div>
      <div class="CompanyBoxObjectsOffer-block">
        <b>
          {{ offer.calc_area_general }}
          м<sup>2</sup>
        </b>
        <b v-if="offer.deal_type == 1 || offer.deal_type == 4">
          {{ offer.calc_price_warehouse }}
          руб за м<sup>2</sup>/г
        </b>
        <span v-if="offer.deal_type == 2">
          <b> {{ offer.calc_price_sale }} руб за м<sup>2</sup> </b>
        </span>
        <span v-if="offer.deal_type == 3">
          <b>{{ offer.calc_price_safe_pallet }} руб за 1 п. м. </b>
        </span>
      </div>
    </a>
  </div>
</template>

<script>
export default {
  name: "CompanyBoxObjectsOffer",
  props: {
    offer: {
      type: Object,
    },
  },
  computed: {
    offerUrl() {
      const baseUrl = "https://pennylane.pro/complex/";
      let url = baseUrl + this.offer.complex_id;
      if (this.offer.type_id == 3) {
        return url;
      }
      if (this.offer.generalOffersMix) {
        url += "?offer_id=[" + this.offer.generalOffersMix.original_id + "]";
      } else {
        url += "?offer_id=[" + this.offer.original_id + "]";
      }
      return url;
    },
  },
};
</script>

<style>
</style>