<template>
  <div class="form-item">
    <label class="form-item-label" :class="{ required: required }">
      {{ label }}
      <input
        :class="inputClasses"
        :type="type"
        :placeholder="placeholder"
        @input="onInput"
        :value="modelValue"
        v-maska="maska"
      />
    </label>
    <div class="error-container" v-if="v && v.$error">
      <p>{{ v.$errors[0].$message }}</p>
    </div>
    <slot />
  </div>
</template>

<script>
export default {
  name: "Input",
  props: {
    modelValue: {
      type: String,
      default: "",
    },
    required: {
      type: Boolean,
      default: false,
    },
    v: {
      type: Object,
      default: null,
    },
    type: {
      type: String,
      default: "text",
    },
    label: {
      type: String,
      default: null,
    },
    placeholder: {
      type: String,
      default: "",
    },
    maska: {
      default: null,
    },
  },
  computed: {
    inputClasses() {
      if (this.v) {
        return {
          invalid: this.v.$error,
          valid: this.v.$dirty && !this.v.$error,
        };
      }
      return "";
    },
  },
  methods: {
    onInput($event) {
      this.validate();
      this.$emit("update:modelValue", $event.target.value.trim());
    },
    validate() {
      if (this.v) {
        this.v.$touch();
      }
    },
  },
};
</script>

<style>
</style>