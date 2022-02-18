<template>
  <div class="bar active" role="dialog" :class="classes">
    <div class="bar-container">
      <div class="bar-header">
        <div class="row no-gutters">
          <div class="title col">{{ title }}</div>
          <div class="col ml-auto text-right">
            <i class="fas fa-times" @click="clickCancel"></i>
          </div>
        </div>
      </div>
      <div class="bar-body">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Bar",
  props: {
    title: {
      type: String,
      default: "Заголовок",
    },
    classes: {
      type: String,
    },
  },
  methods: {
    clickCancel() {
      this.$emit("close");
    },
  },
  emits: ["close"],
};
</script>

<style>
</style>