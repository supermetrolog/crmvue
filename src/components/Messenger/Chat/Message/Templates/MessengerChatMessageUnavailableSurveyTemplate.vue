<template>
    <div class="messenger-chat-message-template messenger-chat-template-unavailable-survey">
        <p class="messenger-chat-message-template__header">
            <i class="messenger-chat-message-template__icon fa-solid fa-user-pen"></i>
            <i class="messenger-chat-message-template__icon fa-solid fa-phone-slash"></i>
            <span class="messenger-chat-message-template__title">
                Не удалось заполнить опросник
            </span>
        </p>
        <div ref="messageElement" class="messenger-chat-message-template__body"></div>
    </div>
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

// linkify

const messageElement = useTemplateRef('messageElement');

useLinkify(toRef(props.message, 'message'), messageElement);
</script>
