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
      <parameters
        :height="parameters.characteristics.height"
        :floorType="parameters.characteristics.floorType"
        :gatesNumber="parameters.characteristics.gatesNumber"
        :electricity="parameters.communications.electricity"
        :heating="parameters.communications.heating"
        :sewage="parameters.communications.sewage"
        :gasForProduction="parameters.communications.gasForProduction"
        :liftingDevices="parameters.liftingDevices.lifts"
        :shelving="parameters.facilities.shelving"
      />
    </div>
    <div class="building-info__line">
      <offer-tabs class="building-info__tabs" />
      <action-buttons v-bind="actionButtons" class="building-info__buttons" />
    </div>
  </div>
</template>

<script lang="ts">
import PropertyList from "@/components/common/property-list/PropertyList.vue";
import PropertyListItem from "@/components/common/property-list/property-list-item/PropertyListItem.vue";
import OfferTabs from "@/components/object/ui/offer-tabs/OfferTabs.vue";
import Parameters from "@/components/object/ui/parameters/Parameters.vue";
import { unitTypes } from "@/const/unitTypes";
import { ITradeOfferPropeties } from "@/components/object/trade-offer-tabs/tradeOfferTabs.interface";
import { PropType, defineComponent } from "vue";
import { ITradeOfferCharacteristics } from "@/const/tradeOfferCharacteristics";
import ActionButtons from "@/components/common/action-buttons/ActionButtons.vue";

export default defineComponent({
  name: "BuildingInfo",
  components: {
    PropertyList,
    PropertyListItem,
    OfferTabs,
    Parameters,
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
      type: Object as PropType<ITradeOfferCharacteristics>,
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
