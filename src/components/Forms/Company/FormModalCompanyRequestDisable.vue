<template>
    <UiModal @close="$emit('close')"
:visible="show"
custom-close
:width="550"
:title>
        <UiField v-if="!currentUserIsModeratorOrHigher" color="light" class="mb-2">
            <i class="fa-solid fa-exclamation-triangle" />
            <span>Запрос сразу будет отправлен в пассив без проверка менеджера.</span>
        </UiField>
        <FormCompanyRequestDisable
            @disabled="$emit('disabled', $event)"
            @cancel="$emit('close')"
            :request_id="request_id"
        />
    </UiModal>
</template>

<script setup lang="ts">
import FormCompanyRequestDisable from '@/components/Forms/Company/FormCompanyRequestDisable.vue';
import UiModal from '@/components/common/UI/UiModal.vue';
import UiField from '@/components/common/UI/UiField.vue';
import { useAuth } from '@/composables/useAuth';

defineEmits<{
    (e: 'close'): void;
    (e: 'disabled'): void;
}>();

withDefaults(
    defineProps<{
        title?: string;
        request_id?: number;
        show?: boolean;
    }>(),
    { title: 'Завершение запроса' }
);

const { currentUserIsModeratorOrHigher } = useAuth();
</script>
