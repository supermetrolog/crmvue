<template>
    <div class="messenger-chat-message__reply">
        <UiField class="dashboard-bg-success text-white">
            <i class="fa-solid fa-reply mr-2" />
            <span>В ответ на это сообщение</span>
        </UiField>
        <UiField
            @click="$emit('cancel')"
            tooltip="Отменить ответ на сообщение"
            class="messenger-chat-message__button dashboard-bg-success text-white"
        >
            <i class="fa-solid fa-xmark" />
        </UiField>
    </div>
</template>
<script setup>
import UiField from '@/components/common/UI/UiField.vue';

defineEmits(['cancel']);
</script>
