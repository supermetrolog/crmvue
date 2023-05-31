<template>
  <div class="trade-offer-table">
    <p class="trade-offer-table__subtitle">{{ subtitle }}</p>
    <with-unit-type
      class="trade-offer-table__title"
      :value="$formatter.numberOrRange(title.value)"
      :unitType="title.unitType"
    />
    <ul class="trade-offer-table__list">
      <li
        class="trade-offer-table__item"
        v-for="(property, idx) in propertyList"
        :key="property.label + idx"
      >
        <p class="trade-offer-table__text trade-offer-table__text_label">
          {{ property.label }}
        </p>
        <with-unit-type
          class="trade-offer-table__text"
          :value="$formatter.numberOrRange(property.value)"
          :unitType="property.unitType"
        />
      </li>
    </ul>
  </div>
</template>

<script>
import { UnitTypesList } from "@/const/Const.js";
import WithUnitType from "@/components/common/with-unit-type/WithUnitType.vue";

export default {
  name: "TradeOfferTable",
  components: { WithUnitType },
  props: {
    title: {
      type: String,
    },
    subtitle: {
      type: String,
    },
    propertyList: {
      type: Array,
    },
  },
  data() {
    return {
      UnitTypesList,
    };
  },
  methods: {},
  computed: {},
};
</script>

<style src="./TradeOfferTable.scss" lang="scss"></style>
