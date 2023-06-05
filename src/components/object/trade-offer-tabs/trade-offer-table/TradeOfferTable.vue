<template>
  <div class="trade-offer-table">
    <p class="trade-offer-table__subtitle">{{ subtitle }}</p>
    <with-unit-type
      class="trade-offer-table__title"
      :value="title"
      :unitType="titleUnitType"
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
          :value="
            $formatter.numberOrRangeNew(property.valueMin, property.valueMax)
          "
          :unitType="propertyUnitType"
          :additionalUnit="additionalUnit"
        />
      </li>
    </ul>
  </div>
</template>

<script>
import WithUnitType from "@/components/common/with-unit-type/WithUnitType.vue";

export default {
  name: "TradeOfferTable",
  components: { WithUnitType },
  props: {
    title: {
      type: String,
      required: true,
    },
    titleUnitType: {
      type: Number,
    },
    propertyUnitType: {
      type: Number,
    },
    subtitle: {
      type: String,
      required: true,
    },
    propertyList: {
      type: Array,
      required: true,
    },
    additionalUnit: {
      type: Number,
    },
  },
  data() {
    return {};
  },
  methods: {},
  computed: {},
};
</script>

<style src="./TradeOfferTable.scss" lang="scss"></style>
