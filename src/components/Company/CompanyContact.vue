<template>
    <div class="company-contact" :class="{ inactive: inactive }">
        <p class="company-contact__name">{{ fullName }}</p>
        <p v-if="contact.position" class="company-contact__position">{{ position }}</p>
        <p v-else-if="contact.position_unknown" class="company-contact__position">
            Должность неизвестна
        </p>
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
<script setup>
import { computed } from 'vue';
import { entityOptions } from '@/const/options/options.js';
import PhoneNumber from '@/components/common/PhoneNumber.vue';

const props = defineProps({
    contact: { type: Object, required: true },
    inactive: { type: Boolean, default: false }
});

const position = computed(() => entityOptions.contact.position[props.contact.position]);
const fullName = computed(() => {
    if (props.contact.full_name) return props.contact.full_name;
    else if (props.contact.middle_name || props.contact.first_name)
        return `${props.contact.middle_name} ${props.contact.first_name}`;
    else if (props.contact.type === entityOptions.contact.typeStatement.GENERAL)
        return 'Основной контакт';
    return 'Без имени';
});
</script>
