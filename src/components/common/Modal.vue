<template>
  <div class="modal active" role="dialog" :class="classes">
    <div class="modal-container">
      <div class="modal-header">
        <div class="row no-gutters">
          <div class="title col" v-if="title">{{ title }}</div>
          <slot name="header"></slot>
          <div class="col-1 ml-auto text-right align-self-center">
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
    document.getElementsByTagName("body")[0].style.paddingRight = "5px";
    document.getElementsByClassName("navbar")[0].style.paddingRight = "5px";
  },
  unmounted() {
    document.getElementsByTagName("body")[0].style.overflowY = "scroll";
    document.getElementsByTagName("body")[0].style.paddingRight = "0";
    document.getElementsByClassName("navbar")[0].style.paddingRight = "0";
  },
  emits: ["close"],
};
</script>

<style>
</style>