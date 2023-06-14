<template>
  <div class="trade-offer-details-table">Details</div>
</template>

<script lang="ts">
import { ITradeOfferBlock } from "../trade-offer-tabs/tradeOfferTabs.interface";
import { PropType, defineComponent } from "vue";

export default defineComponent({
  name: "TradeOfferDetailsTable",
  components: {},
  props: {
    blocks: {
      type: Object as PropType<ITradeOfferBlock>,
      requrired: true,
    },
  },
});
</script>

<style lang="scss" src="./TradeOfferDetailsTable.scss" />
