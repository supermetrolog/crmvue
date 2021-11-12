<template>
  <div class="form-item">
    <label class="form-item-label" :class="{ required: required }" v-if="label">
      {{ label }}
      <Multiselect
        :class="inputClasses"
        :placeholder="placeholder"
        v-model="field"
        :options="options"
        :canDeselect="localeSettings.canDeselect"
      />
    </label>
    <div class="error-container" v-if="v && v.$error">
      <p>{{ v.$errors[0].$message }}</p>
    </div>
  </div>
</template>

<script>
import Multiselect from "@vueform/multiselect";

export default {
  name: "Select",
  data() {
    return {
      field: this.modelValue,
      localeSettings: {
        canDeselect: false,
        ...this.settings,
      },
    };
  },
  components: {
    Multiselect,
  },
  props: {
    modelValue: {
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
    label: {
      type: String,
      default: null,
    },
    placeholder: {
      type: String,
      default: "",
    },
    options: {
      required: true,
    },
    settings: {
      type: Object,
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
    onChange() {
      this.validate();
      this.$emit("update:modelValue", this.field);
    },
    validate() {
      if (this.v) {
        this.v.$touch;
      }
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