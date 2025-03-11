<template>
    <div class="messenger-quiz-form-template-offer">
        <div class="messenger-quiz-form-template-offer__row">
            <SurveyQuestionOfferMix
                @show-preview="$emit('show-preview')"
                @object-sold="$emit('object-sold')"
                @object-destroyed="$emit('object-destroyed')"
                :offer-mix="offerMix"
                class="messenger-quiz-form-template-offer__preview"
                :disabled="isDisabled"
            />
            <div class="messenger-quiz-form-template-offer__aside">
                <MessengerQuizFormRadioChip
                    v-model="hasAnswers"
                    unselect
                    :value="1"
                    label="К вопросам"
                />
                <MessengerQuizFormRadioChip
                    v-model="hasAnswers"
                    unselect
                    :value="2"
                    label="Не опросил"
                />
                <MessengerQuizFormRadioChip
                    v-model="hasAnswers"
                    unselect
                    :value="3"
                    label="Без изменений"
                />
            </div>
        </div>
        <AnimationTransition :speed="0.5">
            <AccordionSimple v-if="questionsIsVisible" opened class="mt-1">
                <template #title="{ opened }">
                    <AccordionSimpleTriggerButton
                        v-if="!opened"
                        :label="`Вопросы по предложению #${offerMix.object_id} (${questions.length})`"
                    />
                    <span v-else></span>
                </template>
                <template #body>
                    <div class="messenger-quiz-form-template-offer__questions">
                        <MessengerQuizQuestion
                            v-for="question in questions"
                            :key="question.id"
                            ref="questionEls"
                            :question="question"
                        />
                    </div>
                    <AccordionSimpleTriggerButton
                        class="mt-1"
                        :label="`Скрыть вопросы (${questions.length})`"
                    />
                </template>
            </AccordionSimple>
        </AnimationTransition>
    </div>
</template>
<script setup>
import MessengerQuizQuestion from '@/components/Messenger/Quiz/Question/MessengerQuizQuestion.vue';
import { computed, ref, useTemplateRef } from 'vue';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.js';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import AccordionSimple from '@/components/common/Accordion/AccordionSimple.vue';
import AccordionSimpleTriggerButton from '@/components/common/Accordion/AccordionSimpleTriggerButton.vue';
import MessengerQuizFormRadioChip from '@/components/Messenger/Quiz/Form/MessengerQuizFormRadioChip.vue';
import { useNotify } from '@/utils/use/useNotify.js';
import SurveyQuestionOfferMix from '@/components/Survey/QuestionOfferMix/SurveyQuestionOfferMix.vue';

defineEmits(['show-preview', 'object-sold', 'object-destroyed']);
const props = defineProps({
    questions: {
        type: Array,
        required: true
    },
    disabled: Boolean,
    offerMix: {
        type: Object,
        required: true
    }
});

// questions

const questionEls = useTemplateRef('questionEls');

// form

const hasAnswers = ref(null);

const isDisabled = computed(() => hasAnswers.value === 2 || hasAnswers.value === 3);
const questionsIsVisible = computed(() => hasAnswers.value === 1);

function getForm() {
    const payload = {
        object_id: props.offerMix.object_id,
        offers: props.offerMix.offers.map(offer => ({
            visual_ids: offer.visual_id,
            id: offer.id,
            deal_type: offer.deal_type,
            calc_area: offer.calc_area_general
        })),
        answer: hasAnswers.value
    };

    if (hasAnswers.value === 1) {
        const form = questionEls.value.map(element => element.getForm());
        payload.form = form.filter(isNotNullish).flat();
    }

    return payload;
}

const notify = useNotify();

function validate() {
    if (props.disabled) return true;

    if (hasAnswers.value === 1) {
        const isValid = questionEls.value.every(element => element.validate());

        if (!isValid)
            notify.info(`Заполните все вопросы по предложению #${props.offerMix.object_id}`);

        return isValid;
    }

    const isValid = isNotNullish(hasAnswers.value);

    if (!isValid) notify.info(`Заполните положение по предложению #${props.offerMix.object_id}`);

    return isValid;
}

function setForm(form) {
    // form.forEach((question, key) => {
    //     questionEls.value[key].setForm(question);
    // });
}

function setAnswer(answer) {
    hasAnswers.value = answer;
}

defineExpose({ getForm, validate, setForm, setAnswer });
</script>
