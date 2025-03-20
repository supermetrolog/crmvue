<template>
    <Button ref="button" :active solid icon class="timeline-button" :class="{ active: active }">
        <i v-if="active" class="fa-solid fa-check" />
        <slot />
    </Button>
</template>
<script setup>
import Button from '@/components/common/Button.vue';
import { useTippyText } from '@/composables/useTippyText.js';
import { toRef, useTemplateRef } from 'vue';

const props = defineProps({
    active: Boolean,
    tooltip: String
});

if (props.tooltip) {
    useTippyText(useTemplateRef('button'), toRef(props, 'tooltip'));
}
</script>
