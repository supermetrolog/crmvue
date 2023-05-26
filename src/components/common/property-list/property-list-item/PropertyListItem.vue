<template>
  <li class="PropertyListItem">
    <div class="PropertyListItem-name">{{ name }}</div>
    <p class="PropertyListItem-value" :class="{ 'not-filled': !value }">
      {{ formatValue(value) || "не заполнено" }}
      <span
        class="PropertyListItem-value_small"
        v-if="unit"
        v-html="unitTypesList.get(unit)"
      ></span>
    </p>
  </li>
</template>

<script>
import { UnitTypesList } from "@/const/Const";
import { formatterObject } from "@/plugins";
import "./styles.scss";

export default {
  name: "PropertyListItem",
  props: {
    name: {
      type: String,
      default: null,
    },
    value: {
      default: null,
    },
    unit: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      unitTypesList: UnitTypesList,
    };
  },

  methods: {
    formatValue(value) {
      if (value === null) return;
      if (!isNaN(value)) return formatterObject.number(value);
      if (value.includes("-")) {
        const splittedValue = value.split("-");
        if (!isNaN(splittedValue[0].trim()) && !isNaN(splittedValue[1].trim()))
          return formatterObject.numberRange(value);
      }

      return value;
    },
  },
};
</script>
