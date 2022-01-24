<template>
  <div class="form-item propogation-input">
    <label
      class="form-item-label"
      :class="{ required: required }"
      v-if="field.length && field.length != 1"
    >
      {{ label }}
      <div v-for="(item, index) in field" :key="index" class="item-container">
        <i class="fas fa-minus delete" @click="deleteInput(index)"></i>
        <i
          class="fas fa-plus add"
          @click="addInput(item, index)"
          v-if="typeof field[index + 1] == 'undefined'"
        ></i>
        <input
          type="text"
          @change="onChange"
          :class="inputClasses"
          class="mb-1"
          v-model.lazy="field[index]"
          v-maska="maska"
          :placeholder="placeholder"
          :ref="'input' + index"
        />
      </div>
    </label>
    <label class="form-item-label" :class="{ required: required }" v-else>
      {{ label }}
      <div class="item-container">
        <i class="fas fa-plus add" @click="addInput(field[0], 0)"></i>

        <input
          type="text"
          @change="onChange"
          :class="inputClasses"
          class="mb-1"
          v-model.lazy="field[0]"
          v-maska="maska"
          :placeholder="placeholder"
          :ref="'input' + 0"
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
  name: "PropogationInput",
  data() {
    return {
      field: this.modelValue,
    };
  },
  props: {
    modelValue: {
      type: Array,
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
    maska: {
      default: null,
    },
    placeholder: {
      type: String,
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
      const array = [];
      this.field.map((item) => {
        if (item.length) {
          array.push(item);
        }
      });
      this.field = array;
      this.$emit("update:modelValue", this.field);
    },
    validate() {
      if (this.v) {
        this.v.$touch();
      }
    },
    deleteInput(index) {
      this.field = this.field.filter((_, idx) => idx != index);
      this.$emit("update:modelValue", this.field);
    },
    addInput(item, index) {
      if (item && item.length && typeof this.field[index + 1] == "undefined") {
        this.field.push("");
        this.$nextTick(() => {
          setTimeout(() => {
            this.$refs["input" + (index + 1)].focus();
          }, 0);
        });
      }
    },
  },
  watch: {
    modelValue() {
      this.field = this.modelValue;
    },
  },
};
</script>

<style>
</style>