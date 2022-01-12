<template>
  <div class="col">
    <div class="row" v-if="data">
      <div class="col">
        <p>- Отметить объекты, по которым клиент планирует вести переговоры</p>
        <button
          class="action"
          :class="{ active: data.timelineStepObjects.length && !data.negative }"
          disabled
          @click="clickSelectObjects"
        >
          <i class="far fa-smile"></i>
          <span class="ml-1"
            >Выбрано {{ data.timelineStepObjects.length }}
          </span>
        </button>
        <button
          class="ml-1 mb-2 action"
          :class="{ active: data.negative }"
          :disabled="disabled || data.negative"
          @click="clickNegative"
        >
          <i class="far fa-frown-open"></i>
          <span class="ml-1">Отказался от переговоров</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { MixinSteps } from "../mixins";
export default {
  name: "Offers",
  mixins: [MixinSteps],
  methods: {
    clickNegative() {
      this.data.negative = 1;
      this.$emit("updateItem", this.data);
    },
  },
};
</script>

<style>
</style>