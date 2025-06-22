<template>
    <div class="survey-form-contact-form-call">
        <div class="survey-form-contact-form-call__question">
            <p class="survey-form-contact-form-call__question-text mb-2">Дозвонились?</p>
            <div class="d-flex gap-1 align-items-center">
                <RadioChip v-model="available"
:value="true"
unselect
label="Да"
:rounded="false" />
                <RadioChip
                    v-model="available"
                    :value="false"
                    unselect
                    label="Нет"
                    :rounded="false"
                />
                <UiButton
                    @click="$emit('schedule-call')"
                    :icon="form.scheduled ? 'fa-solid fa-check' : 'fa-solid fa-phone'"
                    :disabled="!!form.scheduled"
                    small
                    :color="form.scheduled ? 'success' : 'transparent'"
                    class="survey-form-contact-form-call__schedule ml-2"
                    :class="{ scheduled: !!form.scheduled }"
                >
                    {{ form.scheduled ? 'Звонок запланирован' : 'Запланировать звонок' }}
                </UiButton>
            </div>
        </div>
        <div v-if="hasAnyAnswer" class="mt-2">
            <p class="form__label">Положение по звонку<span class="text-danger">*</span></p>
            <RadioOptions
                v-model="reason"
                :v="v$.reason"
                required
                :options="available ? availableReasonOptions : unavailableReasonOptions"
                :rounded="false"
                class="messenger-quiz-question-call__radio mb-2"
                :disabled="!hasAnyAnswer"
            />
            <AnimationTransition :speed="0.3">
                <div v-if="reason === 2 || reason === 3">
                    <UiTextarea
                        v-model="form.description"
                        placeholder="Почему удалить или в какую компанию перенести?"
                        class="mb-2 survey-form-contact-form-call__editor"
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
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import RadioOptions from '@/components/common/Forms/RadioOptions.vue';
import UiTextarea from '@/components/common/Forms/UiTextarea.vue';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.js';
import useVuelidate from '@vuelidate/core';
import { helpers, requiredIf } from '@vuelidate/validators';
import { isString } from '@/utils/helpers/string/isString.js';
import { toBool } from '@/utils/helpers/string/toBool.js';
import RadioChip from '@/components/common/Forms/RadioChip.vue';
import UiButton from '@/components/common/UI/UiButton.vue';

const emit = defineEmits(['schedule-call', 'change']);
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

watch(available, value => {
    if (isNotNullish(value)) emit('change');
    reason.value = null;
});

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
