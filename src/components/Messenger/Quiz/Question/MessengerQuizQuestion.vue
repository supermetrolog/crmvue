<template>
    <component
        :is="currentComponent"
        v-bind="$attrs"
        ref="questionElement"
        :question="question"
        :can-be-disabled="canBeDisabled"
        :disabled
        :number
    />
</template>
<script setup>
import { computed, useTemplateRef } from 'vue';
import MessengerQuizQuestionTemplateHasFreeArea from '@/components/Messenger/Quiz/Question/Template/MessengerQuizQuestionTemplateHasFreeArea.vue';
import MessengerQuizQuestionTemplateDefault from '@/components/Messenger/Quiz/Question/Template/MessengerQuizQuestionTemplateDefault.vue';
import MessengerQuizQuestionTemplateCompaniesIdentified from '@/components/Messenger/Quiz/Question/Template/MessengerQuizQuestionTemplateCompaniesIdentified.vue';
import MessengerQuizQuestionTemplateWantsToSell from '@/components/Messenger/Quiz/Question/Template/MessengerQuizQuestionTemplateWantsToSell.vue';
import MessengerQuizQuestionTemplateNewRequestsOrOffers from '@/components/Messenger/Quiz/Question/Template/MessengerQuizQuestionTemplateNewRequestsOrOffers.vue';
import MessengerQuizQuestionTemplateEquipments from '@/components/Messenger/Quiz/Question/Template/MessengerQuizQuestionTemplateEquipments.vue';

const props = defineProps({
    question: {
        type: Object,
        required: true
    },
    number: Number,
    canBeDisabled: {
        type: Boolean,
        default: true
    },
    disabled: Boolean
});

const TEMPLATES = {
    'free-area': MessengerQuizQuestionTemplateHasFreeArea,
    'wants-to-sell': MessengerQuizQuestionTemplateWantsToSell,
    'companies-identified': MessengerQuizQuestionTemplateCompaniesIdentified,
    'new-requests-or-offers': MessengerQuizQuestionTemplateNewRequestsOrOffers,
    equipments: MessengerQuizQuestionTemplateEquipments
};

const currentComponent = computed(() => {
    return TEMPLATES[props.question.template] ?? MessengerQuizQuestionTemplateDefault;
});

// form

const templateRef = useTemplateRef('questionElement');

function getForm() {
    return templateRef.value.getForm();
}

function validate() {
    return templateRef.value.validate();
}

function setForm(form) {
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
