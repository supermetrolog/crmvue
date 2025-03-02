<template>
    <component
        :is="currentComponent"
        v-bind="$attrs"
        ref="questionElement"
        v-model:selected="isSelected"
        :question="question"
        :can-be-disabled="canBeDisabled"
        :with-related="withRelated"
        :selectable
        :disabled="disabled || (selectable && !isSelected)"
    />
</template>
<script setup>
import { computed, ref, useTemplateRef } from 'vue';
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
    withRelated: Boolean,
    selectable: Boolean,
    disabled: Boolean
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

const isSelected = ref(false);

// form

const templateRef = useTemplateRef('questionElement');

function getForm() {
    if (!props.selectable || isSelected.value) return templateRef.value.getForm();
    return null;
}

function validate() {
    if (!props.selectable || isSelected.value) return templateRef.value.validate();

    return true;
}

function setForm(form) {
    templateRef.value.setForm(form);
}

defineExpose({ getForm, validate, setForm });
</script>
