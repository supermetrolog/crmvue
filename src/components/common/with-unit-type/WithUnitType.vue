<template>
  <p class="with-unit-type">
    {{ value }}
    <span v-if="addRub" class="with-unit-type__unit"> ₽ </span>
    <span
      v-if="unitType === unitTypes.SQUARE_METERS"
      class="with-unit-type__unit with-unit-type__unit_size_small"
    >
      м<sup>2</sup>
    </span>
    <span
      v-else-if="unitType === unitTypes.RUB_PER_MONTH"
      class="with-unit-type__unit with-unit-type__unit_size_small"
    >
      ₽/мес
    </span>
    <span
      v-else-if="unitType === unitTypes.METERS"
      class="with-unit-type__unit with-unit-type__unit_size_small"
    >
      м
    </span>
    <span
      v-else-if="unitType === unitTypes.KILOWATT"
      class="with-unit-type__unit with-unit-type__unit_size_small"
    >
      кВт
    </span>
    <span
      v-else-if="unitType === unitTypes.CUBE_METERS_PER_HOUR"
      class="with-unit-type__unit with-unit-type__unit_size_small"
    >
      м<sup>3</sup>/ч
    </span>
    <span
      v-else-if="unitType === unitTypes.BAR"
      class="with-unit-type__unit with-unit-type__unit_size_small"
    >
      бар
    </span>
    <span
      v-else-if="unitType === unitTypes.FLOORS"
      class="with-unit-type__unit with-unit-type__unit_size_small"
    >
      этаж(а)
    </span>
    <span
      v-else-if="unitType === unitTypes.SQUARE_METERS_PER_YEAR"
      class="with-unit-type__unit with-unit-type__unit_size_small"
    >
      м<sup>2</sup>/год
    </span>
    <span
      v-else-if="unitType === unitTypes.RUB"
      class="with-unit-type__unit with-unit-type__unit_size_small"
    >
      ₽
    </span>
    <span
      v-else-if="unitType === unitTypes.MONTH"
      class="with-unit-type__unit with-unit-type__unit_size_small"
    >
      мес
    </span>
    <span
      v-else-if="unitType === unitTypes.PERCENTS"
      class="with-unit-type__unit with-unit-type__unit_size_small"
    >
      %
    </span>
    <span
      v-else-if="unitType === unitTypes.YEAR"
      class="with-unit-type__unit with-unit-type__unit_size_small"
    >
      год
    </span>
    <span
      v-else-if="unitType === unitTypes.PER_YEAR"
      class="with-unit-type__unit with-unit-type__unit_size_small"
    >
      в год
    </span>
  </p>
</template>

<script>
import { unitTypes } from "@/const/unitTypes";
export default {
  name: "WithUnitType",
  props: {
    unitType: {
      type: Number,
      reuqired: true,
    },
    value: {
      type: [Number, String],
      reuqired: true,
    },
    addRub: {
      type: Boolean,
      default: false,
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
