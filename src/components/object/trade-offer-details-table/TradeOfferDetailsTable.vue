<template>
  <div class="trade-offer-details-table">Details</div>
</template>

<script lang="ts">
import { ITradeOfferCharacteristics } from "@/const/tradeOfferCharacteristics";
import { PropType, defineComponent } from "vue";

export default defineComponent({
  name: "TradeOfferDetailsTable",
  components: {},
  props: {
    parameters: {
      type: Object as PropType<ITradeOfferCharacteristics>,
      requrired: true,
    },
  },
});
</script>

<style lang="scss" src="./TradeOfferDetailsTable.scss" />
