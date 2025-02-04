<template>
    <div class="offer-table-item-call">
        <template v-if="call">
            <DashboardChip
                v-if="withoutContacts"
                v-tippy="
                    'К компании не прикреплен активный контакт. Нажмите, чтобы перейти в чат компании.'
                "
                @click="$emit('to-chat')"
                class="offer-table-item-call__chip warning"
            >
                <p>Нет контактов</p>
                <p class="offer-table-item-call__help">от {{ lastCallDate }}</p>
            </DashboardChip>
            <DashboardChip
                v-else-if="lastCallIsExpired"
                v-tippy="
                    `Дата последнего звонка - ${lastCallDate}. Нажмите, чтобы перейти к опроснику и обновить информацию.`
                "
                @click="$emit('to-survey')"
                class="offer-table-item-call__chip expired"
                with-icon
            >
                <i v-if="lastCallHasCompleteStatus" class="fa-solid fa-phone" />
                <i v-else class="fa-solid fa-phone-slash" />
                <span>Прозвонить!</span>
            </DashboardChip>
            <DashboardChip
                v-else-if="!lastCallHasCompleteStatus"
                v-tippy="
                    `Не дозвонились. Дата звонка - ${lastCallDate}. Нажмите, чтобы перейти к опроснику и обновить информацию.`
                "
                @click="$emit('to-survey')"
                class="offer-table-item-call__chip warning"
                with-icon
            >
                <i class="fa-solid fa-phone-slash" />
                <span>{{ lastCallDate }}</span>
            </DashboardChip>
            <DashboardChip
                v-else
                v-tippy="
                    `Дата последнего звонка - ${lastCallDate}. Нажмите, чтобы перейти в чат компании.`
                "
                @click="$emit('to-chat')"
                class="offer-table-item-call__chip"
                with-icon
            >
                <i class="fa-solid fa-comments" />
                <span>{{ lastCallDate }}</span>
            </DashboardChip>
        </template>
        <DashboardChip
            v-else-if="isRecentlyCreated"
            v-tippy="'Компания недавно добавлена в систему. Нажмите, чтобы перейти в чат компании.'"
            @click="$emit('to-chat')"
            class="offer-table-item-call__chip"
        >
            <p class="offer-table-item-call__help">Новая сделка</p>
            <p>от {{ createdAtFormat }}</p>
        </DashboardChip>
        <DashboardChip
            v-else-if="withoutContacts"
            v-tippy="
                'К компании не прикреплен активный контакт. Нажмите, чтобы перейти в чат компании.'
            "
            @click="$emit('to-chat')"
            class="offer-table-item-call__chip dashboard-bg-gray-l"
        >
            <p>Нет контактов</p>
        </DashboardChip>
        <DashboardChip
            v-else
            v-tippy="
                'Дата последнего звонка неизвестна. По компании еще не было зафиксированных звонков. Нажмите, чтобы перейти к опроснику и обновить информацию.'
            "
            @click="$emit('to-survey')"
            class="offer-table-item-call__chip expired"
            with-icon
        >
            <i class="fa-solid fa-phone" />
            <span>Прозвонить!</span>
        </DashboardChip>
    </div>
</template>
<script setup>
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import { computed } from 'vue';
import { dayjsFromMoscow, toDateFormat } from '@/utils/formatters/date.js';
import dayjs from 'dayjs';
import { CALL_STATUSES } from '@/components/Messenger/Quiz/useMessengerQuiz.js';

defineEmits(['to-chat', 'to-survey']);
const props = defineProps({
    call: Object,
    createdAt: {
        type: [String, Number],
        default: null
    },
    withoutContacts: Boolean
});

const isRecentlyCreated = computed(() => dayjs().diff(dayjs(props.createdAt), 'days') < 7);

const lastCallDate = computed(() => toDateFormat(props.call.created_at, 'D.MM.YYYY'));
const lastCallDiffInDays = computed(() =>
    dayjs().diff(dayjsFromMoscow(props.call.created_at), 'days')
);
const lastCallIsExpired = computed(
    () => lastCallDiffInDays.value > import.meta.env.VITE_VUE_APP_MESSENGER_DATE_FROM_CALL_WARNING
);

const createdAtFormat = computed(() => toDateFormat(props.createdAt, 'D.MM.YYYY'));

const lastCallHasCompleteStatus = computed(() => props.call.status === CALL_STATUSES.COMPLETED);
</script>
