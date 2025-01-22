<template>
    <div class="messenger-chat-message__body" v-html="message.message"></div>
</template>
<script setup>
defineProps({
    message: {
        type: Object,
        required: true
    }
});
</script>
