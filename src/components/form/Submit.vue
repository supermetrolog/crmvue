<template>
  <div class="form-item">
    <button class="btn btn-large" :class="buttonClasses">
      <slot />
    </button>
  </div>
</template>

<script>
export default {
  name: "Submit",
  props: {
    buttonClasses: {
      type: String,
      default: "btn-success",
    },
  },
};
</script>

<style>
</style>