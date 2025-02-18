<template>
    <MessengerQuizQuestionTemplateDefault
        ref="questionElement"
        :question
        :disabled
        class="messenger-quiz__question"
        :can-be-hidden="false"
    >
        <template #description="{ mainAnswer, setMainAnswer, toggleDisabled, disabled }">
            <MessengerQuizFormRequestsNoRelevantPicker
                ref="pickerElement"
                v-model="requestsForm"
                @set-as-disabled="
                    () => {
                        if (!disabled) {
                            toggleDisabled();
                            setMainAnswer(false);
                        }
                    }
                "
                :company-id="companyId"
                :disabled="!mainAnswer"
            />
        </template>
    </MessengerQuizQuestionTemplateDefault>
</template>
<script setup>
import { computed, reactive, toRaw, useTemplateRef } from 'vue';
import { quizEffectKinds } from '@/const/quiz.js';
import MessengerQuizQuestionTemplateDefault from '@/components/Messenger/Quiz/Question/Template/MessengerQuizQuestionTemplateDefault.vue';
import MessengerQuizFormRequestsNoRelevantPicker from '@/components/Messenger/Quiz/Form/MessengerQuizFormRequestsNoRelevantPicker.vue';
import { useStore } from 'vuex';
import { messenger } from '@/const/messenger.js';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.js';
import { isArray } from '@/utils/helpers/array/isArray.js';

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

// form

const templateRef = useTemplateRef('questionElement');

function getForm() {
    const form = templateRef.value.getForm();

    const mainAnswer = form.find(answer => answer.type === 'main');

    if (mainAnswer && isNotNullish(mainAnswer.value)) {
        const answer = form.find(answer =>
            answer.effects.has(quizEffectKinds.REQUESTS_NO_LONGER_RELEVANT)
        );
        if (answer) answer.value = toRaw(requestsForm);
    }

    return form;
}

function validate() {
    return templateRef.value.validate();
}

const pickerElement = useTemplateRef('pickerElement');

function setForm(form) {
    const requestsAnswer = form['text-answer'].find(answer =>
        answer.effects.has(quizEffectKinds.REQUESTS_NO_LONGER_RELEVANT)
    );

    if (
        requestsAnswer &&
        isNotNullish(requestsAnswer.value) &&
        (isArray(requestsAnswer.value?.actual) || isArray(requestsAnswer.value?.archived))
    ) {
        pickerElement.value.setValue(requestsAnswer.value);
    }

    templateRef.value.setForm(form);
}

defineExpose({ getForm, validate, setForm });
</script>
