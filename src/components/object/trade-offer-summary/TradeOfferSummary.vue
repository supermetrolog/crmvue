<template>
  <div class="trade-offer-summary">
    <div class="trade-offer-summary__content">
      <div class="trade-offer-summary__column">
        <PropertyList
          v-for="parameter in Object.keys(parameters)"
          :key="parameter"
          :title="parameterTypes[parameter]"
          class="trade-offer-summary__table"
        >
          <PropertyListItem
            class="trade-offer-summary__item"
            v-for="(subparameter, idx) of parameters[parameter]"
            :value="formattedParameter(subparameter)"
            :valueDetails="
              subparameter.floorType ||
              subparameter.gateType ||
              subparameter.liftingDevicesWeight
            "
            :key="subparameter.name + idx"
            :name="subparameter.name"
            :unitType="subparameter.unitType"
          />
        </PropertyList>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent } from "vue";
import { ITradeOfferCharacteristics } from "@/const/tradeOfferCharacteristics";
import PropertyListItem from "@/components/common/property-list/property-list-item/PropertyListItem.vue";
import PropertyList from "@/components/common/property-list/PropertyList.vue";
import { OfferParametersMixin } from "../offer-parameters.mixin";

export default defineComponent({
  name: "TradeOfferSummary",
  mixins: [OfferParametersMixin],
  components: {
    PropertyListItem,
    PropertyList,
  },
  props: {
    parameters: {
      type: Object as PropType<ITradeOfferCharacteristics>,
      required: true,
    },
  },
  data() {
    return {};
  },
});
</script>

<style lang="scss" src="./TradeOfferSummary.scss" />
