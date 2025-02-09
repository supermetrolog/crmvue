<template>
    <div ref="messageElement" class="messenger-chat-message__body"></div>
</template>
<script setup>
import { toRef, useTemplateRef } from 'vue';
import { useLinkify } from '@/composables/useLinkify.js';

const props = defineProps({
    message: {
        type: Object,
        required: true
    }
});

const messageElement = useTemplateRef('messageElement');

useLinkify(toRef(props.message, 'message'), messageElement);
</script>
