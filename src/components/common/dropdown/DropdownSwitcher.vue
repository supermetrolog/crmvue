<template>
  <button class="DropdownSwitcher" @click="switchDropdown">
    <i class="fa fa-chevron-down" v-if="!modelValue"></i>
    <i class="fa fa-chevron-up" v-if="modelValue"></i>
    <template v-if="title && mainNumber">
      <span> </span> {{ title }} ({{ mainNumber
      }}<span class="side_number" v-if="sideNumber">{{ `/${sideNumber}` }}</span
      >)
    </template>
  </button>
</template>

<script>
export default {
  name: "DropdownSwitcher",
  props: {
    title: {
      type: String,
      default: null,
    },
    mainNumber: {
      type: Number,
      default: null,
    },
    sideNumber: {
      type: Number,
      default: null,
    },
    modelValue: Boolean,
  },
  emits: ["update:modelValue"],
  methods: {
    switchDropdown() {
      this.$emit("update:modelValue", !this.modelValue); // раньше было `this.$emit('input', title)`
    },
  },
};
</script>
