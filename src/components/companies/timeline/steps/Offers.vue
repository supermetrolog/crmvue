<template>
  <div class="col-10">
    <div class="row" v-if="data">
      <div class="col-4">
        <button
          class="ml-1 mb-2 action danger"
          :class="{ active: data.negative }"
          @click="clickNegative"
        >
          <i class="far fa-frown-open"></i>
          <span class="ml-1">Нет подходящих</span>
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
      this.data.negative ? (this.data.negative = 0) : (this.data.negative = 1);
      this.$emit("updateItem", this.data);
    },
  },
};
</script>

<style>
</style>