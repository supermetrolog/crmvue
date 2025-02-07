<template>
    <div>
        <Loader v-if="isUpdating" small />
        <Form>
            <div v-if="form.files?.length" class="row mb-1">
                <File
                    v-for="(file, key) in form.files"
                    :key="file"
                    @delete="deleteFile(key)"
                    :file="file"
                    class="file--new col-3"
                />
            </div>
            <FileInput ref="fileInputElement" v-model:native="form.files" hidden custom />
            <div v-if="form.current_files?.length" class="row mb-1">
                <File
                    v-for="(file, key) in form.current_files"
                    :key="file"
                    @delete="deleteCurrentFile(key)"
                    :file="file"
                    class="col-3"
                />
            </div>
            <Textarea
                v-model="form.message"
                class="mb-1 task-card__textarea"
                label="Комментарий"
                :disabled="isUpdating"
                auto-height
            />
        </Form>
        <div class="d-flex gap-2">
            <TaskCardButton
                @click.prevent="updateComment"
                :disabled="(!form.message.length && !form.files.length) || isUpdating"
            >
                Сохранить
            </TaskCardButton>
            <TaskCardButton @click.prevent="openFileDialog" :disabled="isUpdating">
                <i class="fa-solid fa-file-circle-plus mr-1" />
                <span>Прикрепить файл</span>
            </TaskCardButton>
            <TaskCardButton @click.prevent="$emit('cancel')" :disabled="isUpdating">
                Отмена
            </TaskCardButton>
        </div>
    </div>
</template>
<script setup>
import Textarea from '@/components/common/Forms/Textarea.vue';
import TaskCardButton from '@/components/TaskCard/TaskCardButton.vue';
import Form from '@/components/common/Forms/Form.vue';
import api from '@/api/api.js';
import { reactive, ref, useTemplateRef } from 'vue';
import FileInput from '@/components/common/Forms/FileInput.vue';
import File from '@/components/common/Forms/File.vue';
import Loader from '@/components/common/Loader.vue';

const emit = defineEmits(['updated', 'cancel']);
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

const isUpdating = ref(false);

function createPayload() {
    return {
        message: form.message,
        files: form.files,
        current_files: form.current_files.map(element => element.id)
    };
}

async function updateComment() {
    isUpdating.value = true;

    const response = await api.taskComment.update(props.formData.id, createPayload());

    if (response) {
        emit('updated', response);
    }

    isUpdating.value = false;
}

// files

const fileInputElement = useTemplateRef('fileInputElement');

function openFileDialog() {
    fileInputElement.value.clickOpenFile();
}

function deleteCurrentFile(fileIndex) {
    form.current_files.splice(fileIndex, 1);
}

function deleteFile(fileIndex) {
    form.files.splice(fileIndex, 1);
}
</script>
