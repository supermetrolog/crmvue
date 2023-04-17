<template>
  <div class="item">
    <p v-html="item.label">
    </p>
    <i class="fas fa-times" @click="$emit('remove', item.value)"></i>
  </div>
</template>

<script>
export default {
  name: "Item",
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.item {
  padding: 5px;
  padding-right: 25px;
  border: 1px solid $color_grey;
  background-color: $color_light_grey;
  color: $color_dark;
  display: flex;
  position: relative;
  i {
    color: $color_danger;
    position: absolute;
    right: 5px;
    top: 8px;
    cursor: pointer;
    &:hover {
      transform: scale(1.1);
    }
  }
}
</style>