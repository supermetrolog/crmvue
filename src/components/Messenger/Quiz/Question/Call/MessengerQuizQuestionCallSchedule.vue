<template>
    <UiButton v-if="scheduledDate" color="success" icon="fa-solid fa-phone">
        <span>Звонок запланирован на {{ scheduledCallDate }}</span>
        <i class="fa-solid fa-check"></i>
    </UiButton>
    <UiButton
        v-else
        v-tippy="'Нажмите, чтобы создать задачу на запланированный звонок'"
        @click="$emit('schedule')"
        color="light"
        icon="fa-solid fa-phone"
    >
        <span>Запланировать звонок</span>
    </UiButton>
</template>
<script setup>
import { computed } from 'vue';
import UiButton from '@/components/common/UI/UiButton.vue';
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
