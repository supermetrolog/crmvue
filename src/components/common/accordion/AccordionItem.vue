<template>
  <div class="accordion__item col-12" :class="{ open, disabled }">
    <div class="accordion__item__title" v-if="titleVisible">
      <span class="badge autosize" :class="titleClasses" @click="clickToggle">
        {{ title }}
        <i class="fas fa-angle-up" v-if="open && !disabled"></i>
        <i class="fas fa-angle-down" v-if="!open && !disabled"></i>
      </span>
    </div>
    <div class="accordion__item__body">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: "AccordionItem",
  data() {
    return {
      open: this.openByDefault,
    };
  },
  props: {
    title: {
      type: String,
      default: "___",
    },
    titleClasses: {
      type: String,
      default: "badge-danger",
    },
    titleVisible: {
      type: Boolean,
      default: true,
    },
    openByDefault: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    clickToggle() {
      if (this.disabled) {
        return;
      }
      this.$emit("onOpen");
      // this.open = !this.open;
    },
  },
  watch: {
    openByDefault() {
      this.open = this.openByDefault;
    },
  },
};
</script>

<style>
</style>

