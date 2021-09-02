<template>
  <div class="col">
    <div class="row mb-2">
      <div class="col">
        <p>- Установить контакт, подтвердить параметры запроса</p>
        <button
          class="action"
          :class="{ active: done }"
          :disabled="disabled"
          @click="clickToggleDone"
        >
          <i class="far fa-smile"></i>
          Выполнено
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Meeting",
  data() {
    return {
      done: 0,
    };
  },
  props: {
    step: {
      type: Object,
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
      this.done = this.step.done;
    },
    getData() {
      let newData = { ...this.step };
      newData.done = this.done;
      return newData;
    },
    clickToggleDone() {
      this.done ? (this.done = 0) : (this.done = 1);
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