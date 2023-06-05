<template>
  <div class="building-info">
    <div class="building-info__table-list">
      <PropertyList class="building-info__table">
        <p class="building-info__heading">
          {{ formattedAreaSum }}
          <span> м<sup>2</sup> </span>
        </p>
        <PropertyListItem
          v-for="(prop, idx) in area.list"
          :key="prop.label + idx"
          :name="prop.label"
          :value="prop.value"
          :unitType="prop.unitType"
        />
      </PropertyList>
      <PropertyList class="building-info__table">
        <p class="building-info__heading">
          {{ formattedPriceSum }}
          <span> ₽ </span>
        </p>
        <PropertyListItem
          v-for="(prop, idx) in price.list"
          :key="prop.label + idx"
          :name="prop.label"
          :additionalUnit="unitTypes.RUB"
          :value="prop.value"
          :unitType="prop.unitType"
        />
      </PropertyList>
    </div>
  </div>
</template>

<script>
import PropertyList from "@/components/common/property-list/PropertyList.vue";
import PropertyListItem from "@/components/common/property-list/property-list-item/PropertyListItem.vue";
import { unitTypes } from "@/const/unitTypes";

export default {
  name: "BuildingInfo",
  components: {
    PropertyList,
    PropertyListItem,
  },
  props: {
    area: {
      type: Object,
    },
    price: {
      type: Object,
    },
  },
  data() {
    return {
      unitTypes,
    };
  },
  methods: {},
  computed: {
    formattedAreaSum() {
      return this.$formatter.formatValue(this.area.sum.value);
    },
    formattedPriceSum() {
      return this.$formatter.formatValue(this.price.sum.value);
    },
  },
};
</script>

<style src="./BuildingInfo.scss" lang="scss"></style>
