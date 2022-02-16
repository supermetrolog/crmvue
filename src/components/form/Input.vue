<template>
  <div class="form-item">
    <label class="form-item-label" :class="{ required: required }">
      {{ label }}
      <input
        :class="inputClasses"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        @input="onInput($event.target.value.trim())"
        @focus="onFocus"
        @blur="onBlur"
        @keypress.enter.prevent
        :value="modelValue"
        v-maska="maska"
        ref="input"
        :min="min"
        :max="max"
      />
    </label>
    <div class="searchable" v-if="searchable">
      <div class="searchable-container" v-show="searchableVisible">
        <ul>
          <li
            v-for="(item, index) in localeOptions"
            :key="index + 'fuck'"
            @click="selectItem(item)"
          >
            {{ item }}
          </li>
        </ul>
      </div>
    </div>
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
  name: "Input",
  data() {
    return {
      searchableVisible: false,
      localeOptions: this.options,
    };
  },
  props: {
    modelValue: {
      type: [String, Number],
      default: "",
    },
    required: {
      type: Boolean,
      default: false,
    },
    disabled: {
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
    searchable: {
      type: Boolean,
      default: false,
    },
    options: {
      type: [Array, Object],
      default: () => [],
    },
    min: {
      type: [String, Number],
    },
    max: {
      type: [String, Number],
    },
  },
  methods: {
    onInput(value) {
      if (value !== this.modelValue) {
        this.validate();
        this.$emit("update:modelValue", value);
        this.search(value);
      }
    },
    search(value) {
      if (!this.searchable) {
        return;
      }
      this.searchableVisible = true;
      this.localeOptions = [];
      this.options.map((item) => {
        if (item.toLowerCase().indexOf(value.toLowerCase()) !== -1) {
          this.localeOptions.push(item);
        }
      });
    },
    onFocus() {
      if (this.searchable) {
        this.searchableVisible = true;
      }
    },
    close(e) {
      if (!this.$el.contains(e.target)) {
        this.searchableVisible = false;
      }
    },

    selectItem(item) {
      this.onInput(item);
      this.searchableVisible = false;
    },
  },
  mounted() {
    if (this.searchable) {
      document.addEventListener("click", this.close);
    }
  },
  beforeUnmount() {
    if (this.searchable) {
      document.removeEventListener("click", this.close);
    }
  },
  watch: {
    options() {
      this.localeOptions = this.options;
    },
  },
};
</script>

<style>
</style>