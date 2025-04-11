<template>
    <div class="messenger-quiz-form-template-offer">
        <div class="messenger-quiz-form-template-offer__row">
            <SurveyQuestionObject
                @show-preview="$emit('show-preview')"
                @object-sold="$emit('object-sold')"
                @object-destroyed="$emit('object-destroyed')"
                @click="openModal"
                :object
                class="messenger-quiz-form-template-offer__preview"
                :class="{ passive: isPassive, active: isActive }"
            />
            <div class="messenger-quiz-form-template-offer__aside">
                <MessengerQuizFormRadioChip
                    v-if="modelValue === 1"
                    @click.prevent="openModal"
                    unselect
                    :value="1"
                    class="dashboard-bg-success text-white"
                    label="Опросил"
                >
                    <div class="d-flex align-items-center justify-content-center gap-2">
                        <i class="fa-solid fa-check fs-3" />
                        <span>Опросил</span>
                    </div>
                </MessengerQuizFormRadioChip>
                <MessengerQuizFormRadioChip
                    v-else
                    v-model="modelValue"
                    @click.prevent="openModal"
                    unselect
                    :value="1"
                    label="К вопросам"
                />
                <MessengerQuizFormRadioChip
                    v-model="modelValue"
                    unselect
                    :value="2"
                    label="Не опросил"
                    class="messenger-quiz-question__no-answer"
                />
                <MessengerQuizFormRadioChip
                    v-model="modelValue"
                    unselect
                    :value="3"
                    label="Без изменений"
                />
            </div>
        </div>
    </div>
</template>
<script setup>
import { computed, watch } from 'vue';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.js';
import MessengerQuizFormRadioChip from '@/components/Messenger/Quiz/Form/MessengerQuizFormRadioChip.vue';
import { useNotify } from '@/utils/use/useNotify.js';
import SurveyQuestionObject from '@/components/Survey/QuestionOfferMix/SurveyQuestionObject.vue';

const modelValue = defineModel();

const emit = defineEmits([
    'show-preview',
    'object-sold',
    'object-destroyed',
    'changed',
    'show-questions'
]);

const props = defineProps({
    questions: {
        type: Array,
        required: true
    },
    disabled: Boolean,
    object: {
        type: Object,
        required: true
    }
});

// form
const isActive = computed(() => modelValue.value === 1 || modelValue.value === 3);
const isPassive = computed(() => modelValue.value === 2);

function getForm() {
    return {
        object_id: props.object.id,
        offers: props.object.offerMix.map(offer => ({
            id: offer.id,
            deal_type: offer.deal_type,
            calc_area: offer.calc_area_general
        })),
        answer: modelValue.value
    };
}

const notify = useNotify();

function validate() {
    if (props.disabled) return true;

    const isValid = isNotNullish(modelValue.value);

    if (!isValid) notify.info(`Заполните положение по предложению #${props.object.id}`);

    return isValid;
}

function setForm() {}

function setAnswer(answer) {
    modelValue.value = answer;
}

function checkHasAnswer() {
    return isNotNullish(modelValue.value);
}

function getAnswer() {
    return modelValue.value;
}

function getObjectId() {
    return props.object.id;
}

defineExpose({
    getForm,
    validate,
    setForm,
    setAnswer,
    hasAnswer: checkHasAnswer,
    getAnswer,
    getObjectId
});

// questions

watch(modelValue, value => {
    emit('changed', value);
});

function openModal() {
    emit('show-questions');
}
</script>
