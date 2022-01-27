<template>
  <div class="form-item textarea">
    <label class="form-item-label" :class="{ required: required }">
      {{ label }}
      <textarea
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
  </div>
</template>

<script>
import Mixin from "./mixins";
export default {
  mixins: [Mixin],
  name: "Textarea",
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
  methods: {
    onInput($event) {
      this.validate();
      this.$emit("update:modelValue", $event.target.value.trim());
    },
  },
};
</script>

<style>
</style>