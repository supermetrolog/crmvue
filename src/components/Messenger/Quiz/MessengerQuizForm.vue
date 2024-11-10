<template>
    <div class="messenger-quiz__content">
        <Loader v-if="isLoading" />
        <component
            :is="currentTemplateComponent"
            v-else
            ref="quizForm"
            :questions="filteredQuestions"
        />
    </div>
</template>
<script setup>
import { useStore } from 'vuex';
import MessengerQuizFormObjectTemplate from '@/components/Messenger/Quiz/MessengerQuizFormObjectTemplate.vue';
import MessengerQuizFormCompanyTemplate from '@/components/Messenger/Quiz/MessengerQuizFormCompanyTemplate.vue';
import { computed, onMounted, ref, useTemplateRef } from 'vue';
import Loader from '@/components/common/Loader.vue';
import { quizQuestionsGroups } from '@/const/quiz.js';
import { messenger } from '@/const/messenger.js';

const TEMPLATES = {
    object: MessengerQuizFormObjectTemplate,
    company: MessengerQuizFormCompanyTemplate,
    request: MessengerQuizFormObjectTemplate
};

const store = useStore();
const quizForm = useTemplateRef('quizForm');

const isLoading = ref(false);

const currentTemplateComponent = computed(() => TEMPLATES[store.state.Messenger.currentDialogType]);

const currentQuestionGroup = computed(() => {
    if (store.state.Messenger.currentDialogType === messenger.dialogTypes.COMPANY) {
        return quizQuestionsGroups.COMPANY;
    }

    if (store.state.Messenger.currentDialogType === messenger.dialogTypes.REQUEST) {
        return quizQuestionsGroups.COMPANY;
    }

    if (
        store.state.Messenger.currentDialog.model.type ===
        messenger.objectChatMemberTypes.RENT_OR_SALE
    ) {
        return quizQuestionsGroups.OBJECT;
    }

    return quizQuestionsGroups.COMPANY;
});

const questions = computed(() => store.state.Quizz.questions);

const filteredQuestions = computed(() =>
    questions.value.filter(question => question.group === currentQuestionGroup.value)
);

const fetchQuestions = async () => {
    isLoading.value = true;
    await store.dispatch('fetchQuestions');
    isLoading.value = false;
};

onMounted(() => {
    if (!questions.value?.length) fetchQuestions();
});

const getForm = () => {
    return quizForm.value?.getForm();
};

defineExpose({
    getForm
});
</script>
