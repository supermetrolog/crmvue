<template>
  <div class="additional-details">
    <h2 class="additonal-deatils__heading">{{ label }}</h2>
    <ul v-if="extraCosts" class="additional-details__list">
      <li class="additional-details__item additional-details__item_heading">
        Дополнительные расходы
      </li>
      <li
        class="additional-details__item"
        v-for="(item, idx) in extraCosts"
        :key="item.label + idx"
      >
        <p class="additional-details__item-label">{{ item.label }}</p>
        <p class="additional-details__item-value">
          {{ item.value }}
          <span v-html="renderCorrectUnitTypes(item.unitType)"></span>
        </p>
      </li>
    </ul>
    <ul v-if="specialTerms" class="additional-details__list">
      <li class="additional-details__item additional-details__item_heading">
        Особые условия
      </li>
      <li
        class="additional-details__item"
        v-for="(item, idx) in specialTerms"
        :key="item.label + idx"
      >
        <p class="additional-details__item-label">{{ item.label }}</p>
        <p class="additional-details__item-value">
          {{ item.value }}
          <span v-html="renderCorrectUnitTypes(item.unitType)"></span>
        </p>
      </li>
    </ul>
    <ul
      v-if="business"
      class="additional-details__list additional-deatils__list_business"
    >
      <li class="additional-details__item additional-details__item_heading">
        <i class="fa-solid fa-briefcase-blank"></i
        >{{ ucFirstTextFormatter.ucFirst(business.type) }} бизнес
      </li>
      <li
        class="additional-details__item"
        v-for="(item, idx) in specialTerms"
        :key="item.label + idx"
      >
        <p class="additional-details__item-label">{{ item.label }}</p>
        <p class="additional-details__item-value">
          {{ item.value }}
          <span v-html="renderCorrectUnitTypes(item.unitType)"></span>
        </p>
      </li>
    </ul>
  </div>
</template>

<script>
import { formatValue } from "@/utils";
import { UnitTypesList } from "@/const/Const";
import { formatterObject } from "@/plugins";
export default {
  name: "AdditionalDetails",
  props: {
    label: {
      type: String,
      default: "не задано",
    },
    exploitation: {
      type: Boolean,
    },
    communal: {
      type: Boolean,
    },
    extraCosts: {
      type: Array,
    },
    specialTerms: {
      type: Array,
    },
    business: {
      type: Object,
    },
  },
  components: {},
  data() {
    return {
      formatValue,
      UnitTypesList,
      ucFirstTextFormatter: formatterObject.text(),
    };
  },
  methods: {
    renderCorrectUnitTypes: (unitType) => {
      if (!unitType) return;
      if (Array.isArray(unitType)) {
        return `
            ${UnitTypesList.get(unitType[0])}
            <span
              class='additional-details__item-value additional-details__item-value_small'>
              ${UnitTypesList.get(unitType[1])}</span>`;
      }
      return `<span
              class='additional-details__item-value additional-details__item-value_small'>
              ${UnitTypesList.get(unitType)}</span>`;
    },
  },
};
</script>

<style src="./AdditionalDetails.scss" lang="scss"></style>
