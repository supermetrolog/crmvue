<template>
  <div class="col company-form">
    <div class="row no-gutters">
      <div class="col">
        <div class="title">
          <p>- Записать параметры сделки и завершить работу с запросом</p>
        </div>
        <div>
          <button
            class="ml-1 action"
            :class="{ active: done }"
            :disabled="disabled || done"
            @click="clickDone"
          >
            <i class="far fa-frown-open"></i>
            <span class="ml-1">Выполнено</span>
          </button>
          <button
            class="ml-1 action"
            :class="{ active: negative }"
            :disabled="disabled || negative"
            @click="clickNegative"
          >
            <i class="far fa-frown-open"></i>
            <span class="ml-1">Сделка не состоялась</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Deal",
  data() {
    return {
      negative: 0,
      done: 0,
    };
  },
  props: {
    actions: {
      type: Object,
      default: () => {
        return {
          negative: 0,
          done: 0,
        };
      },
    },
    branch: {
      type: Number,
    },
    disabled: {
      type: Boolean,
    },
    isConfirmed: {
      type: Boolean,
    },
  },
  mounted() {
    this.setData();
  },
  methods: {
    setData() {
      this.negative = this.actions.negative;
      this.done = this.actions.done;
    },
    getData() {
      return {
        negative: this.negative,
        done: this.done,
      };
    },
    clickNegative() {
      this.negative = 1;
      this.done = 0;
    },
    clickDone() {
      this.done = 1;
      this.negative = 0;
    },
  },
  watch: {
    disabled() {
      if (!this.isConfirmed) {
        this.setData();
      }
    },
  },
};
</script>

<style>
</style>