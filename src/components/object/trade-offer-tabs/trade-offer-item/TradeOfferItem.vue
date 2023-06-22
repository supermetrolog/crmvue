<template>
  <div class="trade-offer-item">
    <div class="trade-offer-item__line">
      <div class="trade-offer-item__tables">
        <trade-offer-table
          subtitle="S - складская"
          :title="areaTableTitle"
          :titleUnitType="unitTypes.SQUARE_METERS"
          :propertyList="area.properties"
          :propertyUnitType="unitTypes.SQUARE_METERS"
          type="area"
          class="trade-offer-item__table"
        />
        <trade-offer-table
          subtitle="E - пола средняя"
          :title="priceTableTitle"
          :titleUnitType="unitTypes.RUB"
          :propertyList="price.properties"
          :propertyUnitType="unitTypes.RUB_PER_SQUARE_METERS_PER_YEAR"
          type="price"
          class="trade-offer-item__table"
        />
      </div>
      <div class="trade-offer-item__info">
        <p class="trade-offer-item__text">
          ID {{ id }},
          <span
            class="trade-offer-item__text_color_grey"
            title="последнее обновление"
          >
            <i class="fas fa-undo-alt" />
            {{ formattedLastUpdate }}
          </span>
        </p>
        <trade-offer-status class="trade-offer-item__status" :status="status" />
      </div>
    </div>
    <div class="trade-offer-item__line">
      <parameters
        :height="parameters.summary.parameters.characteristics.height"
        :floorType="parameters.summary.parameters.characteristics.floorType"
        :gatesNumber="parameters.summary.parameters.characteristics.gatesNumber"
        :electricity="parameters.summary.parameters.communications.electricity"
        :heating="parameters.summary.parameters.communications.heating"
        :sewage="parameters.summary.parameters.communications.sewage"
        :gasForProduction="
          parameters.summary.parameters.communications.gasForProduction
        "
        :liftingDevices="parameters.summary.parameters.liftingDevices.lifts"
        :shelving="parameters.summary.parameters.facilities.shelving"
      />
    </div>
    <div class="trade-offer-item__line">
      <offer-tabs :parameters="parameters" class="trade-offer-item__tabs" />
      <action-buttons
        v-bind="actionButtons"
        class="trade-offer-item__buttons"
      />
    </div>
  </div>
</template>

<script lang="ts">
import TradeOfferTable from "../trade-offer-table/TradeOfferTable.vue";
import TradeOfferStatus from "../trade-offer-status/TradeOfferStatus.vue";
import OfferTabs from "@/components/object/ui/offer-tabs/OfferTabs.vue";
import { unitTypes } from "@/const/unitTypes";
import { PropType, defineComponent } from "vue";
import {
  ITradeOfferParameters,
  ITradeOfferPropeties,
  ITradeOfferStatus,
} from "../tradeOfferTabs.interface";
import Parameters from "../../ui/parameters/Parameters.vue";
import ActionButtons from "@/components/common/action-buttons/ActionButtons.vue";

export default defineComponent({
  name: "TradeOfferItem",
  components: {
    TradeOfferTable,
    TradeOfferStatus,
    Parameters,
    OfferTabs,
    ActionButtons,
  },
  props: {
    area: {
      type: Object as PropType<ITradeOfferPropeties>,
      required: true,
    },
    price: {
      type: Object as PropType<ITradeOfferPropeties>,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
    lastUpdate: {
      type: Date,
      required: true,
    },
    status: {
      type: Object as PropType<ITradeOfferStatus>,
    },
    parameters: {
      type: Object as PropType<ITradeOfferParameters>,
      required: true,
    },
  },
  data() {
    return {
      unitTypes,
    };
  },
  computed: {
    actionButtons() {
      return {
        edit: { value: true },
        advert: { value: true },
        dislike: { value: true },
        favorite: { value: true },
        notifications: { value: true },
        pdf: { value: true },
      };
    },
    areaTableTitle() {
      return this.$formatter.numberOrRangeNew(
        this.area.sum.valueMin,
        this.area.sum.valueMax
      );
    },
    priceTableTitle() {
      return this.$formatter.numberOrRangeNew(
        this.price.sum.valueMin,
        this.price.sum.valueMax
      );
    },
    formattedLastUpdate() {
      return this.$formatter.date().locale(this.lastUpdate);
    },
  },
  methods: {},
});
</script>

<style src="./TradeOfferItem.scss" lang="scss"></style>
