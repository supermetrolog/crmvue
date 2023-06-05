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
      <div class="edit">
        <input
          class="DealFloorHead-checkbox"
          type="checkbox"
          name=""
          :checked="checked"
          :id="'check_head_' + name"
        />
        <label
          class="DealFloorHead-checkbox-label"
          :for="'check_head_' + name"
        />
        <i class="fas fa-pen"></i>
      </div>
    </div>
  </div>
</template>

<script>
import WithUnitType from "@/components/common/with-unit-type/WithUnitType.vue";
import { unitTypes } from "@/const/unitTypes";
export default {
  name: "DealFloorHead",
  components: {
    WithUnitType,
  },
  props: {
    name: {
      type: String,
    },
    area: {
      type: Number,
    },
    checked: {
      type: Boolean,
    },
  },
  data() {
    return {
      unitTypes,
    };
  },
  methods: {},
  computed: {
    formattedArea() {
      return this.$formatter.number(this.area);
    },
  },
};
</script>

<style lang="scss" src="./DealFloorHead.scss"></style>
