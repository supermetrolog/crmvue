<template>
    <div class="messenger-chat-message__reply">
        <DashboardChip class="dashboard-bg-success text-white">
            <i class="fa-solid fa-reply mr-2" />
            <span>В ответ на это сообщение</span>
        </DashboardChip>
        <DashboardChip
            v-tippy="'Отменить ответ на сообщение'"
            @click="$emit('cancel')"
            class="messenger-chat-message__button dashboard-bg-success text-white"
        >
            <i class="fa-solid fa-xmark" />
        </DashboardChip>
    </div>
</template>
<script setup>
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';

defineEmits(['cancel']);
</script>
