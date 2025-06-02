<template>
    <a href="#" class="stepper__step" :class="{ active, error, viewed, disabled }">
        <i v-if="icon" class="mr-2 icon" :class="icon" />
        <span v-else-if="showNumber" class="stepper__step-id">{{ number }}</span>
        <span>{{ title }}</span>
    </a>
</template>
<script setup>
defineProps({
    active: Boolean,
    error: Boolean,
    viewed: Boolean,
    disabled: Boolean,
    icon: String,
    number: Number,
    title: {
        type: String,
        required: true
    },
    showNumber: Boolean
});
</script>
