<template>
  <div class="form-item checkbox icons">
    <label class="form-item-label" :class="{ required: required }" for="fuck">
      {{ label }}
      <div
        class="extra-label"
        v-if="extraLabel"
        :class="{ active: isAllSelected }"
        @click="clickExtraLabel"
      >
        <p>{{ extraLabel }}</p>
      </div>
      <div v-if="options.length" class="item-container">
        <label
          v-for="option in options"
          :key="option[0]"
          :class="{
            active: field.includes(option[0]),
          }"
          :title="option[1].name"
        >
          <input
            type="checkbox"
            v-model="field"
            :class="inputClasses"
            :value="option[0]"
            @change="onChange"
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
          @change="onChange"
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
    name: {
      type: String,
      default: null,
    },
  },
  computed: {
    isAllSelected() {
      return this.compare();
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
    compare() {
      let data = [];
      this.field.forEach((item) => {
        data.push(item);
      });
      let options = [];
      this.options.forEach((item) => {
        options.push(item[0]);
      });
      let result = this.includesArray(options, data);
      return result;
    },
    includesArray(a1, a2) {
      let result = a1.filter(function (i) {
        return !(a2.indexOf(i) > -1);
      });
      return !result.length;
    },
    diff() {
      let options = [];
      this.options.forEach((item) => {
        options.push(item[0]);
      });
      let data = [];
      this.field.forEach((item) => {
        // for (let index = 0; index < this.options.length; index++) {
        //   const element = this.options[index];
        //   if (!item.includes(element[0])) {
        //     return item;
        //   }
        // }
        if (!options.includes(item)) {
          data.push(item);
        }
      });
      this.field = data;
    },
    clickExtraLabel() {
      if (this.isAllSelected) {
        this.diff();

        return this.onChange();
      }
      this.diff();

      this.options.forEach((item) => {
        this.field.push(item[0]);
      });
      return this.onChange();
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