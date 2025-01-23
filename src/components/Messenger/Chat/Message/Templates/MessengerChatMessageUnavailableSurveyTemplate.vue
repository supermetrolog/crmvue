<template>
    <div class="messenger-chat-message-template messenger-chat-template-unavailable-survey">
        <p class="messenger-chat-message-template__header">
            <i class="messenger-chat-message-template__icon fa-solid fa-user-pen"></i>
            <i class="messenger-chat-message-template__icon fa-solid fa-phone-slash"></i>
            <span class="messenger-chat-message-template__title">
                Не удалось заполнить опросник
            </span>
        </p>
        <div class="messenger-chat-message-template__body" v-html="message.message"></div>
    </div>
</template>
<script setup>
defineProps({
    message: {
        type: Object,
        required: true
    }
});
</script>
