<template>
    <div class="survey-form-contact-form-call">
        <p class="text-grey fs-2 mb-1">Новый звонок</p>
        <div class="survey-form-contact-form-call__question">
            <span class="survey-form-contact-form-call__question-text">Дозвонились?</span>
            <div class="d-flex gap-1">
                <MessengerQuizFormRadioChip
                    v-model="available"
                    :value="true"
                    unselect
                    label="Да"
                    class="survey-form-contact-form-call__answer"
                />
                <MessengerQuizFormRadioChip
                    v-model="available"
                    :value="false"
                    unselect
                    label="Нет"
                    class="survey-form-contact-form-call__answer"
                />
            </div>
        </div>
        <div v-if="hasAnyAnswer" class="mt-2">
            <p class="form__label">Положение по звонку<span class="text-danger">*</span></p>
            <RadioOptions
                v-model="reason"
                :v="v$.reason"
                required
                unselect
                :options="available ? availableReasonOptions : unavailableReasonOptions"
                :rounded="false"
                class="messenger-quiz-question-call__radio mb-2"
                :disabled="!hasAnyAnswer"
            >
                <template #after-options>
                    <MessengerQuizQuestionCallSchedule
                        @click="onClickSchedule"
                        :active="callOptionIsActive"
                        class="messenger-quiz-question-call__schedule"
                    />
                </template>
            </RadioOptions>
            <AnimationTransition :speed="0.3">
                <div v-if="reason === 2 || reason === 3">
                    <UiTextarea
                        v-model="form.description"
                        label="Описание"
                        placeholder="Почему удалить или в какую компанию перенести?"
                        class="mb-2"
                        :min-height="50"
                        :max-height="120"
                        auto-height
                    />
                </div>
            </AnimationTransition>
        </div>
    </div>
</template>
<script setup>
import { computed, watch } from 'vue';
import MessengerQuizFormRadioChip from '@/components/MessengerQuiz/Form/MessengerQuizFormRadioChip.vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import RadioOptions from '@/components/common/Forms/RadioOptions.vue';
import UiTextarea from '@/components/common/Forms/UiTextarea.vue';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.js';
import useVuelidate from '@vuelidate/core';
import { helpers, requiredIf } from '@vuelidate/validators';
import MessengerQuizQuestionCallSchedule from '@/components/MessengerQuiz/Question/Call/MessengerQuizQuestionCallSchedule.vue';
import { isString } from '@/utils/helpers/string/isString.js';
import { toBool } from '@/utils/helpers/string/toBool.js';
import SurveyFormContactFormCard from '@/components/SurveyForm/SurveyFormContactFormCard.vue';

const emit = defineEmits(['schedule-call']);
defineProps({
    contact: {
        type: Object,
        required: true
    }
});

const form = defineModel({ type: Object, default: () => ({}) });

const reason = computed({
    get() {
        if (isNotNullish(form.value.reason)) {
            return Number(form.value.reason);
        }

        return null;
    },
    set(value) {
        if (isNotNullish(value)) {
            form.value.reason = Number(value);
        } else {
            form.value.reason = value;
        }
    }
});

const available = computed({
    get() {
        if (isNotNullish(form.value?.available)) {
            if (isString(form.value.available)) {
                return toBool(form.value.available);
            }

            return form.value.available;
        }

        return null;
    },
    set(value) {
        form.value.available = value;
    }
});

watch(
    () => form.value?.scheduled,
    value => {
        if (isNotNullish(value)) {
            reason.value = 6;
        }
    }
);

function onClickSchedule() {
    if (reason.value === 6) {
        reason.value = null;
        return;
    }

    if (isNotNullish(form.value?.scheduled)) {
        reason.value = 6;
    } else {
        emit('schedule-call');
    }
}

const callOptionIsActive = computed(() => reason.value === 6);

const hasAnyAnswer = computed(() => isNotNullish(available.value));

const availableReasonOptions = {
    1: 'Актуален',
    2: 'Удалить',
    3: 'Перенести'
};

const unavailableReasonOptions = [
    { value: 4, label: 'Не поднимает' },
    { value: 5, label: 'Недоступен' },
    { value: 2, label: 'Удалить' },
    { value: 3, label: 'Перенести' }
];

const v$ = useVuelidate(
    {
        reason: {
            required: helpers.withMessage(
                `Необходимо указать результат звонка`,
                requiredIf(hasAnyAnswer)
            )
        }
    },
    form
);
</script>
