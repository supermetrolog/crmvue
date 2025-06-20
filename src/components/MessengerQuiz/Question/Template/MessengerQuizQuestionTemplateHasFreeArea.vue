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
                v-if="mainAnswer"
                v-model:condition="conditionModelValue"
                @change-hidden="toggleHidden"
                :disabled="mainAnswer !== true"
                :hidden="hidden"
                class="mt-1"
            />
        </template>
    </MessengerQuizQuestionTemplateDefault>
</template>
<script setup>
import { ref, useTemplateRef, watch } from 'vue';
import MessengerQuizQuestionTemplateDefault from '@/components/MessengerQuiz/Question/Template/MessengerQuizQuestionTemplateDefault.vue';
import MessengerQuizFormCustomFreeArea from '@/components/MessengerQuiz/Form/Custom/MessengerQuizFormCustomFreeArea.vue';
import { quizEffectKinds } from '@/const/quiz.js';
import { isNullish } from '@/utils/helpers/common/isNullish.ts';
import { useNotify } from '@/utils/use/useNotify.js';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.js';

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
    quizEffectKinds.OBJECT_FREE_AREA_ALREADY_DESCRIBED,
    quizEffectKinds.OBJECT_FREE_AREA_MUST_BE_EDIT,
    quizEffectKinds.OBJECT_FREE_AREA_MUST_BE_DELETED
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

function validate(withNotify = true) {
    const isValid = templateRef.value.validate(withNotify);
    if (!isValid) return false;

    const mainAnswer = templateRef.value.getMainAnswer();

    if (mainAnswer === true && isNullish(conditionModelValue.value)) {
        if (withNotify)
            notify.info('Укажите, необходимо ли добавить/редактировать свободные площади..');

        return false;
    }

    return true;
}

function setForm(form) {
    if (isNotNullish(form.main?.value) && form.tab?.length) {
        const mustBeEditedAnswer = form.tab.find(answer =>
            answer.effects.has(quizEffectKinds.OBJECT_FREE_AREA_MUST_BE_EDIT)
        );

        if (mustBeEditedAnswer?.value) conditionModelValue.value = 1;

        const alreadyDescribedAnswer = form.tab.find(answer =>
            answer.effects.has(quizEffectKinds.OBJECT_FREE_AREA_ALREADY_DESCRIBED)
        );

        if (alreadyDescribedAnswer?.value) conditionModelValue.value = 0;
    }

    templateRef.value.setForm(form);
}

function setAnswer(value) {
    templateRef.value.setAnswer(value);
}

function resetAnswer() {
    templateRef.value.resetAnswer();
}

defineExpose({ getForm, validate, setForm, setAnswer, resetAnswer });

function injectConditionAnswerToForm(form) {
    if (conditionModelValue.value) {
        const answer = form.find(answer =>
            answer.effects.has(quizEffectKinds.OBJECT_FREE_AREA_MUST_BE_EDIT)
        );

        if (isNullish(answer)) return;

        answer.value = true;
        answer.filled = true;
    } else {
        const answer = form.find(answer =>
            answer.effects.has(quizEffectKinds.OBJECT_FREE_AREA_ALREADY_DESCRIBED)
        );

        if (answer) answer.value = true;
    }
}

function cancelConditionAnswerInForm(form) {
    let answer = form.find(answer =>
        answer.effects.has(quizEffectKinds.OBJECT_FREE_AREA_MUST_BE_EDIT)
    );
    if (answer) answer.value = false;

    answer = form.find(answer =>
        answer.effects.has(quizEffectKinds.OBJECT_FREE_AREA_ALREADY_DESCRIBED)
    );
    if (answer) answer.value = false;
}

watch(conditionModelValue, value => {
    templateRef.value.setCustomCompleted(value === 0);
});
</script>
