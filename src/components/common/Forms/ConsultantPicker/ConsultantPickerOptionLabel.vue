<template>
    <div class="consultant-picker-option-label">
        <p class="consultant-picker-option-label__username">
            {{ option.label }},
            <span class="consultant-picker-option-label__role">{{ option.role }}</span>
        </p>
        <p>
            <span class="consultant-picker-option-label__parameter">Рабочая почта:</span>
            <span class="consultant-picker-option-label__value ml-1">
                {{ option.email ?? '-' }}
            </span>
        </p>
        <p class="consultant-picker-option-label__parameter">Телефоны:</p>
        <p v-if="option.phones.length" class="consultant-picker-option__contacts">
            {{ option.phones }}
        </p>
        <p v-else class="text-danger">Не заполнено</p>
        <p class="consultant-picker-option-label__parameter">Почтовые адреса:</p>
        <p v-if="option.emails.length" class="consultant-picker-option__contacts">
            {{ option.emails }}
        </p>
        <p v-else class="text-danger">Не заполнено</p>
    </div>
</template>
<script setup>
defineProps({
    option: {
        type: Object,
        required: true
    }
});
</script>
