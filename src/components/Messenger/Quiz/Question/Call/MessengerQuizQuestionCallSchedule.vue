<template>
    <MessengerButton v-if="scheduledDate" color="success">
        <i class="fa-solid fa-phone"></i>
        <span>Звонок запланирован на {{ scheduledCallDate }}</span>
        <i class="fa-solid fa-check"></i>
    </MessengerButton>
    <MessengerButton
        v-else
        v-tippy="'Нажмите, чтобы создать задачу на запланированный звонок'"
        @click="$emit('schedule')"
        class="messenger-quiz-question__call"
    >
        <i class="fa-solid fa-phone"></i>
        <span>Запланировать звонок</span>
    </MessengerButton>
</template>
<script setup>
import { computed } from 'vue';
import MessengerButton from '@/components/Messenger/MessengerButton.vue';
import { toDateFormat } from '@/utils/formatters/date.js';

defineEmits(['schedule']);
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
