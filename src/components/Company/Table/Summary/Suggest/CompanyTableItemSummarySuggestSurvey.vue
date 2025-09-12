<template>
    <div>
        <p v-if="company.has_pending_survey" class="company-table-item-summary__suggest-row active">
            <i class="fa-solid fa-angles-right mr-1"></i>
            <span>Требуется закончить опрос</span>
        </p>
        <p
            v-else-if="lastSurveyIsOutdated || (!company.last_survey && !isRecentlyCreated)"
            class="company-table-item-summary__suggest-row"
            :class="{ active: isCurrentUserCompany }"
        >
            <i class="fa-solid fa-angles-right mr-1"></i>
            <span>Требуется</span>
            <Tippy :delay="200">
                <span
                    v-if="isCurrentUserCompany"
                    @click="$emit('show-survey')"
                    class="company-table-item-summary__suggest-link mx-1"
                >
                    пройти опрос
                </span>
                <span v-else> пройти опрос </span>
                <template #content>
                    <p v-if="isCurrentUserCompany">Перейти к заполнению опроса</p>
                    <p v-else>Вы не являетесь консультантом этой компании</p>
                </template>
            </Tippy>
            <span v-if="company.last_survey && lastSurveyIsOutdated">
                до {{ nextSurveyEndDate }}
            </span>
        </p>
    </div>
</template>

<script setup>
import { useAuth } from '@/composables/useAuth';
import { computed } from 'vue';
import { isNullish } from '@/utils/helpers/common/isNullish.ts';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.ts';
import dayjs from 'dayjs';
import { dayjsFromServer } from '@/utils/formatters/date.ts';
import { Tippy } from 'vue-tippy';

defineEmits(['open-survey']);
const props = defineProps({
    company: {
        type: Object,
        required: true
    }
});

const { currentUserId } = useAuth();

const isCurrentUserCompany = computed(() => props.company.consultant_id === currentUserId.value);

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

const lastSurveyIsOutdated = computed(() => {
    if (isNullish(props.company.last_survey)) return false;

    return (
        dayjs().diff(lastSurveyDate.value, 'day') >=
        import.meta.env.VITE_VUE_APP_MESSENGER_DATE_FROM_CALL_DANGER
    );
});

const nextSurveyEndDate = computed(() => {
    if (isNullish(props.company.last_survey)) return null;

    if (!lastSurveyIsOutdated.value) return null;

    return lastSurveyDate.value
        .add(import.meta.env.VITE_VUE_APP_MESSENGER_DATE_FROM_CALL_DANGER, 'day')
        .add(7, 'day')
        .format('D.MM.YY');
});

const isRecentlyCreated = computed(() => dayjs().diff(dayjs(props.company.created_at), 'day') < 14);
</script>
