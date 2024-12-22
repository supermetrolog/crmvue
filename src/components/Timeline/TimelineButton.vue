<template>
    <Button :active solid icon class="timeline-button" :class="{ active: active }">
        <i v-if="active" class="fa-solid fa-check" />
        <slot />
    </Button>
</template>
<script setup>
import Button from '@/components/common/Button.vue';

defineProps({
    active: Boolean
});
</script>
