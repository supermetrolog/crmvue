<template>
    <div class="dashboard-task-item-preview-contact">
        <p class="dashboard-task-item-preview-contact__name">{{ fullName }}</p>
        <p class="dashboard-task-item-preview-contact__position">{{ position }}</p>
        <div class="dashboard-task-item-preview-contact__contacts mt-2">
            <div class="dashboard-task-item-preview-contact__column">
                <p class="dashboard-task-item-preview-contact__label">Телефоны:</p>
                <p
                    v-for="phone in contact.phones"
                    :key="phone.id"
                    class="dashboard-task-item-preview-contact__element"
                >
                    {{ phone.phone }}
                </p>
                <p v-if="!contact.phones.length" class="messenger-warning">Не заполнено..</p>
            </div>
            <div class="dashboard-task-item-preview-contact__column">
                <p class="dashboard-task-item-preview-contact__label">Почтовые адреса:</p>
                <p
                    v-for="email in contact.emails"
                    :key="email.id"
                    class="dashboard-task-item-preview-contact__element"
                >
                    {{ email.email }}
                </p>
                <p v-if="!contact.emails.length" class="messenger-warning">Не заполнено..</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { contactOptions } from '@/const/options/contact.options.js';
import { entityOptions } from '@/const/options/options.js';

const props = defineProps({
    contact: {
        type: Object,
        required: true
    }
});

const position = computed(() => {
    if (props.contact.position_unknown) return 'Должность неизвестна';
    return contactOptions.position[props.contact.position];
});

const fullName = computed(() => {
    if (props.contact.type === entityOptions.contact.typeStatement.GENERAL)
        return 'Основной контакт';
    return props.contact.full_name;
});
</script>
