<template>
    <MessengerQuizQuestionTemplateDefault
        ref="questionElement"
        :question
        :disabled
        :ignored-effects="ignoredEffects"
        class="messenger-quiz__question"
    >
        <template #after-content="{ mainAnswer }">
            <MessengerQuizFormCustomEquipments v-show="mainAnswer" ref="equipmentsEl" />
        </template>
    </MessengerQuizQuestionTemplateDefault>
</template>
<script setup>
import { useTemplateRef } from 'vue';
import MessengerQuizQuestionTemplateDefault from '@/components/Messenger/Quiz/Question/Template/MessengerQuizQuestionTemplateDefault.vue';
import MessengerQuizFormCustomEquipments from '@/components/Messenger/Quiz/Form/Custom/MessengerQuizFormCustomEquipments.vue';
import { quizEffectKinds } from '@/const/quiz.js';
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
    quizEffectKinds.HAS_EQUIPMENTS_OFFERS,
    quizEffectKinds.HAS_EQUIPMENTS_OFFERS_DESCRIPTION,
    quizEffectKinds.HAS_EQUIPMENTS_REQUESTS,
    quizEffectKinds.HAS_EQUIPMENTS_REQUESTS_DESCRIPTION
]);

// form

const templateRef = useTemplateRef('questionElement');
const equipmentsEl = useTemplateRef('equipmentsEl');

function getForm() {
    const form = templateRef.value.getForm();

    const mainAnswer = form.find(answer => answer.type === 'main');

    if (mainAnswer && mainAnswer.value) {
        const equipmentsForm = equipmentsEl.value.getForm();

        if (equipmentsForm.hasOffers) {
            const offersAnswer = form.find(answer =>
                answer.effects.has(quizEffectKinds.HAS_EQUIPMENTS_OFFERS)
            );

            if (offersAnswer) offersAnswer.value = true;

            const offersAnswerDescription = form.find(answer =>
                answer.effects.has(quizEffectKinds.HAS_EQUIPMENTS_OFFERS_DESCRIPTION)
            );

            if (offersAnswerDescription)
                offersAnswerDescription.value = equipmentsForm.offersDescription;
        }

        if (equipmentsForm.hasRequests) {
            const requestsAnswer = form.find(answer =>
                answer.effects.has(quizEffectKinds.HAS_EQUIPMENTS_REQUESTS)
            );

            if (requestsAnswer) requestsAnswer.value = true;

            const requestsAnswerDescription = form.find(answer =>
                answer.effects.has(quizEffectKinds.HAS_EQUIPMENTS_REQUESTS_DESCRIPTION)
            );

            if (requestsAnswerDescription)
                requestsAnswerDescription.value = equipmentsForm.requestsDescription;
        }
    }

    return form;
}

function validate(withNotify = true) {
    const isValid = templateRef.value.validate(withNotify);
    if (!isValid) return false;

    const mainAnswer = templateRef.value.getMainAnswer();

    if (mainAnswer === true) {
        return equipmentsEl.value.validate();
    }

    return true;
}

function setForm(form) {
    templateRef.value.setForm(form);

    if (isNotNullish(form.main?.value) && form.tab?.length) {
        const offersAnswer = form.tab.find(answer =>
            answer.effects.has(quizEffectKinds.HAS_EQUIPMENTS_OFFERS)
        );

        if (offersAnswer && offersAnswer.value) {
            equipmentsEl.value.setOffersValue(true);

            const offersAnswerDescription = form['text-answer'].find(answer =>
                answer.effects.has(quizEffectKinds.HAS_EQUIPMENTS_OFFERS_DESCRIPTION)
            );

            if (offersAnswerDescription)
                equipmentsEl.value.setOffersDescription(offersAnswerDescription.value);
        }

        const requestsAnswer = form.tab.find(answer =>
            answer.effects.has(quizEffectKinds.HAS_EQUIPMENTS_REQUESTS)
        );

        if (requestsAnswer && requestsAnswer.value) {
            equipmentsEl.value.setRequestsValue(true);

            const requestsAnswerDescription = form['text-answer'].find(answer =>
                answer.effects.has(quizEffectKinds.HAS_EQUIPMENTS_REQUESTS_DESCRIPTION)
            );

            if (requestsAnswerDescription)
                equipmentsEl.value.setRequestsDescription(requestsAnswerDescription.value);
        }
    }
}

defineExpose({ getForm, validate, setForm });
</script>
