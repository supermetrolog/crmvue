<template>
    <div class="messenger-chat-form-reply">
        <DashboardChip class="dashboard-bg-success-l">
            <i class="fa-solid fa-reply mr-2" />
            <span>В ответ на сообщение от {{ message.from.model.userProfile.medium_name }}</span>
        </DashboardChip>
        <DashboardChip
            v-tippy="'Нажмите, чтобы отменить ответ на сообщение'"
            @click="$emit('cancel')"
            class="dashboard-bg-success-l messenger-chat-form-reply__button"
        >
            <i class="fa-solid fa-xmark" />
        </DashboardChip>
    </div>
</template>
<script setup>
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';

defineEmits(['cancel']);
defineProps({
    message: {
        type: Object,
        required: true
    }
});
</script>
