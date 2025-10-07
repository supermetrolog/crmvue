<template>
    <UiModal
        @close="$emit('close')"
        show
        custom-close
        :title
        :width
        :close-on-press-esc="false"
        :close-on-outside-click="false"
    >
        <template #header-actions>
            <slot name="header-actions" />
        </template>
        <UiForm>
            <Loader v-if="loading" />
            <slot></slot>
        </UiForm>
        <template #actions="{ close }">
            <UiButton
                @click="$emit('submit')"
                color="success-light"
                icon="fa-solid fa-check"
                :disabled="!canBeSubmit"
                :loading
            >
                Сохранить
            </UiButton>
            <UiButton @click="close" color="light" icon="fa-solid fa-ban" :disabled="loading">
                Отмена
            </UiButton>
        </template>
    </UiModal>
</template>
<script setup lang="ts">
import UiForm from '@/components/common/Forms/UiForm.vue';
import UiModal from '@/components/common/UI/UiModal.vue';
import UiButton from '@/components/common/UI/UiButton.vue';
import Loader from '@/components/common/Loader.vue';
import { useAuth } from '@/composables/useAuth';

defineEmits<{ (e: 'close'): void; (e: 'submit'): void }>();

const { width = 900 } = defineProps<{
    loading?: boolean;
    title: string;
    width?: number;
}>();

const { currentUserIsNotGuest: canBeSubmit } = useAuth();
</script>
