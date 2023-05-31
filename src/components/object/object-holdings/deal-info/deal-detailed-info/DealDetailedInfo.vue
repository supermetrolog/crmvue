<template>
  <div class="deal-deatailed-info">
    <building-info
      class="deal-detailed-info__building-info"
      :area="area"
      :price="price"
    />
    <trade-offer class="deal-detailed-info__trade-offer" />
  </div>
</template>

<script>
import BuildingInfo from "./building-info/BuildingInfo.vue";
import TradeOffer from "../../../trade-offer/TradeOffer.vue";

export default {
  name: "DealDetailedInfo",
  components: {
    BuildingInfo,
    TradeOffer,
  },
  props: {
    area: {
      type: Object,
    },
    price: {
      type: Object,
    },
  },
  data() {
    return {};
  },
  methods: {},
};
</script>

<style src="./DealDetailedInfo.scss" lang="scss"></style>
