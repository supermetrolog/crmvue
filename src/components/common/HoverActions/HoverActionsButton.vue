<template>
    <button ref="el" class="hover-actions__button" :class="{ active: active, small: small }">
        <slot></slot>
    </button>
</template>
<script setup>
import { toRef, useTemplateRef } from 'vue';
import { useTippy } from 'vue-tippy';

const props = defineProps({
    label: {
        type: String,
        default: null
    },
    active: {
        type: Boolean,
        default: false
    },
    small: {
        type: Boolean,
        default: false
    }
});

// tippy

useTippy(useTemplateRef('el'), { content: toRef(props, 'label') });
</script>
