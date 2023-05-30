<template>
  <p v-if="Array.isArray(unitType)" class="with-unit-type">
    {{ value }}
    <span
      v-if="unitType"
      class="with-unit-type__unit"
      v-html="UnitTypesList.get(unitType[0])"
    />&nbsp;
    <span
      v-if="unitType"
      class="with-unit-type__unit with-unit-type__unit_size_small"
      v-html="UnitTypesList.get(unitType[1])"
    />
  </p>
  <p v-else class="with-unit-type">
    {{ value }}
    <span
      v-if="unitType"
      class="with-unit-type__unit with-unit-type__unit_size_small"
      v-html="UnitTypesList.get(unitType)"
    />
  </p>
</template>

<script>
import { UnitTypesList } from "@/const/Const";
export default {
  name: "WithUnitType",
  props: {
    unitType: {
      type: [Number, Array],
    },
    value: {
      type: [Number, String],
    },
  },
  data() {
    return {
      UnitTypesList,
    };
  },
};
</script>

<style lang="scss" src="./WithUnitType.scss" />
