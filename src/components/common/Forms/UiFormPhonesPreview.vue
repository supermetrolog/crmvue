<template>
    <div class="form__group ui-form-phones-preview">
        <span class="form__label">{{ label }}</span>
        <div class="d-flex flex-column gap-1">
            <UiFormPhonesPreviewItem
                v-for="phone in phones"
                :key="phone.id"
                @edit="$emit('edit', phone)"
                @set-as-main="$emit('set-as-main', phone)"
                :phone="phone"
            />
        </div>
        <UiButton
            @click.prevent="$emit('create')"
            icon="fa-solid fa-plus"
            small
            color="light"
            class="mt-1"
        >
            Добавить телефон
        </UiButton>
    </div>
</template>

<script setup lang="ts">
import { Phone } from '@/types/contact/phone';
import UiFormPhonesPreviewItem from '@/components/common/Forms/UiFormPhonesPreviewItem.vue';
import UiButton from '@/components/common/UI/UiButton.vue';

defineEmits<{
    (e: 'edit', phone: Phone): void;
    (e: 'set-as-main', phone: Phone): void;
    (e: 'create'): void;
}>();

const { label = 'Телефоны' } = defineProps<{
    phones: Phone[];
    label?: string;
}>();
</script>
