<template>
    <Tooltip v-if="isVisible">
        <template #trigger>
            <span :class="[className, { disabled: disabled }]" class="messenger-dialog__phone">
                <i class="fa-solid fa-phone"></i>
            </span>
        </template>
        <template #content>
            <p v-if="disabled" class="color-light mb-1">Вы не являетесь консультантом этого чата</p>
            <p v-else class="color-success mb-1">Вы являетесь консультантом этого чата</p>
            <p>{{ dateTitle }}: {{ formattedDate }}</p>
            <p>{{ daysFromNowTippy }}</p>
            <p v-if="lastCall">Звонок совершил(а) {{ lastCall.user?.userProfile?.medium_name }}</p>
            <p v-else class="color-light">
                Дата сформирована на основе последнего обновления предложения/компании
            </p>
        </template>
    </Tooltip>
</template>
<script setup>
import dayjs from 'dayjs';
import { plural } from '@/utils/plural.js';
import Tooltip from '@/components/common/Tooltip.vue';
import { computed } from 'vue';
import { toDateFormat } from '@/utils/formatters/date.js';

const props = defineProps({
    lastCall: {
        type: Object,
        default: null
    },
    updatedAt: {
        type: [String, Number, null],
        required: true
    },
    disabled: {
        type: Boolean,
        default: false
    }
});

const isVisible = computed(() => {
    return daysFromNow.value >= import.meta.env.VITE_VUE_APP_MESSENGER_DATE_FROM_CALL_WARNING;
});

const correctDate = computed(() => {
    if (props.lastCall) return props.lastCall.created_at;
    return props.updatedAt;
});

const formattedDate = computed(() => {
    return toDateFormat(correctDate.value, 'DD.MM.YYYY');
});

const daysFromNow = computed(() => {
    return dayjs().diff(dayjs(correctDate.value), 'day');
});

const daysFromNowTippy = computed(() => {
    if (daysFromNow.value === 0) return 'Сегодня';
    if (daysFromNow.value === 1) return 'Вчера';
    return plural(daysFromNow.value, '%d день назад', '%d дня назад', '%d дней назад');
});

const className = computed(() => {
    const classNameBase = 'messenger-dialog__phone--';

    if (daysFromNow.value >= import.meta.env.VITE_VUE_APP_MESSENGER_DATE_FROM_CALL_DANGER) {
        return classNameBase + 'danger';
    }

    if (daysFromNow.value >= import.meta.env.VITE_VUE_APP_MESSENGER_DATE_FROM_CALL_WARNING) {
        return classNameBase + 'warning';
    }

    if (daysFromNow.value >= import.meta.env.VITE_VUE_APP_MESSENGER_DATE_FROM_CALL_INFO) {
        return classNameBase + 'info';
    }

    return classNameBase + 'success';
});

const dateTitle = computed(() =>
    props.lastCall ? 'Дата последнего звонка' : 'Последнее обновление информации'
);
</script>
