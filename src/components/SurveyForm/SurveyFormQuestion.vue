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
import MessengerQuizQuestionTemplateDefault from '@/components/MessengerQuiz/Question/Template/MessengerQuizQuestionTemplateDefault.vue';
import MessengerQuizQuestionTemplateEquipments from '@/components/MessengerQuiz/Question/Template/MessengerQuizQuestionTemplateEquipments.vue';

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
    equipments: MessengerQuizQuestionTemplateEquipments
};

const currentComponent = computed(() => {
    return TEMPLATES[props.question.template] ?? MessengerQuizQuestionTemplateDefault;
});

const templateRef = useTemplateRef('questionElement');

function getForm() {
    return templateRef.value.getForm();
}

function validate(withNotify = true) {
    return templateRef.value.validate(withNotify);
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
