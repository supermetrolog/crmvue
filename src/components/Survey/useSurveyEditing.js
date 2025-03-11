import { computed, toValue } from 'vue';
import dayjs from 'dayjs';
import { dayjsFromMoscow } from '@/utils/formatters/date.js';
import { useAuth } from '@/composables/useAuth.js';

const editTimeLimit = 60 * 12;

export function useSurveyEditing(survey) {
    const { currentUserIsAdmin, currentUserId } = useAuth();

    const remainingTimeInMinutes = computed(() => {
        if (!toValue(survey)) return 0;
        return editTimeLimit - dayjs().diff(dayjsFromMoscow(toValue(survey).created_at), 'minute');
    });

    const remainingTimeLabel = computed(() => {
        if (remainingTimeInMinutes.value <= 0 || currentUserIsAdmin.value) return null;

        if (remainingTimeInMinutes.value < 60) return `${remainingTimeInMinutes.value} мин.`;

        return `${Math.ceil(remainingTimeInMinutes.value / 60)} ч.`;
    });

    const canBeEdit = computed(() => {
        const _survey = toValue(survey);

        return (
            _survey &&
            !_survey.related_survey_id &&
            ((_survey.user_id === currentUserId.value && remainingTimeInMinutes.value > 0) ||
                currentUserIsAdmin.value)
        );
    });

    return { canBeEdit, remainingTimeInMinutes, remainingTimeLabel };
}
