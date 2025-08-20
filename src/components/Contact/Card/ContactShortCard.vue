<template>
    <p class="contact-card__name">{{ contact.full_name }}</p>
    <p class="contact-card__position">
        <ContactPositionField :contact />
    </p>
    <div class="contact-card__contacts mt-2">
        <div class="contact-card__column">
            <p class="contact-card__label">Телефоны:</p>
            <p v-for="phone in contact.phones" :key="phone.id" class="contact-card__element">
                {{ phone.phone }}
            </p>
            <p v-if="!contact.phones.length" class="color-danger">Не заполнено..</p>
        </div>
        <div class="contact-card__column">
            <p class="contact-card__label">Почтовые адреса:</p>
            <p v-for="email in contact.emails" :key="email.id" class="contact-card__element">
                {{ email.email }}
            </p>
            <p v-if="!contact.emails.length" class="messenger-warning">Не заполнено..</p>
        </div>
    </div>
</template>
<script setup lang="ts">
import { Contact } from '@/types/contact/contact';
import ContactPositionField from '@/components/Contact/ContactPositionField.vue';

defineProps<{ contact: Contact }>();
</script>
