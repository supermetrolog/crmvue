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
  padding: 5px 25px 5px 5px;
  border: 1px solid $color_grey;
  background-color: $color_light;
  border-radius: 4px;
  color: $color_dark;
  display: flex;
  position: relative;
  text-transform: capitalize;
  p{
    font-weight: 400;
  }
  i {
    color: lightcoral;
    position: absolute;
    right: 5px;
    top: 8px;
    cursor: pointer;
    &:hover {
      color: $color_danger  ;
    }
  }
}
</style>