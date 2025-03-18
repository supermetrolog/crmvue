import { useAsyncPopup } from '@/composables/useAsyncPopup.js';
import { useStore } from 'vuex';

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
            title = null,
            start = null,
            end = null,
            step = TASK_FORM_STEPS.USER,
            focusMessage = false,
            customDescription = false,
            additionalContent = {},
            callPresets = false
        } = template;

        return show({
            message,
            title,
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
