<template>
  <li class="PropertyListItem">
    <p class="PropertyListItem-name">{{ name }}:</p>
    <div class="PropertyListItem-value">
      <slot>
        не заполнено
      </slot>
    </div>
  </li>
</template>

<script lang="ts">
import { unitTypes } from "@/const/unitTypes";
import { defineComponent } from "vue";
import "./styles.scss";

export default defineComponent({
  name: "PropertyListItem",
  components: {
  },
  props: {
    name: {
      type: String,
      default: "Дефолтное значение",
    },
  },
  data() {
    return {
      unitTypes,
    };
  },
});
</script>
