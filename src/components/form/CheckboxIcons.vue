<template>
  <div class="form-item checkbox icons">
    <label class="form-item-label" :class="{ required: required }" for="fuck">
      {{ label }}
      <div class="extra-label" v-if="extraLabel">
        <p>{{ extraLabel }}</p>
      </div>
      <div v-if="options.length" class="item-container">
        <label
          v-for="option in options"
          :key="option[0]"
          :class="{
            active: field.includes(option[0]),
          }"
        >
          <input
            type="checkbox"
            v-model="field"
            :class="inputClasses"
            :value="option[0]"
          />
          <i :class="option[1].icon" class="align-self-center"></i>
        </label>
      </div>
      <div v-else>
        <input
          type="checkbox"
          v-model="field"
          :class="inputClasses"
          :true-value="1"
          :false-value="0"
        />
      </div>
    </label>
    <div class="error-container" v-if="v && v.$error">
      <p>{{ v.$errors[0].$message }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "Checkbox",
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
    extraLabel: {
      type: String,
      default: null,
    },
    options: {
      type: Array,
      default: () => [],
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