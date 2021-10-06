<template>
  <div class="col">
    <div class="row" v-if="data">
      <div class="col">
        <p>- Отметить объект, по которому произошла сделка</p>
        <button class="action" :class="{ active: data.done }" disabled>
          <i class="far fa-smile"></i>
          <span class="ml-1">Выполнено</span>
        </button>
        <button
          class="ml-1 mb-2 action"
          :class="{ active: data.negative }"
          :disabled="disabled || data.negative"
          @click="clickNegative"
        >
          <i class="far fa-frown-open"></i>
          <span class="ml-1">Сделка не состоялась</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Offers",
  data() {
    return {
      data: null,
    };
  },
  props: {
    step: {
      type: Object,
    },
    disabled: {
      type: Boolean,
    },
  },
  mounted() {
    this.data = this.step;
  },
  methods: {
    clickNegative() {
      this.data.negative = 1;
      this.$emit("updateItem", this.data);
    },
  },
  watch: {
    step() {
      this.data = this.step;
    },
  },
  emits: ["updateItem"],
};
</script>

<style>
</style>