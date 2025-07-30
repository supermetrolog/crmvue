<template>
    <SurveyFormContactFormElement
        icon="fa-regular fa-envelope"
        class="survey-form-contact-form-email"
        :active
    >
        <template #header>
            <a :href="`mailto:${email.email}`" class="survey-form-contact-form-email__value">
                <span>{{ email.email }}</span>
            </a>
        </template>
        <template #footer>
            <p class="survey-form-contact-form-email__footer">
                <span>Нет писем (в разработке)</span>
            </p>
        </template>
    </SurveyFormContactFormElement>
</template>
<script setup lang="ts">
import SurveyFormContactFormElement from '@/components/SurveyForm/SurveyFormContactFormElement.vue';
import { Contact } from '@/types/contact/contact';
import { Email } from '@/types/contact/email';

defineProps<{
    email: Email;
    contact: Contact;
    active?: boolean;
}>();

// TODO: Количество писем, статусы
</script>
