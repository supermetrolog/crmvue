<template>
  <div
    class="object-offer col-12"
    :class="{ passive: offer.status != 1 }"
    :title="offer.description || 'нет описания'"
  >
    <div class="row no-gutters px-2 object-offer-inf">
      <div class="col-12 text-left">
        <a :href="offerUrl" target="_blank">
          <span class="object-offer__visual_id">{{ offer.visual_id }}</span>
          <span>{{ offer.deal_type_name }}</span>
          <span>
            {{ offer.calc_area_general }}
            м<sup>2</sup>
          </span>
          <span v-if="offer.deal_type == 1 || offer.deal_type == 4">
            {{ offer.calc_price_warehouse }}
            руб за м<sup>2</sup>/г
          </span>
          <span v-if="offer.deal_type == 2">
            {{ offer.calc_price_sale }} руб за м<sup>2</sup>
          </span>
          <span v-if="offer.deal_type == 3">
            {{ offer.calc_price_safe_pallet }} руб за 1 п. м.
          </span>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CompanyObjectItemOffer",
  props: {
    offer: {
      type: Object,
    },
  },
  computed: {
    offerUrl() {
      const baseUrl = "https://pennylane.pro/complex/";
      let url = baseUrl + this.offer.complex_id;
      return url + "?offer_id=[" + this.offer.original_id + "]";
    },
  },
};
</script>

<style>
</style>