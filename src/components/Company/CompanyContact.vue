<template>
    <div class="company-contact" :class="{ inactive: inactive }">
        <p class="company-contact__name">
            <i v-if="isPassive" ref="passiveIconEl" class="fa-solid fa-phone-slash mr-1"></i>
            <span :class="{ 'text-through': isPassive }">{{ fullName }}</span>
        </p>
        <p v-if="contact.position" class="company-contact__position">{{ position }}</p>
        <p v-else-if="contact.position_unknown" class="company-contact__position">
            Должность неизвестна
        </p>
        <p v-else class="error-message">Должность не указана</p>
        <div v-if="contact.phones?.length" class="mt-1 company-contact__list">
            <PhoneNumber
                @click.stop="$emit('open-phone')"
                :phone="mainPhone"
                :contact="contact"
                :hidden
                clickable
                class="company-contact__phone"
            />
        </div>
        <div v-if="contact.emails?.length" class="mt-1 company-contact__list">
            <a class="company-contact__phone" :href="'mailto:' + mainEmail.email">
                {{ mainEmail.email }}
            </a>
        </div>
    </div>
</template>
<script setup>
import { computed, useTemplateRef } from 'vue';
import PhoneNumber from '@/components/common/PhoneNumber.vue';
import { contactOptions } from '@/const/options/contact.options.js';
import { getContactFullName } from '@/utils/formatters/models/contact.js';
import { useTippyText } from '@/composables/useTippyText.js';

defineEmits(['open-phone']);
const props = defineProps({
    contact: {
        type: Object,
        required: true
    },
    inactive: {
        type: Boolean,
        default: false
    },
    hidden: {
        type: Boolean,
        default: false
    }
});

const position = computed(() => contactOptions.position[props.contact.position]);
const fullName = computed(() => getContactFullName(props.contact));
const isPassive = computed(() => props.contact.status === 0);

useTippyText(useTemplateRef('passiveIconEl'), 'Контакт в пассиве');

const mainPhone = computed(() => {
    if (props.contact.phones?.length) {
        return props.contact.phones.find(phone => phone.isMain) ?? props.contact.phones[0];
    }

    return null;
});

const mainEmail = computed(() => {
    if (props.contact.emails?.length) {
        return props.contact.emails.find(email => email.isMain) ?? props.contact.emails[0];
    }

    return null;
});
</script>
