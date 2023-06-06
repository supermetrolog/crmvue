<template>
  <div class="deal-deatiled-info">
    <building-info :area="area" :price="price" />
  </div>
</template>

<script>
import BuildingInfo from "./building-info/BuildingInfo.vue";

export default {
  name: "DealDetailedInfo",
  components: {
    BuildingInfo,
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
    return {};
  },
  methods: {},
};
</script>

<style src="./DealDetailedInfo.scss" lang="scss"></style>
