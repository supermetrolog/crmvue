<template>
  <div class="trade-offer-details-table">
    <ul
      class="trade-offer-details-table__column trade-offer-details-table__column_head"
    >
      <li
        class="trade-offer-details-table__head trade-offer-details-table__head_color_grey"
      >
        Этажи
      </li>
      <li
        class="trade-offer-details-table__section trade-offer-details-table__section_label"
      >
        <p class="trade-offer-details-table__text">№ блока:</p>
      </li>
      <li
        v-for="parameter in Object.keys(tradeOfferCharacteristics)"
        :key="parameter"
        class="trade-offer-details-table__section trade-offer-details-table__section_label"
      >
        <p
          class="trade-offer-details-table__text trade-offer-details-table__text_weight_bold"
        >
          {{ parameterTypes[parameter] }}
        </p>
        <p
          v-for="subparameter in Object.keys(
            tradeOfferCharacteristics[parameter]
          )"
          :key="subparameter"
          class="trade-offer-details-table__text"
        >
          {{ tradeOfferCharacteristics[parameter][subparameter].name }}
          <span
            v-if="tradeOfferCharacteristics[parameter][subparameter].required"
            class="trade-offer-details-table__text trade-offer-details-table__text_color_red"
            >*</span
          >
        </p>
      </li>
    </ul>
    <div class="trade-offer-details-table__content">
      <ul
        v-for="(block, idx) in blocks"
        :key="block.number"
        class="trade-offer-details-table__column"
      >
        <li
          class="trade-offer-details-table__head"
          :class="
            'trade-offer-details-table__head_color_' + tableHeadColors[idx]
          "
        >
          {{ block.title }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { ITradeOfferBlock } from "../trade-offer-tabs/tradeOfferTabs.interface";
import { PropType, defineComponent } from "vue";
import { tradeOfferCharacteristics } from "@/const/tradeOfferCharacteristics";
import { parameterTypes } from "@/const/parameterTypes";

const tableHeadColors = ["green", "blue", "cyan", "orange", "red"];

export default defineComponent({
  name: "TradeOfferDetailsTable",
  components: {},
  props: {
    blocks: {
      type: Object as PropType<ITradeOfferBlock[]>,
      requrired: true,
    },
  },
  data() {
    return {
      tableHeadColors,
      tradeOfferCharacteristics,
      parameterTypes,
    };
  },
});
</script>

<style lang="scss" src="./TradeOfferDetailsTable.scss" />
