<template>
    <component
        :is="currentComponent"
        v-bind="$attrs"
        ref="questionElement"
        :question="question"
        :can-be-disabled="canBeDisabled"
        :with-related="withRelated"
    />
</template>
<script setup>
import { computed, useTemplateRef } from 'vue';
import MessengerQuizQuestionTemplateHasFreeArea from '@/components/Messenger/Quiz/Question/Template/HasFreeArea/MessengerQuizQuestionTemplateHasFreeArea.vue';
import MessengerQuizQuestionTemplateDefault from '@/components/Messenger/Quiz/Question/Template/MessengerQuizQuestionTemplateDefault.vue';
import MessengerQuizQuestionTemplateCompaniesIdentified from '@/components/Messenger/Quiz/Question/Template/CompaniesIdentified/MessengerQuizQuestionTemplateCompaniesIdentified.vue';
import MessengerQuizQuestionTemplateRequestsNoRelevant from '@/components/Messenger/Quiz/Question/Template/RequestsNoRelevant/MessengerQuizQuestionTemplateRequestsNoRelevant.vue';
import MessengerQuizQuestionTemplateWantsToSell from '@/components/Messenger/Quiz/Question/Template/WantsToSell/MessengerQuizQuestionTemplateWantsToSell.vue';

const props = defineProps({
    question: {
        type: Object,
        required: true
    },
    canBeDisabled: Boolean,
    withRelated: Boolean
});

const TEMPLATES = {
    'free-area': MessengerQuizQuestionTemplateHasFreeArea,
    'companies-identified': MessengerQuizQuestionTemplateCompaniesIdentified,
    'requests-no-relevant': MessengerQuizQuestionTemplateRequestsNoRelevant,
    'wants-to-sell': MessengerQuizQuestionTemplateWantsToSell
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

defineExpose({ getForm, validate, setForm });
</script>
