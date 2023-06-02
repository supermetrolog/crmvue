<template>
  <div class="building-info">
    <div class="building-info__table-list">
      <PropertyList class="building-info__table">
        <p class="building-info__heading">
          {{ formatValue(area.sum.value) }}
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
          {{ formatValue(price.sum.value) }}
          <span> ₽ </span>
        </p>
        <PropertyListItem
          v-for="(prop, idx) in price.list"
          :key="prop.label + idx"
          :name="prop.label"
          :addRub="true"
          :value="prop.value"
          :unitType="prop.unitType"
        />
      </PropertyList>
    </div>
  </div>
</template>

<script>
import { UnitTypesList } from "@/const/Const";
import PropertyList from "@/components/common/property-list/PropertyList.vue";
import PropertyListItem from "@/components/common/property-list/property-list-item/PropertyListItem.vue";
import { formatValue } from "@/utils";
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
      UnitTypesList,
      formatValue,
      unitTypes,
    };
  },
  methods: {},
};
</script>

<style src="./BuildingInfo.scss" lang="scss"></style>
