<template>
  <button class="DropdownSwitcher" @click="switchDropdown">
    <i class="fa fa-chevron-down" v-if="!modelValue"></i>
    <i class="fa fa-chevron-up" v-if="modelValue"></i>
    {{ title }} ({{ mainNumber
    }}<span class="side_number" v-if="sideNumber">{{ `/${sideNumber}` }}</span
    >)
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
      required: true,
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
