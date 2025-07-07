<template>
    <template v-if="company.last_call">
        <UiButton
            v-if="company.active_contacts_count === 0"
            @click="$emit('to-chat')"
            color="warning-light"
            icon="fa-solid fa-users-slash"
            tooltip="К компании не прикреплен активный контакт. Нажмите, чтобы перейти в чат компании."
            class="fs-2 w-100"
            small
            center
        >
            Нет контактов
        </UiButton>
        <template v-else-if="isCurrentUserCompany">
            <UiButton
                v-if="!lastCallHasCompleteStatus"
                @click="$emit('to-survey')"
                icon="fa-solid fa-phone-slash"
                :tooltip="lastCallTooltip"
                small
                class="fs-2 w-100"
                center
                color="dark"
            >
                Не дозвонились
            </UiButton>
            <UiButton
                v-else-if="lastSurveyIsExpired"
                @click="$emit('to-survey')"
                :style="{ 'background-color': surveyColor }"
                icon="fa-solid fa-triangle-exclamation"
                :tooltip="surveyTooltip"
                small
                class="fs-2 w-100 font-weight-semi"
                center
            >
                {{ lastSurveyIsOutdated ? 'Пройдите опрос!' : 'Пройти опрос!' }}
            </UiButton>
        </template>
        <UiButton
            v-else
            @click="$emit('to-chat')"
            icon="fa-solid fa-comments"
            color="success-light"
            :tooltip="surveyTooltip"
            small
            class="fs-2 w-100"
            center
        >
            Перейти в чат
        </UiButton>
    </template>
    <UiButton
        v-else-if="isRecentlyCreated"
        @click="$emit('to-chat')"
        tooltip="Компания недавно добавлена в систему. Нажмите, чтобы перейти в чат компании."
        class="offer-table-item-call__chip"
    >
        Новая компания
    </UiButton>
    <UiButton
        v-else-if="company.active_contacts_count === 0"
        @click="$emit('to-chat')"
        color="warning-light"
        icon="fa-solid fa-users-slash"
        tooltip="К компании не прикреплен активный контакт. Нажмите, чтобы перейти в чат компании."
        class="fs-2 w-100"
        small
        center
    >
        Нет контактов
    </UiButton>
    <UiButton
        v-else-if="companyOutdated && isCurrentUserCompany"
        @click="$emit('to-survey')"
        style="background-color: #fe6a49"
        icon="fa-solid fa-triangle-exclamation"
        tooltip="По компании еще не было зафиксированных звонков. Нажмите, чтобы перейти к опросу и обновить информацию."
        small
        class="fs-2 w-100 font-weight-semi"
        center
    >
        Пройти опрос!
    </UiButton>
    <UiButton
        v-else
        @click="$emit('to-chat')"
        icon="fa-solid fa-comments"
        color="success-light"
        tooltip="Нажмите, чтобы перейти в чат компании."
        small
        class="fs-2 w-100"
        center
    >
        Перейти в чат
    </UiButton>
</template>

<script setup>
import { computed } from 'vue';
import UiButton from '@/components/common/UI/UiButton.vue';
import dayjs from 'dayjs';
import { dayjsFromMoscow, toDateFormat } from '@/utils/formatters/date.js';
import { CALL_STATUSES } from '@/components/MessengerQuiz/useMessengerQuiz.js';
import { isNullish } from '@/utils/helpers/common/isNullish';
import { useAuth } from '@/composables/useAuth.js';

defineEmits(['to-chat', 'to-survey']);

const props = defineProps({
    company: {
        type: Object,
        required: true
    }
});

const lastSurvey = computed(() => props.company.last_survey);

const { currentUserId } = useAuth();

const isCurrentUserCompany = computed(() => props.company.consultant_id === currentUserId.value);

const lastSurveyDate = computed(() => dayjsFromMoscow(lastSurvey.value.completed_at));

const SURVEY_TASK_DELAY = 7; // days

const lastSurveyIsOutdated = computed(() => {
    if (isNullish(lastSurvey.value)) return false;

    return (
        dayjs().diff(lastSurveyDate.value, 'day') >
        import.meta.env.VITE_VUE_APP_MESSENGER_DATE_FROM_CALL_DANGER + SURVEY_TASK_DELAY
    );
});

const lastSurveyIsExpired = computed(() => {
    if (isNullish(lastSurvey.value)) return false;

    return (
        dayjs().diff(lastSurveyDate.value, 'day') >
        import.meta.env.VITE_VUE_APP_MESSENGER_DATE_FROM_CALL_DANGER
    );
});

const surveyColor = computed(() => {
    if (lastSurveyIsOutdated.value) return '#810303';
    return '#FE6A49';
});

const surveyTooltip = computed(() => {
    if (lastSurveyIsExpired.value && isCurrentUserCompany.value) {
        return `Дата последнего опроса - ${toDateFormat(lastSurveyDate.value)}. Нажмите, чтобы перейти к опросу и обновить информацию.`;
    }

    return `Дата последнего опроса - ${toDateFormat(lastSurveyDate.value)}. Нажмите, чтобы перейти в чат компании.`;
});

const isRecentlyCreated = computed(() => dayjs().diff(dayjs(props.company.created_at), 'day') < 7);

const lastCallTooltip = computed(() => {
    return `Дата последнего звонка - ${toDateFormat(props.company.last_call.created_at)}. Нажмите, чтобы перейти в чат компании`;
});

const lastCallHasCompleteStatus = computed(() => {
    if (isNullish(props.company.last_call)) return false;
    return props.company.last_call.status === CALL_STATUSES.COMPLETED;
});

const companyOutdated = computed(() => {
    return dayjs().diff(dayjsFromMoscow(props.company.created_at), 'day') >= 30;
});
</script>
