<template>
    <div class="messenger-quiz-template">
        <MessengerQuizFormTemplateAccordion class="mt-2" label="Общие вопросы (2)">
            <MessengerQuizQuestion
                v-for="question in commonGroupQuestions"
                :key="question.id"
                ref="questionEls"
                :question="question"
                :disabled
                class="messenger-quiz__question"
                :can-be-disabled="question.id !== QUESTION_WITH_ANY_ACTIVE_BODY"
            />
        </MessengerQuizFormTemplateAccordion>
        <div class="messenger-quiz-template__groups" :class="{ reversed: isObjectChatMember }">
            <MessengerQuizFormTemplateAccordion class="mt-2" label="Клиентские вопросы (4)">
                <MessengerQuizQuestion
                    v-for="question in companyGroupQuestions"
                    :key="question.id"
                    ref="questionEls"
                    :question="question"
                    :disabled
                    class="messenger-quiz__question"
                    :can-be-disabled="question.id !== QUESTION_WITH_ANY_ACTIVE_BODY"
                    :selectable="isObjectChatMember"
                />
            </MessengerQuizFormTemplateAccordion>
            <MessengerQuizFormTemplateAccordion class="mt-2" label="Вопросы по предложениям (4)">
                <MessengerQuizFormRelationCheckbox v-model="relatedModelValue" />
                <MessengerQuizQuestion
                    v-for="question in objectGroupQuestions"
                    :key="question.id"
                    ref="questionEls"
                    :question="question"
                    :disabled
                    class="messenger-quiz__question"
                    :can-be-disabled="question.id !== QUESTION_WITH_ANY_ACTIVE_BODY"
                    :with-related="relatedModelValue"
                    :selectable="!isObjectChatMember"
                />
            </MessengerQuizFormTemplateAccordion>
        </div>
    </div>
</template>
<script setup>
import MessengerQuizQuestion from '@/components/Messenger/Quiz/Question/MessengerQuizQuestion.vue';
import { computed, useTemplateRef } from 'vue';
import { quizQuestionsGroups } from '@/const/quiz.js';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.js';
import { messenger } from '@/const/messenger.js';
import { useStore } from 'vuex';
import MessengerQuizFormRelationCheckbox from '@/components/Messenger/Quiz/Form/MessengerQuizFormRelationCheckbox.vue';
import MessengerQuizFormTemplateAccordion from '@/components/Messenger/Quiz/Form/MessengerQuizFormTemplateAccordion.vue';

const QUESTION_WITH_ANY_ACTIVE_BODY = 6;

const relatedModelValue = defineModel('related');
const props = defineProps({
    questions: {
        type: Array,
        required: true
    },
    disabled: Boolean
});

// questions

const questionEls = useTemplateRef('questionEls');

const commonGroupQuestions = computed(() =>
    props.questions.filter(question => question.group === quizQuestionsGroups.COMMON)
);

const objectGroupQuestions = computed(() =>
    props.questions.filter(question => question.group === quizQuestionsGroups.OBJECT)
);

const companyGroupQuestions = computed(() =>
    props.questions.filter(question => question.group === quizQuestionsGroups.COMPANY)
);

// chat member

const store = useStore();

const isObjectChatMember = computed(() => {
    return (
        store.state.Messenger.currentDialogType === messenger.dialogTypes.OBJECT &&
        store.state.Messenger.currentDialog.model.type ===
            messenger.objectChatMemberTypes.RENT_OR_SALE
    );
});

// form

const getForm = () => {
    const form = questionEls.value.map(element => element.getForm());

    return form.filter(isNotNullish).flat();
};

function validate() {
    return questionEls.value.every(element => element.validate());
}

function setForm(form) {
    form.forEach((question, key) => {
        questionEls.value[key].setForm(question);
    });
}

defineExpose({ getForm, validate, setForm });
</script>
