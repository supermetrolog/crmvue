<template>
  <p class="with-unit-type">
    {{ value }}
    <unit-type v-if="value" :unitType="unitType" />
  </p>
</template>

<script>
import { unitTypes } from "@/const/unitTypes";
import UnitType from "./unitType/UnitType.vue";
export default {
  name: "WithUnitType",
  components: {
    UnitType,
  },
  props: {
    unitType: {
      type: [Number, Boolean],
      reuqired: true,
    },
    value: {
      type: [Number, String],
      reuqired: true,
    },
  },
  data() {
    return {
      unitTypes,
    };
  },
};
</script>

<style lang="scss"></style>
