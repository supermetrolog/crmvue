<template>
    <DashboardChip
        v-if="call"
        v-tippy="
            'Дата последнего звонка по объекту. Нажмите, чтобы перейти к опроснику и обновить информацию.'
        "
        class="offer-table-item__call"
        :class="{ expired: lastCallIsExpired }"
        with-icon
    >
        <i class="fa-solid fa-phone" />
        <span>{{ lastCallDate }}</span>
    </DashboardChip>
    <DashboardChip
        v-else
        v-tippy="
            'Дата последнего звонка неизвестна. По объекту еще не было зафиксированных звонков. Нажмите, чтобы перейти к опроснику и обновить информацию.'
        "
        class="offer-table-item__call expired"
        with-icon
    >
        <i class="fa-solid fa-phone" />
        <span>Неизвестно</span>
    </DashboardChip>
</template>
<script setup>
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import { computed } from 'vue';
import { dayjsFromMoscow, toDateFormat } from '@/utils/formatters/date.js';
import dayjs from 'dayjs';

const props = defineProps({
    call: {
        type: String,
        default: null
    }
});

const lastCallDate = computed(() => toDateFormat(props.call, 'D.MM.YYYY'));
const lastCallDiffInDays = computed(() => dayjsFromMoscow(props.call).diff(dayjs(), 'days'));
const lastCallIsExpired = computed(
    () => lastCallDiffInDays.value > import.meta.env.VITE_VUE_APP_MESSENGER_DATE_FROM_CALL_WARNING
);
</script>
