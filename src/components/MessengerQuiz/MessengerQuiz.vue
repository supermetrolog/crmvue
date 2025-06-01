<template>
    <div class="messenger-quiz messenger-chat__content"></div>
</template>
<script setup>
import { computed, reactive, ref } from 'vue';
import { useNotify } from '@/utils/use/useNotify.js';

import { useMessengerQuiz } from '@/components/MessengerQuiz/useMessengerQuiz.js';

const notify = useNotify();

const isLoading = ref(false);
const loaders = reactive({
    surveyCreating: false,
    messageSearching: false,
    messageCreating: false,
    tasksCreating: false,
    callsCreating: false,
    relationCreating: false,
    companySurveyCreating: false
});

const loadingLabels = {
    surveyCreating: 'Сохранение результатов опроса..',
    messageSearching: 'Поиск сообщений в чате..',
    messageCreating: 'Отправка сообщений в чат..',
    tasksCreating: 'Создание задач..',
    callsCreating: 'Фиксация звонков..',
    relationCreating: 'Сохранение связанных опросов..',
    companySurveyCreating: 'Сохранение опроса компании..'
};

const currentLoadingLabel = computed(() => {
    const keys = Object.keys(loaders).filter(key => loaders[key]);

    if (keys.length) return loadingLabels[keys[0]];

    return 'Загрузка результатов..';
});

const { createPotentialTasks, createCallsWithContacts, sendMessageAboutSurveyIsUnavailable } =
    useMessengerQuiz();

async function send() {
    if (!isCanceled) {
    } else {
        isLoading.value = true;

        try {
            loaders.callsCreating = true;
            await createCallsWithContacts(selectedContacts.value, targetChatMemberId);
            loaders.callsCreating = false;

            loaders.messageCreating = true;
            const createdMessage = await sendMessageAboutSurveyIsUnavailable(
                targetChatMemberId,
                selectedContacts.value
            );
            loaders.messageCreating = false;

            loaders.tasksCreating = true;
            await createPotentialTasks(selectedContacts.value, createdMessage.id);
            loaders.tasksCreating = false;
        } catch (error) {
            loaders.messageCreating = false;
            loaders.tasksCreating = false;
            loaders.callsCreating = false;
        }

        isLoading.value = false;
    }

    notify.success('Задачи и звонки успешно созданы..');
}
</script>
