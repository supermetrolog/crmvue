<template>
    <div class="offer-table-item-call">
        <template v-if="call">
            <UiField
                v-if="withoutContacts"
                @click="$emit('to-chat')"
                tooltip="К предложению не прикреплен активный контакт. Нажмите, чтобы перейти в чат предложения."
                class="offer-table-item-call__chip warning"
            >
                <p>Нет контактов</p>
                <p class="offer-table-item-call__help">от {{ lastCallDate }}</p>
            </UiField>
            <UiField
                v-else-if="lastCallIsExpired"
                @click="$emit('to-survey')"
                :tooltip="`Дата последнего звонка по предложению - ${lastCallDate}. Нажмите, чтобы перейти к опроснику и обновить информацию.`"
                class="offer-table-item-call__chip expired"
            >
                <i class="fa-solid fa-phone" />
                <span>Прозвонить!</span>
            </UiField>
            <UiField
                v-else-if="!lastCallHasCompleteStatus"
                @click="$emit('to-survey')"
                :tooltip="`Не дозвонились. Дата звонка - ${lastCallDate}. Нажмите, чтобы перейти к опроснику и обновить информацию.`"
                class="offer-table-item-call__chip"
                color="gray-l"
            >
                <i class="fa-solid fa-phone-slash" />
                <span>{{ lastCallDate }}</span>
            </UiField>
            <UiField
                v-else
                @click="$emit('to-chat')"
                :tooltip="`Дата последнего звонка по предложению - ${lastCallDate}. Нажмите, чтобы перейти в чат предложения.`"
                class="offer-table-item-call__chip"
            >
                <i class="fa-solid fa-comments" />
                <span>{{ lastCallIsExpired ? 'Прозвонить!' : lastCallDate }}</span>
            </UiField>
        </template>
        <UiField
            v-else-if="isRecentlyCreated"
            @click="$emit('to-chat')"
            tooltip="
                'Предложение недавно добавлено в систему. Нажмите, чтобы перейти в чат предложения.'
            "
            class="offer-table-item-call__chip"
        >
            <p class="offer-table-item-call__help">Новая сделка</p>
            <p>от {{ createdAtFormat }}</p>
        </UiField>
        <UiField
            v-else-if="withoutContacts"
            @click="$emit('to-chat')"
            tooltip="
                'К предложению не прикреплен активный контакт. Нажмите, чтобы перейти в чат предложения.'
            "
            class="offer-table-item-call__chip warning"
        >
            <p>Нет контактов</p>
        </UiField>
        <UiField
            v-else
            @click="$emit('to-survey')"
            tooltip="
                Дата последнего звонка неизвестна. По предложению еще не было зафиксированных звонков. Нажмите, чтобы перейти к опроснику и обновить информацию.
            "
            class="offer-table-item-call__chip expired"
        >
            <i class="fa-solid fa-phone" />
            <span>Прозвонить!</span>
        </UiField>
    </div>
</template>
<script setup>
import { computed } from 'vue';
import { dayjsFromServer, toDateFormat } from '@/utils/formatters/date.ts';
import dayjs from 'dayjs';
import { CALL_STATUSES } from '@/components/MessengerQuiz/useMessengerQuiz.js';
import UiField from '@/components/common/UI/UiField.vue';

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
    dayjs().diff(dayjsFromServer(props.call.created_at), 'days')
);
const lastCallIsExpired = computed(
    () => lastCallDiffInDays.value > import.meta.env.VITE_VUE_APP_MESSENGER_DATE_FROM_CALL_DANGER
);

const createdAtFormat = computed(() => toDateFormat(props.createdAt, 'D.MM.YYYY'));

const lastCallHasCompleteStatus = computed(() => props.call.status === CALL_STATUSES.COMPLETED);
</script>
