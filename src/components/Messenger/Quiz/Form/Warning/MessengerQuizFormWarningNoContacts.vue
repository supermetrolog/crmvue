<template>
    <UiModal
        show
        relative
        hide-header
        :can-be-closed="false"
        title="Невозможно заполнить опрос"
        :width="500"
        class="messenger-quiz__disabled"
    >
        <div class="d-flex align-items-center justify-content-center gap-4 p-4">
            <i class="fa-solid fa-users-slash icon" />
            <div>
                <p class="font-weight-semi fs-4">Невозможно заполнить опрос</p>
                <p class="text-danger">Отсутствуют активные контакты</p>
            </div>
        </div>
        <template #actions>
            <UiButton
                @click="$emit('suggest-create-contact')"
                icon="fa-solid fa-user-plus"
                color="light"
            >
                Добавить контакт
            </UiButton>
        </template>
    </UiModal>
</template>
<script setup>
import UiButton from '@/components/common/UI/UiButton.vue';
import UiModal from '@/components/common/UI/UiModal.vue';

defineEmits(['suggest-create-contact']);
</script>
