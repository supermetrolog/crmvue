<template>
    <MessengerButton
        v-if="scheduledDate"
        v-tippy="'Нажмите, чтобы отменить запланированный звонок'"
        color="success"
    >
        <i class="fa-solid fa-phone"></i>
        <span>Звонок запланирован на {{ scheduledCallDate }}</span>
        <i class="fa-solid fa-check"></i>
    </MessengerButton>
    <MessengerButton v-else v-tippy="'Нажмите, чтобы создать задачу на запланированный звонок'">
        <i class="fa-solid fa-phone"></i>
        <span>Запланировать звонок</span>
    </MessengerButton>
</template>
<script setup>
import { computed, ref } from 'vue';
import MessengerButton from '@/components/Messenger/MessengerButton.vue';
import { toDateFormat } from '@/utils/formatters/date.js';

const props = defineProps({
    scheduledDate: {
        type: String,
        default: null
    }
});

const scheduledCallDate = computed(() => {
    if (props.scheduledDate) return toDateFormat(props.scheduledDate, 'D.MM.YY');
    return null;
});
</script>
