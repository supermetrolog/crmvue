<template>
    <div class="messenger-quiz-template">
        <MessengerQuizQuestion
            v-for="question in questions"
            ref="questionEls"
            :key="question.id"
            :question="question"
            class="messenger-quiz__question"
            :can-be-disabled="QUESTION_WITH_ANY_ACTIVE_BODY !== question.id"
            :disabled
        >
            <template
                v-if="question.id === questionWithRequestNoRelevant?.id"
                #description="{ mainAnswer, toggleDisabled, disabled }"
            >
                <MessengerQuizFormRequestsNoRelevantPicker
                    v-model="requestsForm"
                    @set-as-disabled="() => (disabled ? null : toggleDisabled())"
                    :company-id="companyId"
                    :disabled="!mainAnswer"
                />
            </template>
        </MessengerQuizQuestion>
    </div>
</template>
<script setup>
import MessengerQuizQuestion from '@/components/Messenger/Quiz/Question/MessengerQuizQuestion.vue';
import { computed, reactive, toRaw, useTemplateRef } from 'vue';
import { useStore } from 'vuex';
import MessengerQuizFormRequestsNoRelevantPicker from '@/components/Messenger/Quiz/Form/MessengerQuizFormRequestsNoRelevantPicker.vue';
import { quizEffectKinds } from '@/const/quiz.js';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.js';
import { messenger } from '@/const/messenger.js';

const QUESTION_WITH_ANY_ACTIVE_BODY = 6;

const props = defineProps({
    questions: {
        type: Array,
        required: true
    },
    disabled: Boolean
});

const questionEls = useTemplateRef('questionEls');

function getForm() {
    const form = questionEls.value.map(element => element.getForm());

    if (isNotNullish(questionWithRequestNoRelevant.value)) {
        const questionIndex = form.findIndex(element =>
            element.some(
                answer =>
                    answer.question_answer_id ===
                    questionWithRequestNoRelevant.value.answers['text-answer'][0].id
            )
        );

        if (questionIndex !== -1) {
            form[questionIndex].find(
                answer =>
                    answer.question_answer_id ===
                    questionWithRequestNoRelevant.value.answers['text-answer'][0].id
            ).value = toRaw(requestsForm);
        }
    }

    return form.flat();
}

defineExpose({ getForm });

// no relevant requests

const store = useStore();

const companyId = computed(() => {
    if (store.state.Messenger.currentDialog.model_type === messenger.dialogTypes.COMPANY)
        return store.state.Messenger.currentDialog.model.id;

    return (
        store.state.Messenger.currentDialog.model.object.company_id ??
        store.state.Messenger.currentDialog.model.object.company?.id
    );
});

const requestsForm = reactive({ actual: [], archived: [] });

const questionWithRequestNoRelevant = computed(() => {
    return props.questions.find(question => {
        return (
            'text-answer' in question.answers &&
            question.answers['text-answer'].some(element =>
                element.effects.some(
                    effect => effect.kind === quizEffectKinds.REQUESTS_NO_LONGER_RELEVANT
                )
            )
        );
    });
});
</script>
