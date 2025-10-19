<template>
    <SurveyFormContactFormElement
        icon="fa-regular fa-envelope"
        class="survey-form-contact-form-email"
        :active
        :class="{
            success: hasSuccessLetter,
            danger: hasFailLetter,
            warning: hasPendingLetter
        }"
    >
        <template #header>
            <a :href="`mailto:${email.email}`" class="survey-form-contact-form-email__value">
                <span>{{ email.email }}</span>
            </a>
        </template>
        <template #footer>
            <p class="survey-form-contact-form-email__footer">
                <span class="survey-form-contact-form-email__label">{{ lettersCountLabel }}</span>
                <span>.</span>
                <span
                    v-if="currentLetters.length > 0"
                    class="survey-form-contact-form-email__last-letter"
                    :class="lastLetterHasAnswer ? 'success' : 'danger'"
                >
                    Последнее письмо: {{ lastLetterDateLabel }}.
                    {{ lastLetterHasAnswer ? 'Ответ получен' : 'Без ответа' }}
                </span>
            </p>
        </template>
    </SurveyFormContactFormElement>
</template>
<script setup lang="ts">
import SurveyFormContactFormElement from '@/components/SurveyForm/SurveyFormContactFormElement.vue';
import { Contact } from '@/types/contact/contact';
import { Email } from '@/types/contact/email';
import { computed } from 'vue';
import { pluralTemplate } from '@/utils/plural';
import { toBeautifulDateFormat } from '@/utils/formatters/date';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish';

const props = defineProps<{
    email: Email;
    contact: Contact;
    active?: boolean;
    letterActions: object[];
    form: {
        available: boolean | null;
        reason: number | null;
    };
}>();

// TODO: Количество писем, статусы

const currentLetters = computed(() => {
    if (props.contact.letters?.length) {
        return props.contact.letters!.filter(letter => letter.email === props.email.email);
    }

    return [];
});

const lettersCountLabel = computed(() => {
    if (currentLetters.value.length > 0) {
        return pluralTemplate(
            '%s отправлено',
            currentLetters.value.length,
            '%d письмо',
            '%d письма',
            '%d писем'
        );
    }

    return 'Нет писем.';
});

const lastLetter = computed(() => {
    return currentLetters.value.reduce(
        (prev, letter) => (prev.id > letter.id ? prev : letter),
        currentLetters.value[0]
    );
});

const lastLetterDateLabel = computed(() =>
    toBeautifulDateFormat(lastLetter.value.letter!.created_at)
);

const lastLetterHasAnswer = computed(() => lastLetter.value.answers.length > 0);

const currentLetterActions = computed(() => {
    if (props.letterActions?.length) {
        return props.letterActions.filter(action =>
            currentLetters.value.some(letter => letter.id === action.target_id)
        );
    }

    return [];
});

const currentLetterAction = computed(() => {
    return currentLetterActions.value.reduce(
        (max, action) => (action.id > max.id ? action : max),
        currentLetterActions.value?.[0]
    );
});

const hasSuccessLetter = computed(
    () => isNotNullish(currentLetterAction.value) && currentLetterAction.value.status === 'done'
);
const hasPendingLetter = computed(
    () => isNotNullish(currentLetterAction.value) && currentLetterAction.value.status === 'pending'
);
const hasFailLetter = computed(
    () => isNotNullish(currentLetterAction.value) && currentLetterAction.value.status === 'canceled'
);
</script>
