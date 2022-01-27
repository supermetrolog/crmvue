<template>
  <div class="form-item radio radio-stars">
    <label class="form-item-label" :class="{ required: required }" for="fuck">
      {{ label }}
      <div v-if="options.length">
        <label v-for="option in options" :key="option[0]">
          <i
            class="far fa-star"
            :class="{ 'text-warning fas fa-star': field >= option[0] }"
          ></i>
          <input
            type="radio"
            v-model="field"
            class="d-none"
            :class="inputClasses"
            :value="option[0]"
          />
          {{ option[1].name }}
        </label>
      </div>
      <div v-else>
        <input type="radio" v-model="field" :class="inputClasses" :value="1" />
      </div>
    </label>
    <div class="error-container" v-if="v && v.$error">
      <p>{{ v.$errors[0].$message }}</p>
    </div>
    <slot />
  </div>
</template>

<script>
import Mixin from "./mixins";
export default {
  mixins: [Mixin],
  name: "RadioStars",
  data() {
    return {
      field: this.modelValue,
    };
  },
  props: {
    modelValue: {
      type: [Array, Number],
      default: () => [],
    },
    required: {
      type: Boolean,
      default: false,
    },
    v: {
      type: Object,
      default: null,
    },
    label: {
      type: String,
      default: null,
    },
    options: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    onChange() {
      this.validate();
      this.$emit("update:modelValue", this.field);
    },
  },
  watch: {
    field() {
      this.onChange();
    },
    modelValue() {
      this.field = this.modelValue;
    },
  },
};
</script>

<style>
</style>