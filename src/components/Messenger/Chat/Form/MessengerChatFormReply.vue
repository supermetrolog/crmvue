<template>
    <div class="messenger-chat-form-reply">
        <UiField class="dashboard-bg-success-l">
            <i class="fa-solid fa-reply mr-2" />
            <span>В ответ на сообщение от {{ message.from.model.userProfile.medium_name }}</span>
        </UiField>
        <UiField
            @click="$emit('cancel')"
            tooltip="Нажмите, чтобы отменить ответ на сообщение"
            class="dashboard-bg-success-l messenger-chat-form-reply__button"
        >
            <i class="fa-solid fa-xmark" />
        </UiField>
    </div>
</template>
<script setup>
import UiField from '@/components/common/UI/UiField.vue';

defineEmits(['cancel']);
defineProps({
    message: {
        type: Object,
        required: true
    }
});
</script>
