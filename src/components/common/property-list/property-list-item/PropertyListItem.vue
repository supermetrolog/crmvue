<template>
  <li class="PropertyListItem">
    <div class="PropertyListItem-name">{{ name }}:</div>
    <with-unit-type
      class="PropertyListItem-value"
      :class="{ 'not-filled': !value }"
      :additionalUnit="additionalUnit"
      :unitType="unitType"
      :value="propertyValue"
    />
  </li>
</template>

<script>
import { unitTypes } from "@/const/unitTypes";
import WithUnitType from "../../with-unit-type/WithUnitType.vue";
import "./styles.scss";

export default {
  name: "PropertyListItem",
  components: {
    WithUnitType,
  },
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
    additionalUnit: {
      type: Number,
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
  },
};
</script>
