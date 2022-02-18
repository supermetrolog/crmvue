<template>
  <div class="form">
    <div class="form-container">
      <form @submit.prevent="$emit('submit')">
        <slot />
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "Form",
  emits: ["submit"],
};
</script>

<style>
</style>