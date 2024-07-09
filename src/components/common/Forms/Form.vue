<template>
    <form @submit.prevent="$emit('submit')" class="form">
        <slot />
    </form>
</template>

<script setup>
defineEmits(['submit']);
</script>
