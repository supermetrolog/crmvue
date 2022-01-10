<template>
  <div class="form-item">
    <label
      for="fuck"
      class="form-item-label"
      :class="{ required: required }"
      v-if="label"
    >
      {{ label }}
      <Multiselect
        :class="[inputClasses, extraClasses]"
        :placeholder="placeholder"
        v-model="field"
        :mode="mode"
        :options="options"
        :closeOnSelect="closeOnSelect"
        :searchable="searchable"
        :createTag="createTag"
        :canDeselect="canDeselect"
        :filterResults="filterResults"
        :minChars="minChars"
        :resolveOnLoad="resolveOnLoad"
        :delay="delay"
        :loading="loading"
      />
    </label>
    <div class="error-container" v-if="v && v.$error">
      <p>{{ v.$errors[0].$message }}</p>
    </div>
    <slot />
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
    mode: {
      type: String,
      default: "single",
    },
    closeOnSelect: {
      type: Boolean,
      default: true,
    },
    searchable: {
      type: Boolean,
      default: false,
    },
    createTag: {
      type: Boolean,
      default: false,
    },
    canDeselect: {
      type: Boolean,
      default: false,
    },
    filterResults: {
      type: Boolean,
      default: true,
    },
    minChars: {
      type: Number,
      default: 1,
    },
    resolveOnLoad: {
      type: Boolean,
      default: true,
    },
    delay: {
      type: Number,
      default: 0,
    },
    extraClasses: {
      type: String,
      default: "",
    },
    loading: {
      type: Boolean,
      default: false,
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
        this.v.$touch();
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