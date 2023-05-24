<template>
  <div class="DealFloorHead">
    <div class="DealFloorHead-top">
      <p class="DealFloorHead-text DealFloorHead-text_label">
        {{ name }}
      </p>
      <p class="DealFloorHead-text DealFloorHead-text_area">
        {{ formatterObject.number(area) }}
        <span v-html="UnitTypesList.get(1)" />
      </p>
    </div>
    <div class="DealFloorHead-bottom">
      <div class="edit">
        <input
          class="DealFloorHead-checkbox"
          type="checkbox"
          name=""
          :checked="checked"
          :id="'check_head_' + name + id"
        />
        <label
          class="DealFloorHead-checkbox-label"
          :for="'check_head_' + name + id"
        />
        <i class="fas fa-pen"></i>
      </div>
    </div>
  </div>
</template>

<script>
import { formatterObject } from "@/plugins";
import { UnitTypesList } from "@/const/Const.js";
import uuid4 from "uuid4";

export default {
  name: "DealFloorHead",
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
      formatterObject,
      UnitTypesList,
      id: uuid4(),
    };
  },
  methods: {},
};
</script>

<style lang="scss" src="./DealFloorHead.scss"></style>
