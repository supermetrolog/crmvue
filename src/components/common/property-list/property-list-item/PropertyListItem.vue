<template>
  <li class="PropertyListItem">
    <div class="PropertyListItem-name">{{ name }}:</div>
    <div class="PropertyListItem-value">
      <with-unit-type
        :class="{ 'not-filled': !value && !valueMin }"
        :unitType="displayUnit"
        :value="propertyValue"
      />
      <span v-if="valueDetails && typeof valueDetails === 'string'">
        /{{ valueDetails }}
      </span>
      <p class="PropertyListItem-value-lift" v-if="Array.isArray(valueDetails)">
        &nbsp;-&nbsp;
        <with-unit-type
          v-for="(weight, idx) in valueDetails"
          :key="idx"
          :value="weight"
          :unit-type="unitTypes.TON"
        />
      </p>
    </div>
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
    valueDetails: {
      type: [String, Array],
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
