<template>
  <div class="form-item checkbox" :class="mode">
    <label class="form-item-label" :class="{ required: required }" for="fuck">
      {{ mode == "" ? label : "" }}
      <div v-if="options.length">
        <label
          v-for="option in options"
          :key="option[0]"
          class="clicked-label"
          :class="{ checked: field.includes(option[0]) }"
        >
          <input
            type="checkbox"
            v-model="field"
            :class="inputClasses"
            :value="option[0]"
            @change="onChange"
            :disabled="disabled"
          />
          {{ option[1] }}
        </label>
      </div>
      <div v-else>
        <input
          type="checkbox"
          v-model="field"
          :class="inputClasses"
          :true-value="trueValue"
          :false-value="falseValue"
          :disabled="disabled"
          @change="onChange"
        />
        {{ mode == "inline" ? label : "" }}
      </div>
    </label>
    <div class="error-container pt-0" v-if="v && v.$error">
      <p>{{ v.$errors[0].$message }}</p>
    </div>
    <slot />
  </div>
</template>

<script>
import Mixin from "./mixins";
export default {
  mixins: [Mixin],
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
    mode: {
      type: String,
      default: "",
    },
    options: {
      type: Array,
      default: () => [],
    },
    name: {
      type: String,
      default: null,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    trueValue: {
      type: [Number, String, Object],
      default: 1,
    },
    falseValue: {
      type: [Number, String, Object],
      default: null,
    },
  },
  methods: {
    onChange() {
      this.validate();
      if (this.name) {
        let array = [];
        this.field.forEach((item) => {
          array.push({ [this.name]: item });
        });
        this.$emit("update:modelValue", array);
        this.$emit("change", this.field);
      } else {
        this.$emit("update:modelValue", this.field);
        this.$emit("change", this.field);
      }
    },
    setData() {
      this.field = [];
      this.modelValue.forEach((item) => {
        this.field.push(item[this.name]);
      });
    },
  },
  mounted() {
    if (this.name) {
      this.setData();
    }
  },
  watch: {
    modelValue() {
      if (this.name) {
        this.setData();
      } else {
        this.field = this.modelValue;
      }
    },
  },
};
</script>

<style>
</style>