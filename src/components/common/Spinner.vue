<template>
    <div class="spinner" :class="{ center: center, small: small }">
        <div class="spinner__clip"></div>
        <p v-if="label" class="spinner__label">{{ label }}</p>
    </div>
</template>
<script setup>
defineProps({
    center: { type: Boolean, default: false },
    label: { type: String, default: null },
    small: Boolean
});
</script>
