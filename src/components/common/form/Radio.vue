<template>
  <div class="form-item radio">
    <label class="form-item-label" :class="{ required: required }" for="fuck">
      {{ label }}
      <div v-if="options.length">
        <label v-for="option in options" :key="option[0]">
          <input
            type="radio"
            v-model="field"
            :class="inputClasses"
            :value="option[0]"
            @click="onChange($event)"
          />
          {{ option[1] }}
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
  name: "Radio",
  data() {
    return {
      field: this.modelValue,
    };
  },
  props: {
    modelValue: {
      type: [Array, Number, String],
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
    unselectMode: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    onChange(event) {
      this.validate();
      console.log(event.target.value, this.field);
      const value = event.target.value;
      if (this.unselectMode && value == this.field) {
        this.field = null;
      } else {
        this.field = +value;
      }
      this.$emit("update:modelValue", this.field);
    },
  },
  watch: {
    // field() {
    //   this.onChange();
    // },
    modelValue() {
      this.field = this.modelValue;
    },
  },
};
</script>

<style>
</style>