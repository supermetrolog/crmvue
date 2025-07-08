<template>
    <UiModal v-model:visible="visible" title="Добавить запрос" :width="500" small>
        <h3 class="text-center font-weight-semi">
            Заполнить данные запроса или создать задачу для офис-менеджера?
        </h3>
        <template #actions>
            <UiButton @click="createRequest" color="light" icon="fa-solid fa-pen">
                Заполнить вручную
            </UiButton>
            <UiButton @click="createTask" color="light" icon="fa-solid fa-bolt">
                Создать задачу
            </UiButton>
        </template>
    </UiModal>
</template>
<script setup lang="ts">
import UiButton from '@/components/common/UI/UiButton.vue';
import UiModal from '@/components/common/UI/UiModal.vue';

const visible = defineModel<boolean>('visible');

const emit = defineEmits<{
    (e: 'create-request'): void;
    (e: 'create-task'): void;
}>();

function createRequest() {
    visible.value = false;
    emit('create-request');
}

function createTask() {
    visible.value = false;
    emit('create-task');
}
</script>
