<template>
  <div class="building-info">
    <div class="building-info__table-list">
      <PropertyList class="building-info__table">
        <p class="building-info__heading">
          {{ area.sum.value }}
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
    </div>
    <div class="building-info__table-list">
      <PropertyList class="building-info__table">
        <p class="building-info__heading">
          {{ price.sum.value }}
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
import { UnitTypesList } from "../../../../../../const/Const";

export default {
  name: "BuildingInfo",
  components: {},
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
    };
  },
  methods: {},
};
</script>

<style src="./BuildingInfo.scss" lang="scss"></style>
