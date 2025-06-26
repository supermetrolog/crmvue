<template>
    <div
        class="messenger-quiz-question messenger-quiz-question-call"
        :class="{ active: hasPositiveAnswer, passive: hasNegativeAnswer }"
    >
        <div class="messenger-quiz-question__header">
            <div class="w-100">
                <p class="messenger-quiz-question__title">
                    <span class="mr-1">{{ number }}. Удалось ли пообщаться с</span>
                    <Tippy interactive :interactive-border="20">
                        <template #default>
                            <span class="messenger-quiz-question__contact">
                                {{ contact.first_name }}
                            </span>
                        </template>
                        <template #content>
                            <ContactCard :contact="contact" />
                        </template>
                    </Tippy>
                    <span>?</span>
                </p>
                <MessengerQuizQuestionCallDescription :contact />
            </div>
            <div class="messenger-quiz-question__main d-flex gap-1">
                <MessengerQuizFormRadioChip
                    v-model="form.available"
                    :value="true"
                    unselect
                    label="Да"
                />
                <MessengerQuizFormRadioChip
                    v-model="form.available"
                    :value="false"
                    unselect
                    label="Нет"
                />
                <MessengerQuizQuestionCallSchedule
                    @schedule="$emit('schedule-call')"
                    :scheduled-date="form.scheduled"
                    class="messenger-quiz-question-call__schedule"
                />
            </div>
        </div>
        <AnimationTransition :speed="0.5">
            <div v-if="form.reason && hidden" class="d-flex gap-1">
                <UiField color="success-light">
                    <i :class="reasonOptionsIcons[form.reason]" />
                    <span>{{ reasonOptions[form.reason] }}</span>
                </UiField>
                <UiButton @click="hidden = false" icon="fa-solid fa-angle-down" color="light" small>
                    Подробнее
                </UiButton>
            </div>
        </AnimationTransition>
        <AnimationTransition :speed="0.5">
            <div v-if="hasAnyAnswer && !hidden">
                <RadioOptions
                    v-model="form.reason"
                    :v="v$.reason"
                    required
                    unselect
                    :options="form.available ? availableReasonOptions : unavailableReasonOptions"
                    :rounded="false"
                    class="messenger-quiz-question-call__radio mb-2"
                    :disabled="!hasAnyAnswer"
                />
                <AnimationTransition :speed="0.3">
                    <div v-if="form.reason === 2 || form.reason === 3">
                        <UiTextarea
                            v-model="form.description"
                            label="Описание"
                            placeholder="Почему удалить или в какую компанию перенести?"
                            class="mb-2"
                            :min-height="50"
                            :max-height="120"
                            auto-height
                        />
                        <UiButton
                            v-if="form.reason"
                            @click="hidden = true"
                            small
                            icon="fa-solid fa-angle-up"
                            color="light"
                            class="ml-auto"
                        >
                            Скрыть подробности
                        </UiButton>
                    </div>
                </AnimationTransition>
            </div>
        </AnimationTransition>
    </div>
</template>
<script setup>
import { computed, ref, watch } from 'vue';
import { Tippy } from 'vue-tippy';
import ContactCard from '@/components/Contact/Card/ContactCard.vue';
import useVuelidate from '@vuelidate/core';
import { helpers, required } from '@vuelidate/validators';
import { useValidationNotify } from '@/composables/useValidationNotify.js';
import MessengerQuizFormRadioChip from '@/components/MessengerQuiz/Form/MessengerQuizFormRadioChip.vue';
import MessengerQuizQuestionCallDescription from '@/components/MessengerQuiz/Question/Call/MessengerQuizQuestionCallDescription.vue';
import MessengerQuizQuestionCallSchedule from '@/components/MessengerQuiz/Question/Call/MessengerQuizQuestionCallSchedule.vue';
import RadioOptions from '@/components/common/Forms/RadioOptions.vue';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.ts';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import UiTextarea from '@/components/common/Forms/UiTextarea.vue';
import UiField from '@/components/common/UI/UiField.vue';
import UiButton from '@/components/common/UI/UiButton.vue';

const form = defineModel('form');

defineEmits(['schedule-call', 'move-contact', 'delete-contact']);

defineProps({
    contact: {
        type: Object,
        required: true
    },
    showCall: Boolean,
    number: Number,
    canGoToNext: Boolean
});

// answers

const hasPositiveAnswer = computed(() => form.value.available === true);
const hasNegativeAnswer = computed(() => form.value.available === false);
const hasAnyAnswer = computed(() => isNotNullish(form.value.available));

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

const reasonOptions = {
    1: 'Актуален',
    2: 'Будет удален',
    3: 'Будет перенесен',
    4: 'Не поднимает трубку',
    5: 'Телефон недоступен'
};

const reasonOptionsIcons = {
    1: 'fa-solid fa-check',
    2: 'fa-solid fa-trash',
    3: 'fa-solid fa-pen',
    4: 'fa-solid fa-phone-slash',
    5: 'fa-solid fa-phone-slash'
};

const v$ = useVuelidate(
    {
        available: {
            required: helpers.withMessage('Укажите, удалось ли дозвониться до клиента', required)
        },
        reason: {
            required: helpers.withMessage(`Необходимо указать результат звонка`, required)
        }
    },
    form
);

function resetForm() {
    form.value.reason = null;
    form.value.description = null;
    hidden.value = false;
}

watch(
    () => form.value.available,
    value => {
        resetForm();

        if (value) {
            form.value.reason = 1;
        }
    }
);

const { validateWithNotify } = useValidationNotify(v$);

defineExpose({
    validate() {
        return validateWithNotify();
    }
});

// hide

const hidden = ref(false);
</script>
