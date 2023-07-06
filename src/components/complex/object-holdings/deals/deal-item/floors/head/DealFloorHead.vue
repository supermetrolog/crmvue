<template>
  <div class="DealFloorHead">
    <div class="DealFloorHead-top">
      <p class="DealFloorHead-text DealFloorHead-text_label">
        {{ name }}
      </p>
      <with-unit-type
        :unitType="unitTypes.SQUARE_METERS"
        :value="formattedArea"
        class="DealFloorHead-text DealFloorHead-text_area"
      />
    </div>
    <div class="DealFloorHead-bottom">
      <Form class="edit">
        <input
          class="DealFloorHead-checkbox"
          type="checkbox"
          name=""
          v-model="isChecked"
          :checked="isChecked"
          :id="headInputId"
        />
        <label class="DealFloorHead-checkbox-label" :for="headInputId"/>
        <button class="DealFloorHead-button" @click="$emit('openForm')"><i class="fas fa-plus-circle"></i></button>
      </Form>
    </div>
  </div>
</template>

<script>
import WithUnitType from "@/components/common/with-unit-type/WithUnitType.vue";
import {unitTypes} from "@/const/unitTypes";
import Form from "@/components/common/form/Form.vue";

export default {
  name: "DealFloorHead",
  components: {
    WithUnitType,
    Form,
  },
  props: {
    name: {
      type: String,
    },
    area: {
      type: Object,
    },
    checked: {
      type: Boolean,
    },
  },
  data() {
    return {
      unitTypes,
      isChecked: this.checked,
    };
  },
  methods: {},
  computed: {
    formattedArea() {
      return this.$formatter.numberOrRangeNew(
        this.area.valueMin,
        this.area.valueMax
      );
    },
    headInputId() {
      return "floor-check_" + this.name;
    },
  },
};
</script>

<style lang="scss" src="./DealFloorHead.scss"></style>
