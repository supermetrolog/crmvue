<template>
    <div class="object-holding-contact">
        <div class="object-holding-contact__avatar">
            <span>{{ avatarText }}</span>
        </div>
        <div class="object-holding-contact__description">
            <p class="object-holding-contact__name">
                <span>{{ fullName }}</span>
                <ContactPositionField :contact class="object-holding-contact__message" />
            </p>
            <ul class="object-holding-contact__list">
                <li v-for="phone in phones" :key="phone.id" class="object-holding-contact__item">
                    {{ phone.phone }}
                </li>
                <li v-if="!contact.phones.length" class="object-holding-contact__item">
                    Телефон не указан
                </li>
                <li
                    v-for="email in contact.emails"
                    :key="email.id"
                    class="object-holding-contact__item"
                >
                    {{ email.email }}
                </li>
            </ul>
        </div>
        <UiButton
            @click="openInSurvey"
            mini
            color="success-light"
            icon="fa-solid fa-square-poll-horizontal"
            class="object-holding-contact__button"
        >
            Открыть опрос
        </UiButton>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { toInitialsFormat } from '@/utils/formatters/string.js';
import ContactPositionField from '@/components/Contact/ContactPositionField.vue';
import { Contact } from '@/types/contact/contact';
import { useSurveyForm } from '@/composables/useSurveyForm';
import UiButton from '@/components/common/UI/UiButton.vue';

const props = defineProps<{ contact: Contact }>();

const avatarText = computed(() => {
    if (props.contact.middle_name && props.contact.first_name)
        return `${props.contact.first_name[0]}${props.contact.middle_name[0]}`;

    if (props.contact.full_name) return toInitialsFormat(props.contact.full_name);
    else return '?';
});

const fullName = computed(() => {
    if (props.contact.full_name) return props.contact.full_name;

    if (props.contact.type === 1) return '[Общий контакт]';
    return '-';
});

const phones = computed(() =>
    props.contact.phones.map(phone => {
        return { id: phone.id, phone: phone.phone.slice(0, -4) + '...' };
    })
);

const { openSurvey } = useSurveyForm();

function openInSurvey() {
    openSurvey(props.contact.company_id, { offer_contact_id: props.contact.id });
}
</script>
