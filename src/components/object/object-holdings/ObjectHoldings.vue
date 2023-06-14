<template>
  <div class="ObjectHoldings">
    <div class="ObjectHoldings-header">
      <p>СТРОЕНИЯ ({{ buildingsCount }}), УЧАСТКИ ({{ landsCount }})</p>
      <div class="ObjectHoldings-header-icons">
        <button class="ObjectHoldings-header-button">
          <i class="fas fa-warehouse"></i>
        </button>
        <button class="ObjectHoldings-header-button">
          <i class="fas fa-tree"></i>
        </button>
      </div>
    </div>
    <div class="ObjectHoldings-body">
      <ObjectHolding
        v-for="holding in holdings"
        :key="holding.id"
        v-bind="holding"
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
      return buildings.length;
    },
    landsCount() {
      return this.holdings.filter((holding) => holding.type === 2).length;
    },
  },
};
</script>

<style lang="scss" scoped></style>
