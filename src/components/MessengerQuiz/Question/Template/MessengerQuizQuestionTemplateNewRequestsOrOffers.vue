<template>
    <MessengerQuizQuestionTemplateDefault
        ref="questionElement"
        :question
        :disabled
        class="messenger-quiz__question"
    >
        <template #after-content="{ mainAnswer }">
            <div v-if="mainAnswer === true" class="mt-1">
                <MessengerQuizFormCustomNewOffers v-model="offers" />
                <MessengerQuizFormCustomNewRequests v-model="requests" class="mt-2" />
            </div>
        </template>
    </MessengerQuizQuestionTemplateDefault>
</template>
<script setup>
import { ref, useTemplateRef } from 'vue';
import MessengerQuizQuestionTemplateDefault from '@/components/MessengerQuiz/Question/Template/MessengerQuizQuestionTemplateDefault.vue';
import { quizEffectKinds } from '@/const/quiz.js';
import { useNotify } from '@/utils/use/useNotify.js';
import MessengerQuizFormCustomNewOffers from '@/components/MessengerQuiz/Form/Custom/MessengerQuizFormCustomNewOffers.vue';
import MessengerQuizFormCustomNewRequests from '@/components/MessengerQuiz/Form/Custom/MessengerQuizFormCustomNewRequests.vue';

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

const offers = ref([]);
const requests = ref([]);

// form

const templateRef = useTemplateRef('questionElement');

function getForm() {
    const form = templateRef.value.getForm();

    const mainAnswer = form.find(answer => answer.type === 'main');

    if (mainAnswer && mainAnswer.value) {
        if (offers.value.length) {
            const offersAnswer = form.find(answer =>
                answer.effects.has(quizEffectKinds.HAS_NEW_OFFERS)
            );

            if (offersAnswer) {
                offersAnswer.value = offers.value.map(offer => ({
                    deal_type: offer.deal_type,
                    description: offer.description
                }));
            }
        }

        if (requests.value.length) {
            const requestsAnswer = form.find(answer =>
                answer.effects.has(quizEffectKinds.HAS_NEW_REQUESTS)
            );

            if (requestsAnswer) {
                requestsAnswer.value = requests.value.map(request => ({
                    deal_type: request.deal_type,
                    description: request.description
                }));
            }
        }
    }

    return form;
}

const notify = useNotify();

function validate(withNotify = true) {
    const isValid = templateRef.value.validate(withNotify);
    if (!isValid) return false;

    const mainAnswer = templateRef.value.getMainAnswer();

    if (mainAnswer === true && !offers.value.length && !requests.value.length) {
        if (withNotify) notify.info('Укажите новые предложения или запросы..');

        return false;
    }

    return true;
}

function setForm(form) {
    if (form.main?.value) {
        const offersForm = form.custom.find(answer =>
            answer.effects.has(quizEffectKinds.HAS_NEW_OFFERS)
        );

        if (offersForm) {
            offers.value = offersForm.value ?? [];
        }

        const requestsForm = form.custom.find(answer =>
            answer.effects.has(quizEffectKinds.HAS_NEW_REQUESTS)
        );

        if (requestsForm) {
            requests.value = requestsForm.value ?? [];
        }
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
</script>
