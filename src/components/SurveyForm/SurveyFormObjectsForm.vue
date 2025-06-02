<template>
    <UiModal title="Новое предложение">
        <UiForm>
            <VueEditor
                v-model="form.description"
                label="Описание предложения"
                :toolbar="false"
                :min-height="120"
            />
        </UiForm>
        <template #actions="{ close }">
            <UiButton @click="submit" color="success-light" small icon="fa-solid fa-check">
                Сохранить
            </UiButton>
            <UiButton @click="close" color="light" small icon="fa-solid fa-ban">Отмена</UiButton>
        </template>
    </UiModal>
</template>
<script setup>
import { reactive } from 'vue';
import UiButton from '@/components/common/UI/UiButton.vue';
import UiModal from '@/components/common/UI/UiModal.vue';
import UiForm from '@/components/common/Forms/UiForm.vue';
import VueEditor from '@/components/common/Forms/VueEditor.vue';

const form = reactive({
    description: null
});
</script>
