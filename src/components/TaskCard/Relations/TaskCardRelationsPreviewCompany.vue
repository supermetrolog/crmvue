<template>
    <CompanyRowCard :company>
        <template #menu>
            <UiDropdownActionsButton
                @handle="$emit('unlink')"
                label="Удалить связь"
                icon="fa-solid fa-link-slash"
            />
            <UiDropdownActionsButton
                @handle="$emit('to-company')"
                label="Просмотреть компанию"
                icon="fa-solid fa-arrow-up-right-from-square"
            />
            <UiDropdownActionsButton
                @handle="$emit('show-contacts')"
                label="Список контактов"
                icon="fa-solid fa-contact-card"
            />
        </template>
    </CompanyRowCard>
</template>
<script setup>
import UiDropdownActionsButton from '@/components/common/UI/DropdownActions/UiDropdownActionsButton.vue';
import CompanyRowCard from '@/components/CompanyRowCard/CompanyRowCard.vue';

defineEmits(['unlink', 'to-company', 'show-contacts']);

defineProps({
    company: {
        type: Object,
        required: true
    }
});
</script>
