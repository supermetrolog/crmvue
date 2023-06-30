<template>
  <div class="deal-detailed-info">
    <building-info
      class="deal-detailed-info__building-info"
      :area="area"
      :price="price"
      :parameters="parameters"
    />
    <trade-offer-tabs class="deal-detailed-info__trade-offer-tabs" />
  </div>
</template>

<script>
import BuildingInfo from "./building-info/BuildingInfo.vue";
import TradeOfferTabs from "@/components/complex/trade-offer-tabs/TradeOfferTabs.vue";

export default {
  name: "DealDetailedInfo",
  components: {
    BuildingInfo,
    TradeOfferTabs,
  },
  props: {
    area: {
      type: Object,
    },
    price: {
      type: Object,
    },
    parameters: {
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
