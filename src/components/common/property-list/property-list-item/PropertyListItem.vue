<template>
  <li class="PropertyListItem">
    <div class="PropertyListItem-name">{{ name }}:</div>
    <with-unit-type
      class="PropertyListItem-value"
      :class="{ 'not-filled': !value && !valueMin }"
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
      type: Number,
      required: true,
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
      if (this.value) return this.value;
      if (this.valueMin && this.valueMax) {
        return this.$formatter.numberOrRangeNew(this.valueMin, this.valueMax);
      }
      return "не заполнено";
    },
    displayUnit() {
      return this.value || this.valueMin ? this.unitType : undefined;
    },
  },
});
</script>
