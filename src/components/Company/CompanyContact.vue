<template>
    <div class="company-contact">
        <p class="company-contact__name">{{ contact.full_name || 'Без имени' }}</p>
        <p v-if="contact.position" class="company-contact__position">{{ position }}</p>
        <p v-else class="error-message">Должность не указана</p>
        <div v-if="contact.phones?.length" class="mt-1 company-contact__list">
            <PhoneNumber
                v-for="phone of contact.phones"
                :key="phone.id"
                :phone="phone"
                :contact="contact"
                class="company-contact__phone"
            />
        </div>
        <div v-if="contact.emails?.length" class="mt-1 company-contact__list">
            <a
                v-for="email of contact.emails"
                :key="email.email"
                class="company-contact__phone"
                :href="'mailto:' + email.email"
            >
                {{ email.email }}
            </a>
        </div>
    </div>
</template>
<script>
import { entityOptions } from '@/const/options/options.js';
import PhoneNumber from '@/components/common/PhoneNumber.vue';

export default {
    name: 'CompanyContact',
    components: { PhoneNumber },
    props: {
        contact: {
            type: Object,
            required: true
        }
    },
    computed: {
        position() {
            return entityOptions.contact.position[this.contact.position];
        }
    }
};
</script>
