<template>
    <div class="DropdownContainer" :class="{ open: modelValue }">
        <slot></slot>
    </div>
</template>

<script setup>
const modelValue = defineModel({ type: Boolean });
</script>
