<template>
    <form @submit.prevent="$emit('submit')" class="form">
        <slot />
    </form>
</template>

<script>
export default {
    name: 'Form',
    emits: ['submit']
};
</script>

<style></style>
