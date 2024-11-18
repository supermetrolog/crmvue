<template>
    <div class="form-modal-task-description">
        <p class="form__label">Информация о связанной компании:</p>
        <p>Компания: {{ info.companyName ?? '-' }}</p>
        <p>Адрес: {{ info.address ?? 'не указан' }}</p>
    </div>
</template>
<script setup>
defineProps({
    info: {
        type: Object,
        default: () => ({})
    }
});
</script>
