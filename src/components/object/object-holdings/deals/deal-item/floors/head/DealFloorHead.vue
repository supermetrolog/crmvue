<template>
  <div class="DealFloorHead">
    <div class="DealFloorHead-top">
      <p class="DealFloorHead-text DealFloorHead-text_label">
        {{ name }}
      </p>
      <p class="DealFloorHead-text DealFloorHead-text_area">
        {{ $formatter.number(area) }}
        <span>м<sup>2</sup></span>
      </p>
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
    return {};
  },
  methods: {},
};
</script>

<style lang="scss" src="./DealFloorHead.scss"></style>
