<template>
  <li class="PropertyListItem">
    <div class="PropertyListItem-name">{{ name }}:</div>
    <p class="PropertyListItem-value" :class="{ 'not-filled': !value }">
      {{ propertyValue }}
      <span v-if="addRubUnit"> ₽ </span>
      <span
        v-if="unitType === unitTypes.SQUARE_METERS"
        class="PropertyListItem-value_small"
      >
        м<sup>2</sup>
      </span>
      <span
        v-else-if="unitType === unitTypes.RUB_PER_MONTH"
        class="PropertyListItem-value_small"
      >
        ₽/мес
      </span>
      <span
        v-else-if="unitType === unitTypes.METERS"
        class="PropertyListItem-value_small"
      >
        м
      </span>
      <span
        v-else-if="unitType === unitTypes.KILOWATT"
        class="PropertyListItem-value_small"
      >
        кВт
      </span>
      <span
        v-else-if="unitType === unitTypes.CUBE_METERS_PER_HOUR"
        class="PropertyListItem-value_small"
      >
        м<sup>3</sup>/ч
      </span>
      <span
        v-else-if="unitType === unitTypes.BAR"
        class="PropertyListItem-value_small"
      >
        бар
      </span>
      <span
        v-else-if="unitType === unitTypes.FLOORS"
        class="PropertyListItem-value_small"
      >
        этаж(а)
      </span>
      <span
        v-else-if="unitType === unitTypes.SQUARE_METERS_PER_YEAR"
        class="PropertyListItem-value_small"
      >
        м<sup>2</sup>/год
      </span>
      <span
        v-else-if="unitType === unitTypes.RUB"
        class="PropertyListItem-value_small"
      >
        ₽
      </span>
      <span
        v-else-if="unitType === unitTypes.MONTH"
        class="PropertyListItem-value_small"
      >
        мес
      </span>
      <span
        v-else-if="unitType === unitTypes.PERCENTS"
        class="PropertyListItem-value_small"
      >
        %
      </span>
      <span
        v-else-if="unitType === unitTypes.YEAR"
        class="PropertyListItem-value_small"
      >
        год
      </span>
      <span
        v-else-if="unitType === unitTypes.PER_YEAR"
        class="PropertyListItem-value_small"
      >
        в год
      </span>
    </p>
  </li>
</template>

<script>
import { unitTypes } from "@/const/unitTypes";
import "./styles.scss";

export default {
  name: "PropertyListItem",
  props: {
    name: {
      type: String,
      default: null,
    },
    value: {
      type: String,
      required: true,
    },
    unitType: {
      type: Number,
      required: true,
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

  methods: {},
  computed: {
    propertyValue() {
      return this.value
        ? this.$formatter.formatValue(this.value)
        : "не заполнено";
    },
    addRubUnit() {
      return this.addRub && this.value;
    },
  },
};
</script>
