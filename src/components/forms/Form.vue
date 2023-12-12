<template>
    <form @submit.prevent="$emit('submit')">
        <slot />
    </form>
</template>

<script>
export default {
  name: "Form",
  emits: ["submit"],
};
</script>

<style>
</style>