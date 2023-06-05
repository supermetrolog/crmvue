<template>
  <li class="PropertyListItem">
    <div class="PropertyListItem-name">{{ name }}:</div>
    <with-unit-type
      class="PropertyListItem-value"
      :class="{ 'not-filled': !value }"
      :additionalUnit="addAdditionalUnit"
      :unitType="unitType"
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
        ? this.$formatter.numberOrRange(this.value)
        : "не заполнено";
    },
    addAdditionalUnit() {
      return this.value && this.additionalUnit;
    },
  },
});
</script>
