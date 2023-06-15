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
        class="trade-offer-details-table__section trade-offer-details-table__section"
      >
        <p
          class="trade-offer-details-table__text trade-offer-details-table__text_color_grey"
        >
          № блока:
        </p>
      </li>
      <li
        v-for="parameter in Object.keys(tradeOfferCharacteristics)"
        :key="parameter"
        class="trade-offer-details-table__section trade-offer-details-table__section"
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
          class="trade-offer-details-table__text trade-offer-details-table__text_color_grey"
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
        <li class="trade-offer-details-table__section">
          <Form class="trade-offer-details-table__form">
            <Checkbox
              class="trade-offer-details-table__checkbox"
              :label="block.number"
            />
            <button class="trade-offer-details-table__button">
              <i class="fas fa-pen" />
            </button>
          </Form>
        </li>
        <li
          class="trade-offer-details-table__section trade-offer-details-table__section_values"
          v-for="parameter in Object.keys(block.properties)"
          :key="parameter"
        >
          <p
            v-for="subparameter in block.properties[parameter]"
            :key="subparameter.name"
            class="trade-offer-details-table__text"
          >
            <with-unit-type
              :value="formattedParameter(subparameter)"
              :unit-type="subparameter.unitType"
            />
            <span v-if="subparameter.floorType"
              >/{{ subparameter.floorType }}</span
            >
            <span v-if="subparameter.gateType"
              >/{{ subparameter.gateType }}</span
            >
            <span
              v-if="
                subparameter.liftingDevicesWeight &&
                subparameter.liftingDevicesWeight.length > 0
              "
              class="trade-offer-details-table__text trade-offer-details-table__text_weight"
            >
              &nbsp;-&nbsp;
              <with-unit-type
                v-for="(weight, idx) in subparameter.liftingDevicesWeight"
                :key="idx"
                :value="weight"
                :unit-type="unitTypes.TON"
              />
            </span>
          </p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { ITradeOfferBlock } from "../trade-offer-tabs/tradeOfferTabs.interface";
import { PropType, defineComponent } from "vue";
import {
  ICharacterictic,
  tradeOfferCharacteristics,
} from "@/const/tradeOfferCharacteristics";
import { parameterTypes } from "@/const/parameterTypes";
import Form from "@/components/common/form/Form.vue";
import Checkbox from "@/components/common/form/Checkbox.vue";
import WithUnitType from "@/components/common/with-unit-type/WithUnitType.vue";
import { unitTypes } from "@/const/unitTypes";

const tableHeadColors = ["green", "blue", "cyan", "orange", "red"];

export default defineComponent({
  name: "TradeOfferDetailsTable",
  components: {
    Form,
    Checkbox,
    WithUnitType,
  },
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
      unitTypes,
    };
  },
  methods: {
    formattedParameter(parameter: ICharacterictic) {
      if (
        parameter.value !== undefined &&
        typeof parameter.value === "boolean"
      ) {
        return parameter.value ? "есть" : "нет";
      }
      if (parameter.value && typeof parameter.value === "string")
        return parameter.value;
      return this.$formatter.numberOrRangeNew(
        parameter.valueMin,
        parameter.valueMax
      );
    },
  },
});
</script>

<style lang="scss" src="./TradeOfferDetailsTable.scss" />
