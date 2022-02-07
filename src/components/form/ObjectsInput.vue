<template>
  <div class="form-item">
    <label class="form-item-label" :class="{ required: required }">
      {{ label }}
      <input
        :class="inputClasses"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        @input.stop="onInput($event.target.value.trim())"
        @focus="onFocus"
        @blur="onBlur"
        :value="field"
        v-maska="maska"
        ref="input"
      />
    </label>

    <div class="searchable search-objects">
      <div class="searchable-container" v-show="searchableVisible">
        <ul>
          <li v-if="!localeOptions.length">
            <p>не найдено</p>
          </li>
          <li
            v-for="(item, index) in localeOptions"
            :key="index + 'fuck'"
            @click="selectItem(item)"
          >
            <div class="row no-gutters">
              <div class="col-4 text-center">
                <img :src="item.icon" class="mt-2" />
              </div>
              <div class="col-8 pl-1 align-self-end">
                <div class="mb-1 text-center">
                  <p class="district mb-1">
                    {{ item.info.district_name }} -
                    {{ item.info.direction_name }}
                  </p>
                  <span
                    class="square-badge mr-2 mb-1"
                    :class="{
                      'd-block': item.label == 'Ответственное хранение',
                    }"
                  >
                    {{ item.label }}
                  </span>
                  <span class="square-badge">
                    {{ item.info.visual_id }}
                  </span>
                </div>
                <div class="text-center">
                  <small>
                    {{ item.info.address }}
                  </small>
                  <p class="text-center">
                    <i class="fas fa-square-full text-dark d-inline"></i>
                    {{ item.info.area_min }} - {{ item.info.area_max }} м<sup
                      >2</sup
                    >
                  </p>
                  <small>
                    <a
                      :href="`https://pennylane.pro/complex/${item.info.complex_id}?offer_id=[${item.info.original_id}]`"
                      class="text-primary"
                      target="_blanc"
                    >
                      подробнее
                    </a>
                  </small>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="error-container" v-if="v && v.$error">
      <p>{{ v.$errors[0].$message }}</p>
    </div>
    <div v-if="selectedItem">
      <div class="row no-gutters">
        <div class="col-4 text-center">
          <img :src="selectedItem.photos[0]" class="mt-2" />
        </div>
        <div class="col-8 pl-1 align-self-end">
          <div class="mb-1 text-center">
            <p class="district mb-1">
              {{ selectedItem.district_name }} -
              {{ selectedItem.direction_name }}
            </p>
            <span
              class="square-badge mb-1"
              :class="{
                'd-block':
                  selectedItem.deal_type_name == 'Ответственное хранение',
              }"
            >
              {{ selectedItem.deal_type_name }}
            </span>
            <span class="square-badge ml-2">
              {{ selectedItem.visual_id }}
            </span>
          </div>
          <div class="text-center">
            <small>
              {{ selectedItem.building[1].address[1] }}
            </small>
            <p class="text-center">
              <i class="fas fa-square-full text-dark d-inline"></i>
              {{ selectedItem.area_min }} - {{ selectedItem.area_max }} м<sup
                >2</sup
              >
            </p>
            <small>
              <a
                :href="`https://pennylane.pro/complex/${selectedItem.complex_id}?offer_id=[${selectedItem.original_id}]`"
                class="text-primary"
                target="_blanc"
              >
                подробнее
              </a>
            </small>
          </div>
        </div>
      </div>
    </div>
    <slot />
  </div>
</template>

<script>
import Mixin from "./mixins";
import api from "@/api/api";
export default {
  mixins: [Mixin],
  name: "ObjectsInput",
  data() {
    return {
      searchableVisible: false,
      localeOptions: [],
      field: null,
      selectedItem: null,
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
    type_id: {
      type: [Number, String],
    },
    options: {
      type: Function,
      default: async (query = "не выбрано") => {
        return {
          label: query,
          value: null,
          icon: null,
        };
      },
    },
  },
  methods: {
    onInput(value) {
      if (value !== this.field) {
        this.field = value;
        this.validate();
        this.search(value);
      }
    },
    async search(value, open = true) {
      this.searchableVisible = open;
      this.localeOptions = await this.options(value);
    },
    onFocus() {
      this.searchableVisible = true;
    },
    close(e) {
      if (!this.$el.contains(e.target)) {
        this.searchableVisible = false;
      }
    },
    selectItem(item) {
      this.$emit("update:modelValue", item.value);
      this.$emit("selectItem", item.info.complex_id, item.info.type_id);
      this.getSelectedItem(item);

      this.searchableVisible = false;
    },
    async getSelectedItem(item) {
      let objects = [];
      if (item) {
        objects = await api.objects.getCurrentStepObjectsOneByOne([
          { object_id: item.info.original_id, type_id: item.info.type_id },
        ]);
        return (this.selectedItem = objects[0].area_min ? objects[0] : null);
      }
      if (this.modelValue) {
        objects = await api.objects.getCurrentStepObjectsOneByOne([
          { object_id: this.modelValue, type_id: this.type_id },
        ]);
        return (this.selectedItem = objects[0].area_min ? objects[0] : null);
      }
    },
  },
  mounted() {
    document.addEventListener("click", this.close);
    this.getSelectedItem();
  },
  beforeUnmount() {
    document.removeEventListener("click", this.close);
  },
  watch: {
    modelValue() {
      this.getSelectedItem();
    },
  },
};
</script>
<style lang="scss">
.searchable.search-objects {
  .searchable-container {
    max-height: 400px;
    a {
      &:hover {
        text-decoration: underline;
      }
    }
  }
  .district {
    text-transform: uppercase;
  }
}
</style>