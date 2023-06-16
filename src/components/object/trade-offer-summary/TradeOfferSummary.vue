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
      <div class="trade-offer-summary__column">
        <div class="trade-offer-summary__description">
          <p class="trade-offer-summary__title">Описание</p>
          <p class="trade-offer-summary__text">{{ offerDesciption }}</p>
        </div>
        <div
          v-if="plan_scheme && plan_scheme.length > 0"
          class="trade-offer-summary__scheme"
        >
          <p class="trade-offer-summary__title">На планировках</p>
          <img
            v-for="(imgSrc, idx) in plan_scheme"
            :src="imgSrc"
            alt="схема"
            :key="idx"
            class="trade-offer-summary__image"
          />
        </div>
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
    description: {
      type: String,
      required: true,
    },
    plan_scheme: {
      type: Array,
    },
  },
  data() {
    return {};
  },
  computed: {
    offerDesciption(): string {
      return this.description || "нет описания";
    },
  },
});
</script>

<style lang="scss" src="./TradeOfferSummary.scss" />
