<template>
  <div class="modal active" role="dialog" :class="classes">
    <div class="modal-container">
      <div class="modal-header">
        <div class="row no-gutters">
          <div class="title col">{{ title }}</div>
          <div class="col ml-auto text-right">
            <i class="fas fa-times" @click="clickCancel"></i>
          </div>
        </div>
      </div>
      <div class="modal-body">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Modal",
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
  mounted() {
    document.getElementsByTagName("body")[0].style.overflow = "hidden";
  },
  unmounted() {
    document.getElementsByTagName("body")[0].style["overflow-y"] = "scroll";
  },
  emits: ["close"],
};
</script>

<style>
</style>