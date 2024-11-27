<template>
    <div class="object-holding-contact">
        <div class="object-holding-contact__avatar">
            <span>{{ avatarText }}</span>
        </div>
        <div class="object-holding-contact__description">
            <p class="object-holding-contact__name">
                <span>{{ fullName }}</span>
                <span v-if="contact.position" class="object-holding-contact__message">
                    {{ position }}
                </span>
            </p>
            <ul class="object-holding-contact__list">
                <li
                    v-for="phone in contact.phones"
                    :key="phone.id"
                    class="object-holding-contact__item"
                >
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
    </div>
</template>

<script setup>
import { PositionList } from '@/const/const';
import { computed } from 'vue';
import { toInitialsFormat } from '@/utils/formatters/string.js';

const props = defineProps({
    contact: {
        type: Object,
        required: true
    }
});

const position = computed(() => PositionList[props.contact.position].label);

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
</script>
