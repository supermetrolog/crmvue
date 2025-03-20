<template>
    <i ref="el" :class="icon" />
</template>
<script setup>
import { useTippyText } from '@/composables/useTippyText.js';
import { toRef, useTemplateRef } from 'vue';

const props = defineProps({
    icon: {
        type: String,
        required: true
    },
    tooltip: String
});

const el = useTemplateRef('el');

useTippyText(el, toRef(props, 'tooltip'));
</script>
