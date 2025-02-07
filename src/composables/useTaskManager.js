import { useAsyncPopup } from '@/composables/useAsyncPopup.js';
import { useStore } from 'vuex';
import dayjs from 'dayjs';

const DEFAULT_TASK_DURATION = 5; // days
export const TASK_FORM_STEPS = {
    USER: 0,
    DATE: 1,
    MESSAGE: 2,
    OBSERVERS: 3
};

export function useTaskManager() {
    const { show } = useAsyncPopup('taskCreator');
    const store = useStore();

    async function createTaskWithTemplate(template = {}) {
        const {
            tags = [],
            user_id = store.getters?.moderator?.id,
            observers = [],
            message = null,
            start = dayjs().toDate(),
            end = dayjs().add(DEFAULT_TASK_DURATION, 'day').toDate(),
            step = TASK_FORM_STEPS.USER,
            focusMessage = false,
            customDescription = true,
            additionalContent = {},
            callPresets = false
        } = template;

        return show({
            message,
            end,
            start,
            user_id,
            tags,
            observers,
            step,
            focusMessage,
            customDescription,
            additionalContent,
            callPresets
        });
    }

    return {
        open: show,
        createTaskWithTemplate
    };
}
