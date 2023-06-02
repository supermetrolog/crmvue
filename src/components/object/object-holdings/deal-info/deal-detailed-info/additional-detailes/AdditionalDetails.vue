<template>
  <div class="additional-details">
    <h2 class="additonal-deatils__heading">{{ taxForm }}</h2>
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
        <with-unit-type
          class="additional-details__item-value"
          :value="item.value"
          :unitType="item.unitType"
        />
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
        <with-unit-type
          class="additional-details__item-value"
          :value="item.value"
          :unitType="item.unitType"
        />
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
        <with-unit-type
          class="additional-details__item-value"
          :value="item.value"
          :unitType="item.unitType"
        />
      </li>
    </ul>
  </div>
</template>

<script>
import { formatValue } from "@/utils";
import { formatterObject } from "@/plugins";
import WithUnitType from "@/components/common/with-unit-type/WithUnitType.vue";
import { TaxFormList } from "@/const/Const";
export default {
  name: "AdditionalDetails",
  components: { WithUnitType },
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
  data() {
    return {
      formatValue,
      ucFirstTextFormatter: formatterObject.text(),
      TaxFormList,
    };
  },
  computed: {
    taxForm() {
      return TaxFormList.find((item) => item.value === this.label).label;
    },
  },
  methods: {},
};
</script>

<style src="./AdditionalDetails.scss" lang="scss"></style>
