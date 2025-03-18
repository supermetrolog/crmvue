<template>
    <div
        class="messenger-quiz-question messenger-quiz-question-call"
        :class="{ active: hasPositiveAnswer, passive: hasNegativeAnswer }"
    >
        <div class="messenger-quiz-question__header">
            <p class="messenger-quiz-question__title">
                <span class="mr-1">{{ number }}. Удалось ли дозвониться до</span>
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
            </div>
        </div>
        <div v-if="form.reason">
            <UiField color="success-light">
                <i :class="reasonOptionsIcons[form.reason]" />
                <span>{{ reasonOptions[form.reason] }}</span>
            </UiField>
        </div>
    </div>
</template>
<script setup>
import { computed, watch } from 'vue';
import { Tippy } from 'vue-tippy';
import ContactCard from '@/components/Contact/Card/ContactCard.vue';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.js';
import useVuelidate from '@vuelidate/core';
import { helpers, required } from '@vuelidate/validators';
import { useValidationNotify } from '@/composables/useValidationNotify.js';
import MessengerQuizFormRadioChip from '@/components/Messenger/Quiz/Form/MessengerQuizFormRadioChip.vue';
import UiField from '@/components/common/UI/UiField.vue';

const form = defineModel('form');

const emit = defineEmits(['open-modal', 'schedule-call', 'move-contact', 'delete-contact']);

defineProps({
    contact: {
        type: Object,
        required: true
    },
    showCall: Boolean,
    number: Number
});

// answers

const hasPositiveAnswer = computed(() => form.value.available === true);
const hasNegativeAnswer = computed(() => form.value.available === false);

const reasonOptions = {
    1: 'Актуален',
    2: 'Будет удален',
    3: 'Будет перенесен',
    4: 'Запланирован звонок'
};

const reasonOptionsIcons = {
    1: 'fa-solid fa-check',
    2: 'fa-solid fa-trash',
    3: 'fa-solid fa-pen',
    4: 'fa-solid fa-phone'
};

const v$ = useVuelidate(
    {
        available: {
            required: helpers.withMessage('Укажите, удалось ли дозвониться до клиента', required)
        }
    },
    form
);

function resetForm() {
    form.value.reason = null;
    form.value.description = null;
}

watch(
    () => form.value.available,
    value => {
        resetForm();

        if (isNotNullish(value)) {
            emit('open-modal');
        }
    }
);

const { validateWithNotify } = useValidationNotify(v$);

defineExpose({
    validate() {
        return validateWithNotify();
    }
});
</script>
