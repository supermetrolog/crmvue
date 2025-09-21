<template>
    <div>
        <Loader v-if="isUpdating" small />
        <UiForm>
            <div v-if="form.files?.length" class="d-flex flex-wrap gap-1">
                <File
                    v-for="(file, key) in form.files"
                    :key="file"
                    @delete="deleteFile(key)"
                    :file="file"
                    class="file--new task-card-comment__file"
                />
            </div>
            <FileInput ref="fileInputElement" v-model:native="form.files" hidden custom />
            <div v-if="form.current_files?.length" class="d-flex flex-wrap gap-1 mt-1">
                <File
                    v-for="(file, key) in form.current_files"
                    :key="file"
                    @delete="deleteCurrentFile(key)"
                    :file="file"
                    class="task-card-comment__file"
                />
            </div>
            <UiTextarea
                v-model="form.message"
                class="mb-1 task-card__textarea"
                label="Комментарий"
                :disabled="isUpdating"
                auto-height
            />
        </UiForm>
        <div class="d-flex gap-2 mt-2">
            <UiButton
                @click="updateComment"
                :disabled="(!form.message.length && !form.files.length) || isUpdating"
                color="success-light"
                icon="fa-solid fa-check"
                small
            >
                Сохранить
            </UiButton>
            <UiButton
                @click="openFileDialog"
                :disabled="isUpdating"
                color="light"
                icon="fa-solid fa-file-circle-plus"
                small
            >
                Добавить файл
            </UiButton>
            <UiButton
                @click="$emit('close')"
                color="light"
                icon="fa-solid fa-ban"
                :disabled="isUpdating"
                small
            >
                Отмена
            </UiButton>
        </div>
    </div>
</template>
<script setup>
import UiTextarea from '@/components/common/Forms/UiTextarea.vue';
import UiForm from '@/components/common/Forms/UiForm.vue';
import api from '@/api/api.js';
import { reactive, useTemplateRef } from 'vue';
import FileInput from '@/components/common/Forms/FileInput.vue';
import File from '@/components/common/Forms/File.vue';
import Loader from '@/components/common/Loader.vue';
import UiButton from '@/components/common/UI/UiButton.vue';
import { useAsync } from '@/composables/useAsync';

const emit = defineEmits(['updated', 'close']);
const props = defineProps({
    formData: {
        type: Object,
        required: true
    }
});

const form = reactive({
    message: props.formData.message,
    files: [],
    current_files: [...props.formData.files]
});

const { isLoading: isUpdating, execute: updateComment } = useAsync(api.taskComment.update, {
    onFetchResponse({ response }) {
        emit('updated', response);
    },
    payload: () => [props.formData.id, createPayload()]
});

function createPayload() {
    return {
        message: form.message,
        files: form.files,
        current_files: form.current_files.map(element => element.id)
    };
}

// files

const fileInputElement = useTemplateRef('fileInputElement');

function openFileDialog() {
    fileInputElement.value.open();
}

function deleteCurrentFile(fileIndex) {
    form.current_files.splice(fileIndex, 1);
}

function deleteFile(fileIndex) {
    form.files.splice(fileIndex, 1);
}
</script>
