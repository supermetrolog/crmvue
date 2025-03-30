<template>
    <UiButton :tooltip :active outlined class="timeline-button" :class="{ active }">
        <div class="d-flex align-items-center gap-2">
            <i v-if="active" class="fa-solid fa-check" />
            <slot />
        </div>
    </UiButton>
</template>
<script setup>
import UiButton from '@/components/common/UI/UiButton.vue';

defineProps({
    active: Boolean,
    tooltip: String
});
</script>
