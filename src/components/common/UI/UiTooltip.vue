<template>
    <component :is="as" ref="el">
        <slot />
    </component>
</template>
<script setup>
import { useTippyText } from '@/composables/useTippyText.js';
import { toRef, useTemplateRef } from 'vue';

const props = defineProps({
    as: {
        type: String,
        default: 'span'
    },
    tooltip: String
});

useTippyText(useTemplateRef('el'), toRef(props, 'tooltip'));
</script>
