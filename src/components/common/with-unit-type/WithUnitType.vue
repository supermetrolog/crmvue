<template>
  <p class="with-unit-type">
    {{ value }}
    <unit-type v-if="additionalUnit" :unitType="additionalUnit" />
    <unit-type :unitType="unitType" />
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
      type: Number,
      reuqired: true,
    },
    value: {
      type: [Number, String],
      reuqired: true,
    },
    additionalUnit: {
      type: [Number, undefined],
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
