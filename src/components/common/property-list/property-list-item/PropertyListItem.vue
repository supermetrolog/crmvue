<template>
  <li class="PropertyListItem">
    <div class="PropertyListItem-name">{{ name }}</div>
    <p class="PropertyListItem-value" :class="{ 'not-filled': !value }">
      {{ propertyValue }}
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
import { formatValue } from "@/utils";
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
      formatValue,
    };
  },

  methods: {},
  computed: {
    propertyValue() {
      return this.value ? formatValue(this.value) : "не заполнено";
    },
  },
};
</script>
