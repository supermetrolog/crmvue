<template>
    <div class="offer-table-item-call">
        <template v-if="call">
            <!--            <DashboardChip-->
            <!--                v-if="withoutContacts"-->
            <!--                v-tippy="-->
            <!--                    'К предложению не прикреплен активный контакт. Нажмите, чтобы перейти в чат предложения.'-->
            <!--                "-->
            <!--                @click="$emit('to-chat')"-->
            <!--                class="offer-table-item-call__chip warning"-->
            <!--            >-->
            <!--                <p>Нет контактов</p>-->
            <!--                <p class="offer-table-item-call__help">от {{ lastCallDate }}</p>-->
            <!--            </DashboardChip>-->
            <DashboardChip
                v-tippy="
                    `Дата последнего звонка по предложению - ${lastCallDate}. Нажмите, чтобы перейти к опроснику и обновить информацию.`
                "
                @click="$emit('to-chat')"
                class="offer-table-item-call__chip"
                :class="{ expired: lastCallIsExpired }"
                with-icon
            >
                <i class="fa-solid fa-phone" />
                <span>{{ lastCallIsExpired ? 'Прозвонить!' : lastCallDate }}</span>
            </DashboardChip>
        </template>
        <DashboardChip
            v-else-if="isRecentlyCreated"
            v-tippy="
                'Предложение недавно добавлено в систему. Нажмите, чтобы перейти в чат предложения.'
            "
            class="offer-table-item-call__chip"
        >
            <p class="offer-table-item-call__help">Новая сделка</p>
            <p>от {{ createdAtFormat }}</p>
        </DashboardChip>
        <DashboardChip
            v-else
            v-tippy="
                'Дата последнего звонка неизвестна. По предложению еще не было зафиксированных звонков. Нажмите, чтобы перейти к опроснику и обновить информацию.'
            "
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

defineEmits(['to-chat', 'to-survey']);
const props = defineProps({
    call: {
        type: String,
        default: null
    },
    createdAt: {
        type: [String, Number],
        default: null
    },
    withoutContacts: Boolean
});

// TODO: У нас нет даты создания, нужно что-то придумать на беке
const isRecentlyCreated = computed(
    () =>
        dayjs().diff(dayjs(props.createdAt), 'days') <
        import.meta.env.VITE_VUE_APP_MESSENGER_DATE_FROM_CALL_DANGER
);

const lastCallDate = computed(() => toDateFormat(props.call, 'D.MM.YYYY'));
const lastCallDiffInDays = computed(() => dayjs().diff(dayjsFromMoscow(props.call), 'days'));
const lastCallIsExpired = computed(
    () => lastCallDiffInDays.value > import.meta.env.VITE_VUE_APP_MESSENGER_DATE_FROM_CALL_WARNING
);

const createdAtFormat = computed(() => toDateFormat(props.createdAt, 'D.MM.YYYY'));
</script>
