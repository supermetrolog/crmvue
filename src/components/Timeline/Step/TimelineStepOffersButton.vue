<template>
    <Button solid class="timeline-step-offers__button" :active :class="{ active: active }">
        <i class="icon mr-1" :class="icon"></i>
        <span>{{ label }}</span>
        <span v-if="!!count" class="ml-1">({{ count }})</span>
    </Button>
</template>

<script setup>
import Button from '@/components/common/Button.vue';

defineProps({
    count: Number,
    icon: String,
    label: String,
    active: Boolean
});
</script>
