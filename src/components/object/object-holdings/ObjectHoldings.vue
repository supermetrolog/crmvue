<template>
  <div class="ObjectHoldings">
    <div class="ObjectHoldings-header">
      <span class="ObjectHoldings-header-name">
        СТРОЕНИЯ
        <template v-if="buildingsCount">
          {{ `(${buildingsCount})` }},
        </template>
        УЧАСТКИ
        <template v-if="landsCount"> {{ `(${landsCount})` }}</template>
      </span>
      <div class="ObjectHoldings-header-labels"></div>
      <div class="ObjectHoldings-header-line"></div>
    </div>
    <div class="ObjectHoldings-body">
      <ObjectHolding
        v-for="holding in holdings"
        :key="holding.id"
        :id="holding.id"
        :type="holding.type"
        :owners="holding.owners"
        :types="holding.types"
        :typesGeneral="holding.typesGeneral"
        :floors="holding.floors"
        :properties="holding.properties"
      />
    </div>
  </div>
</template>

<script>
import ObjectHolding from "./object-holding/ObjectHolding.vue";
import "./styles.scss";

export default {
  name: "ObjectHoldings",
  components: { ObjectHolding },
  props: {
    holdings: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {};
  },
  computed: {
    buildingsCount() {
      let buildings = this.holdings.filter((holding) => holding.type === 1);
      return buildings.length || null;
    },
    landsCount() {
      return (
        this.holdings.filter((holding) => holding.type === 2).length || null
      );
    },
  },
};
</script>

<style lang="scss" scoped></style>
