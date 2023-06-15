<template>
  <span
    v-if="unitType === unitTypes.SQUARE_METERS"
    class="unit-type__unit unit-type__unit_size_small"
  >
    м<sup>2</sup>
  </span>
  <span
    v-else-if="unitType === unitTypes.RUB_PER_MONTH"
    class="unit-type__unit unit-type__unit_size_small"
  >
    ₽/мес
  </span>
  <span
    v-else-if="unitType === unitTypes.METERS"
    class="unit-type__unit unit-type__unit_size_small"
  >
    м
  </span>
  <span
    v-else-if="unitType === unitTypes.KILOWATT"
    class="unit-type__unit unit-type__unit_size_small"
  >
    кВт
  </span>
  <span
    v-else-if="unitType === unitTypes.CUBE_METERS_PER_HOUR"
    class="unit-type__unit unit-type__unit_size_small"
  >
    м<sup>3</sup>/ч
  </span>
  <span
    v-else-if="unitType === unitTypes.BAR"
    class="unit-type__unit unit-type__unit_size_small"
  >
    бар
  </span>
  <span
    v-else-if="unitType === unitTypes.FLOORS"
    class="unit-type__unit unit-type__unit_size_small"
  >
    этаж(а)
  </span>
  <span
    v-else-if="unitType === unitTypes.SQUARE_METERS_PER_YEAR"
    class="unit-type__unit unit-type__unit_size_small"
  >
    м<sup>2</sup>/год
  </span>
  <span
    v-else-if="unitType === unitTypes.RUB"
    class="unit-type__unit unit-type__unit_size_small"
  >
    ₽
  </span>
  <span
    v-else-if="unitType === unitTypes.MONTH"
    class="unit-type__unit unit-type__unit_size_small"
  >
    мес
  </span>
  <span
    v-else-if="unitType === unitTypes.PERCENTS"
    class="unit-type__unit unit-type__unit_size_small"
  >
    %
  </span>
  <span
    v-else-if="unitType === unitTypes.YEAR"
    class="unit-type__unit unit-type__unit_size_small"
  >
    год
  </span>
  <span
    v-else-if="unitType === unitTypes.PER_YEAR"
    class="unit-type__unit unit-type__unit_size_small"
  >
    в год
  </span>
  <template v-else-if="unitType === unitTypes.RUB_PER_SQUARE_METERS_PER_YEAR">
    <span class="unit-type__unit"> ₽ </span>
    <span class="unit-type__unit unit-type__unit_size_small">
      м<sup>2</sup>/год
    </span>
  </template>
  <template v-else-if="unitType === unitTypes.RUB_PER_SQUARE_METERS_PER_MONTH">
    <span class="unit-type__unit"> ₽ </span>
    <span class="unit-type__unit unit-type__unit_size_small">
      м<sup>2</sup>/мес
    </span>
  </template>
  <span
    v-else-if="unitType === unitTypes.RUB_PER_YEAR"
    class="unit-type__unit unit-type__unit_size_small"
  >
    ₽/год
  </span>
  <span
    v-else-if="unitType === unitTypes.TON"
    class="unit-type__unit unit-type__unit_size_small"
  >
    т.
  </span>
  <span
    v-else-if="unitType === unitTypes.PIECES"
    class="unit-type__unit unit-type__unit_size_small"
  >
    шт.
  </span>
  <span
    v-else-if="unitType === unitTypes.CELCIUS"
    class="unit-type__unit unit-type__unit_size_small"
  >
    °C
  </span>
  <span
    v-else-if="unitType === unitTypes.PALLET_PLACE"
    class="unit-type__unit unit-type__unit_size_small"
  >
    п.м.
  </span>
</template>

<script>
import { unitTypes } from "@/const/unitTypes";
import { defineComponent } from "vue";
export default defineComponent({
  name: "WithUnitType",
  props: {
    unitType: {
      type: Number,
      reuqired: true,
    },
  },
  data() {
    return {
      unitTypes,
    };
  },
});
</script>

<style lang="scss">
sup {
  vertical-align: top;
  position: relative;
  top: -0.2em;
}
</style>
