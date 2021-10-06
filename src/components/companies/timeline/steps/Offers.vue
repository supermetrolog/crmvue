<template>
  <div class="col">
    <div class="row" v-if="data">
      <div class="col text-center">
        <p>
          - Посмотреть и отправить подходящие предложения клиенту, при <br />
          необходимости добавить варианты вручную
        </p>
        <button
          class="action"
          :class="{ active: data.timelineStepObjects.length && !data.negative }"
          disabled
          @click="clickSelectObjects"
        >
          <i class="far fa-smile"></i>
          <span class="ml-1" v-if="data.timelineStepObjects.length"
            >Отправлено {{ data.timelineStepObjects.length }}
          </span>
          <span class="ml-1" v-else>Выбрать</span>
        </button>
        <button
          class="ml-1 mb-2 action"
          :class="{ active: data.negative }"
          :disabled="disabled || data.negative"
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
      default: () => {
        return false;
      },
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