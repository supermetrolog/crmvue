<template>
    <div class="spinner" :class="{ center: center }">
        <div class="spinner__clip"></div>
    </div>
</template>
<script setup>
defineProps({ center: { type: Boolean, default: false } });
</script>
