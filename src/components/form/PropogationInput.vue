<template>
  <div class="form-item propogation-input">
    <label class="form-item-label" :class="{ required: required }">
      {{ label }}
      <div class="item-container" v-for="(item, index) in field" :key="index">
        <i class="fas fa-minus delete" @click="deleteInput(index)"></i>

        <i class="fas fa-plus add" @click="addInput(item, index)"></i>

        <input
          type="text"
          @input.stop.prevent="onInput"
          @keypress.enter.prevent
          :class="inputClasses"
          class="mb-1"
          v-model="field[index][name]"
          v-maska="maska"
          :placeholder="placeholder"
          :ref="'input' + index"
        />
      </div>
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
  name: "PropogationInput",
  data() {
    return {
      field: null,
    };
  },
  props: {
    modelValue: {
      type: Array,
      default: () => this.defaultField(),
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
    maska: {
      default: null,
    },
    placeholder: {
      type: String,
    },
    name: {
      type: String,
      required: true,
      default: "fuck",
    },
  },
  methods: {
    onInput() {
      this.validate();
      const array = [];
      this.field.map((item) => {
        if (item[this.name].length) {
          array.push(item);
        }
      });
      if (this.field.length == 1) {
        this.field = array;
      }

      this.$emit("update:modelValue", this.field);
    },
    deleteInput(index) {
      this.field = this.field.filter((_, idx) => idx != index);
      this.$emit("update:modelValue", this.field);
    },
    addInput(item, index) {
      if (
        item &&
        item[this.name].length &&
        typeof this.field[index + 1] == "undefined"
      ) {
        this.field.push({ [this.name]: "" });
        this.$nextTick(() => {
          setTimeout(() => {
            this.$refs["input" + (index + 1)].focus();
          }, 0);
        });
      }
    },
    setData() {
      if (!this.modelValue.length) {
        this.field = this.defaultField();
      } else {
        this.field = this.modelValue;
      }
    },
    defaultField() {
      return [{ [this.name]: "" }];
    },
  },
  mounted() {
    this.setData();
  },
  watch: {
    modelValue() {
      this.setData();
    },
  },
};
</script>

<style>
</style>