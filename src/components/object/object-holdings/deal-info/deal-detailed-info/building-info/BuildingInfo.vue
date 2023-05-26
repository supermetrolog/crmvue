<template>
  <div class="building-info">
    <div class="building-info__table-list">
      <PropertyList class="building-info__table">
        <p class="building-info__heading">
          {{ formatValue(area.sum.value) }}
          <span v-html="UnitTypesList.get(area.sum.unitType)"></span>
        </p>
        <PropertyListItem
          v-for="(prop, idx) in area.list"
          :key="prop.label + idx"
          :name="prop.label"
          :value="prop.value"
          :unit="prop.unitType"
        />
      </PropertyList>
      <PropertyList class="building-info__table">
        <p class="building-info__heading">
          {{ formatValue(price.sum.value) }}
          <span v-html="UnitTypesList.get(price.sum.unitType)"></span>
        </p>
        <PropertyListItem
          v-for="(prop, idx) in price.list"
          :key="prop.label + idx"
          :name="prop.label"
          :value="prop.value"
          :unit="prop.unitType"
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
    };
  },
  methods: {},
};
</script>

<style src="./BuildingInfo.scss" lang="scss"></style>
