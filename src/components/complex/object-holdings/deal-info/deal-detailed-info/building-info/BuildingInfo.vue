<template>
  <div class="building-info">
    <div class="building-info__table-list">
      <PropertyList class="building-info__table">
        <p class="building-info__heading">
          {{ formattedAreaSum }}
          <span> м<sup>2</sup> </span>
        </p>
        <PropertyListItem
          v-for="(prop, idx) in area.properties"
          :key="prop.label + idx"
          :name="prop.label"
          :value="prop.value"
          :valueMin="prop.valueMin"
          :valueMax="prop.valueMax"
          :unitType="unitTypes.SQUARE_METERS"
        />
      </PropertyList>
      <PropertyList class="building-info__table">
        <p class="building-info__heading">
          {{ formattedPriceSum }}
          <span> ₽ </span>
        </p>
        <PropertyListItem
          v-for="(prop, idx) in price.properties"
          :value="prop.value"
          :valueMin="prop.valueMin"
          :valueMax="prop.valueMax"
          :key="prop.label + idx"
          :name="prop.label"
          :unitType="unitTypes.RUB_PER_SQUARE_METERS_PER_YEAR"
        />
      </PropertyList>
    </div>
    <div class="building-info__line">
<!--      <parameters-->
<!--					-->
<!--        :height="parameters.summary.parameters.characteristics.height"-->
<!--        :floorType="parameters.summary.parameters.characteristics.floorType"-->
<!--        :gatesNumber="parameters.summary.parameters.characteristics.gatesNumber"-->
<!--        :electricity="parameters.summary.parameters.communications.electricity"-->
<!--        :heating="parameters.summary.parameters.communications.heating"-->
<!--        :sewage="parameters.summary.parameters.communications.sewage"-->
<!--        :gasForProduction="-->
<!--          parameters.summary.parameters.communications.gasForProduction-->
<!--        "-->
<!--        :liftingDevices="parameters.summary.parameters.liftingDevices.lifts"-->
<!--        :shelving="parameters.summary.parameters.facilities.shelving"-->
<!--      />-->
    </div>
    <div class="building-info__line">
      <offer-tabs :parameters="parameters" class="building-info__tabs" />
      <action-buttons v-bind="actionButtons" class="building-info__buttons" />
    </div>
  </div>
</template>

<script lang="ts">
import PropertyList from "@/components/common/property-list/PropertyList.vue";
import PropertyListItem from "@/components/common/property-list/property-list-item/PropertyListItem.vue";
import OfferTabs from "@/components/complex/ui/offer-tabs/OfferTabs.vue";
// import Parameters from "@/components/complex/ui/parameters/Parameters.vue";
import { unitTypes } from "@/const/unitTypes";
import {
  ITradeOfferParameters,
  ITradeOfferPropeties,
} from "@/components/complex/trade-offer-tabs/tradeOfferTabs.interface";
import { PropType, defineComponent } from "vue";
import ActionButtons from "@/components/common/action-buttons/ActionButtons.vue";

export default defineComponent({
  name: "BuildingInfo",
  components: {
    PropertyList,
    PropertyListItem,
    OfferTabs,
    // Parameters,
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
  methods: {},
  computed: {
    actionButtons() {
      return {
        advert: { value: true },
        dislike: { value: true },
        favorite: { value: true },
        notifications: { value: true },
        pdf: { value: true },
      };
    },
    formattedAreaSum() {
      const { valueMin, valueMax } = this.area.sum;
      return this.$formatter.numberOrRangeNew(valueMin, valueMax);
    },
    formattedPriceSum() {
      const { valueMin, valueMax } = this.price.sum;
      return this.$formatter.numberOrRangeNew(valueMin, valueMax);
    },
  },
});
</script>

<style src="./BuildingInfo.scss" lang="scss"></style>
