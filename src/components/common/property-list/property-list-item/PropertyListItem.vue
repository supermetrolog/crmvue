<template>
  <li class="PropertyListItem">
    <div class="PropertyListItem-name">{{ name }}:</div>
    <with-unit-type
      class="PropertyListItem-value"
      :class="{
        'not-filled': !valueExists,
      }"
      :unitType="displayUnit"
      :value="propertyValue"
    />
  </li>
</template>

<script lang="ts">
import { unitTypes } from "@/const/unitTypes";
import { defineComponent } from "vue";
import WithUnitType from "../../with-unit-type/WithUnitType.vue";
import "./styles.scss";

export default defineComponent({
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
      type: [String, Number, Boolean],
    },
    valueMin: {
      type: Number,
    },
    valueMax: {
      type: Number,
    },
    unitType: {
      type: [Number],
      // required: true,
    },
  },
  data() {
    return {
      unitTypes,
    };
  },

  methods: {
    isNullish(value: any): boolean {
      return value === null || value === undefined;
    },
  },
  computed: {
    propertyValue() {
      if (!this.isNullish(this.value) && typeof this.value === "string")
        return this.value;
      if (!this.isNullish(this.value) && typeof this.value === "boolean")
        return this.value ? "есть" : "нет";
      if (!this.isNullish(this.value) && typeof this.value === "number")
        return this.$formatter.numberOrRangeNew(this.value, this.value);
      if (!this.isNullish(this.valueMin) && !this.isNullish(this.valueMax)) {
        return this.$formatter.numberOrRangeNew(this.valueMin, this.valueMax);
      }
      return "не заполнено";
    },
    displayUnit() {
      return this.valueExists &&
        this.propertyValue !== "есть" &&
        this.propertyValue !== "нет"
        ? this.unitType
        : undefined;
    },
    valueExists() {
      return !(
        this.isNullish(this.value) &&
        this.isNullish(this.valueMin) &&
        this.isNullish(this.valueMax)
      );
    },
  },
});
</script>
