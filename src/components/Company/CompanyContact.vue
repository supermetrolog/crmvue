<template>
    <div class="company-contact">
        <p class="company-contact__name">{{ contact.full_name }}</p>
        <p class="company-contact__position">{{ position }}</p>
        <ul v-if="contact.phones?.length" class="company-contact__phones">
            <li
                v-for="phone in contact.phones"
                :key="phone.id"
                class="company-contact__phone"
                :class="{ active: phone.isMain }"
            >
                {{ phone.phone }}
            </li>
        </ul>
    </div>
</template>
<script>
import { entityOptions } from '@/const/options/options.js';

export default {
    name: 'CompanyContact',
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
