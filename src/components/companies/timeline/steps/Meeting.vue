<template>
  <div class="col">
    <div class="row mb-2">
      <div class="col" v-if="data">
        <p>- Установить контакт, подтвердить параметры запроса</p>
        <button
          class="action"
          :class="{ active: data.done }"
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
    clickToggleDone() {
      this.data.done ? (this.data.done = 0) : (this.data.done = 1);
      this.$emit("updateItem", this.data);
    },
  },
  emits: ["updateItem"],
};
</script>

<style>
</style>