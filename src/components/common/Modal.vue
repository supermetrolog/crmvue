<template>
  <div class="modal active" role="dialog" :class="classes">
    <div class="modal-container">
      <div class="modal-header">
        <div v-if="title">
          {{ title }}
        </div>
        <div>
          <slot name="header"></slot>
        </div>
        <div class="times-container">
          <i class="fas fa-times" @click="clickCancel"></i>
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
  data() {
    return {
      alreadyHidden: false,
    };
  },
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
    if (document.getElementsByTagName("body")[0].style.overflow == "hidden") {
      this.alreadyHidden = true;
      return;
    }
    document.getElementsByTagName("body")[0].style.overflow = "hidden";
    document.getElementsByTagName("body")[0].style.paddingRight = "5px";
    document.getElementsByClassName("navbar")[0].style.paddingRight = "5px";
  },
  unmounted() {
    if (this.alreadyHidden) {
      return;
    }
    document.getElementsByTagName("body")[0].style.overflow = null;
    document.getElementsByTagName("body")[0].style.paddingRight = null;
    document.getElementsByClassName("navbar")[0].style.paddingRight = null;
  },
  emits: ["close"],
};
</script>

<style>
</style>