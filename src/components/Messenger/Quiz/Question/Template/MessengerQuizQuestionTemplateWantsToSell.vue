<template>
    <MessengerQuizQuestionTemplateDefault
        ref="questionElement"
        :question
        :disabled
        :ignored-effects="ignoredEffects"
        class="messenger-quiz__question"
    >
        <template #before-additions="{ mainAnswer, hidden, toggleHidden }">
            <MessengerQuizFormCustomFreeArea
                v-model:condition="conditionModelValue"
                @change-hidden="toggleHidden"
                :disabled="mainAnswer !== true"
                :hidden="hidden"
                :class="{ 'mb-2': mainAnswer }"
            />
        </template>
    </MessengerQuizQuestionTemplateDefault>
</template>
<script setup>
import { ref, useTemplateRef, watch } from 'vue';
import MessengerQuizQuestionTemplateDefault from '@/components/Messenger/Quiz/Question/Template/MessengerQuizQuestionTemplateDefault.vue';
import MessengerQuizFormCustomFreeArea from '@/components/Messenger/Quiz/Form/Custom/MessengerQuizFormCustomFreeArea.vue';
import { quizEffectKinds } from '@/const/quiz.js';
import { isNullish } from '@/utils/helpers/common/isNullish.js';
import { useNotify } from '@/utils/use/useNotify.js';

defineProps({
    question: {
        type: Object,
        required: true
    },
    canBeDisabled: {
        type: Boolean,
        default: true
    },
    disabled: Boolean
});

const ignoredEffects = new Set([
    quizEffectKinds.COMPANY_WANTS_TO_SELL_MUST_BE_EDITED,
    quizEffectKinds.COMPANY_WANTS_TO_SELL_ALREADY_DESCRIBED
]);

const conditionModelValue = ref(null);

// form

const templateRef = useTemplateRef('questionElement');

function getForm() {
    const form = templateRef.value.getForm();

    const mainAnswer = form.find(answer => answer.type === 'main');

    if (mainAnswer) {
        if (mainAnswer.value === true) {
            injectConditionAnswerToForm(form);
        } else {
            cancelConditionAnswerInForm(form);
        }
    }

    return form;
}

const notify = useNotify();

function validate() {
    const isValid = templateRef.value.validate();
    if (!isValid) return false;

    const mainAnswer = templateRef.value.getMainAnswer();

    if (mainAnswer === true && isNullish(conditionModelValue.value)) {
        notify.info('Укажите, необходимо ли добавить/редактировать площади под продажу..');
        return false;
    }

    return true;
}

defineExpose({ getForm, validate });

// injection

function injectConditionAnswerToForm(form) {
    if (conditionModelValue.value) {
        const answer = form.find(answer =>
            answer.effects.has(quizEffectKinds.COMPANY_WANTS_TO_SELL_MUST_BE_EDITED)
        );
        if (answer) answer.value = true;
    } else {
        const answer = form.find(answer =>
            answer.effects.has(quizEffectKinds.COMPANY_WANTS_TO_SELL_ALREADY_DESCRIBED)
        );
        if (answer) answer.value = true;
    }
}

function cancelConditionAnswerInForm(form) {
    let answer = form.find(answer =>
        answer.effects.has(quizEffectKinds.COMPANY_WANTS_TO_SELL_MUST_BE_EDITED)
    );
    if (answer) answer.value = false;

    answer = form.find(answer =>
        answer.effects.has(quizEffectKinds.COMPANY_WANTS_TO_SELL_ALREADY_DESCRIBED)
    );
    if (answer) answer.value = false;
}

watch(conditionModelValue, value => {
    templateRef.value.setCustomCompleted(value === 0);
});
</script>
