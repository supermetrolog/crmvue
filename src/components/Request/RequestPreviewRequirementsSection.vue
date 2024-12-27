<template>
    <div>
        <p class="request-preview__subtitle mb-1">{{ label }}</p>
        <div class="request-preview__grid">
            <slot></slot>
        </div>
    </div>
</template>
<script setup>
defineProps({
    label: String
});
</script>
