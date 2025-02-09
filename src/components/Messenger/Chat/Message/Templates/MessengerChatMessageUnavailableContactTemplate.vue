<template>
    <div class="messenger-chat-message-template messenger-chat-template-unavailable-contact">
        <p class="messenger-chat-message-template__header">
            <i class="messenger-chat-message-template__icon fa-solid fa-phone-slash"></i>
            <span class="messenger-chat-message-template__title">
                <span>Не удалось дозвониться до</span>
                <span class="messenger-chat-template-unavailable-contact__name ml-1">
                    {{ contactName }}
                </span>
            </span>
        </p>
        <div ref="messageElement" class="messenger-chat-message-template__body"></div>
    </div>
</template>
<script setup>
import { computed, toRef, useTemplateRef } from 'vue';
import { getContactFullName } from '@/utils/formatters/models/contact.js';
import { useLinkify } from '@/composables/useLinkify.js';

const props = defineProps({
    message: {
        type: Object,
        required: true
    }
});

const contactName = computed(() => getContactFullName(props.message.contacts[0]));

// linkify

const messageElement = useTemplateRef('messageElement');

useLinkify(toRef(props.message, 'message'), messageElement);
</script>
