<template>
    <UiButton
        @click="select"
        :color
        class="fs-2 company-table-item-summary-survey__tab company-table-item-summary-survey__tab-survey"
        small
        :class="colorClass"
    >
        <div v-if="company.has_pending_survey" class="d-flex gap-1 align-items-center">
            <span>{{ pendingSurveyStatusLabel }}</span>
            <span>|</span>
            <i class="fa-regular fa-pause-circle fs-4" />
        </div>
        <div v-else-if="company.last_survey" class="d-flex gap-1 align-items-center">
            <Avatar
                :src="company.last_survey.user.userProfile.avatar"
                :size="26"
                :label="company.last_survey.user.userProfile.short_name"
            />
            <span>Опрос от {{ lastSurveyDateFormatted }}</span>
            <span>|</span>
            <template v-if="lastSurveyHasCompleteStatus">
                <template v-if="lastSurveyIsOutdated">
                    <i class="fa-solid fa-exclamation-circle fs-4" />
                    <span>Требуется звонок</span>
                </template>
                <i v-else class="fa-regular fa-smile fs-4" />
            </template>
            <template v-else>
                <i class="fa-solid fa-phone-slash fs-4" />
                <span>Не дозвонились</span>
            </template>
        </div>
        <div v-else class="d-flex gap-1 align-items-center">
            <span>Нет опросов</span>
            <span>|</span>
            <template v-if="isRecentlyCreated">Новая компания</template>
            <template v-else-if="company.active_contacts_count === 0">
                <i class="fa-solid fa-users-slash fs-4" />
                <span>Нет контактов</span>
            </template>
            <template v-else>
                <i class="fa-solid fa-exclamation-circle fs-4" />
                <span>Требуется звонок</span>
            </template>
        </div>
    </UiButton>
</template>

<script setup>
import UiButton from '@/components/common/UI/UiButton.vue';
import { computed } from 'vue';
import { SurveyStatusEnum } from '@/types/survey';
import { dayjsFromServer, toDateFormat } from '@/utils/formatters/date.ts';
import { isNullish } from '@/utils/helpers/common/isNullish';
import dayjs from 'dayjs';
import Avatar from '@/components/common/Avatar.vue';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish';

const emit = defineEmits(['to-survey']);

const modelValue = defineModel();

const props = defineProps({
    company: {
        type: Object,
        required: true
    },
    name: {
        type: String,
        required: true
    }
});

const isSelected = computed(() => modelValue.value === props.name);

const color = computed(() => {
    if (isSelected.value) return 'gray-light';
    return 'transparent';
});

const pendingSurveyStatusLabel = computed(() => {
    if (props.company.pending_survey_status === SurveyStatusEnum.DRAFT) return 'Опрос не завершен';
    return 'Опрос на паузе';
});

const lastSurveyDate = computed(() => {
    if (isNullish(props.company.last_survey)) return null;

    if (isNotNullish(props.company.last_survey.completed_at)) {
        return dayjs.max(
            dayjsFromServer(props.company.last_survey.completed_at),
            dayjsFromServer(props.company.last_survey.updated_at)
        );
    }

    return dayjsFromServer(props.company.last_survey.updated_at);
});

const lastSurveyDateFormatted = computed(() => toDateFormat(lastSurveyDate.value, 'DD.MM.YYYY'));

const lastSurveyHasCompleteStatus = computed(() => {
    if (isNullish(props.company.last_survey)) return false;
    return props.company.last_survey.status === SurveyStatusEnum.COMPLETED;
});

const lastSurveyIsOutdated = computed(() => {
    if (isNullish(props.company.last_survey)) return false;

    return (
        dayjs().diff(lastSurveyDate.value, 'day') >
        import.meta.env.VITE_VUE_APP_MESSENGER_DATE_FROM_CALL_DANGER
    );
});

const isRecentlyCreated = computed(() => dayjs().diff(dayjs(props.company.created_at), 'day') < 14);

const colorClass = computed(() => {
    if (props.company.has_pending_survey) return 'pending';
    if (props.company.last_survey) {
        if (lastSurveyHasCompleteStatus.value) {
            if (lastSurveyIsOutdated.value) return 'outdated';
            return 'success';
        }

        return 'passive';
    }

    if (isRecentlyCreated.value) return undefined;
    if (props.company.active_contacts_count === 0) return 'passive';
    return 'outdated';
});

function select() {
    if (isSelected.value) {
        emit('to-survey');
    } else {
        modelValue.value = props.name;
    }
}
</script>
