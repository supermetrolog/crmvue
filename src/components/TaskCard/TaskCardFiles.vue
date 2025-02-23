<template>
    <div class="task-card__files task-card-files position-relative">
        <Loader v-if="isCreating" small class="center" />
        <Spinner v-if="isLoading" small label="Загрузка файлов.." />
        <div
            v-else-if="files.length"
            class="task-card__comments-list"
            :class="{ 'task-card__comments-list--shorted': files.length }"
        >
            <div class="task-card__list col-12 position-relative">
                <Loader v-if="isDeleting" small class="center" />
                <div class="row">
                    <File
                        v-for="file in files"
                        :key="file.id"
                        @preview="openPreview(file.id)"
                        @delete="deleteFile(file.id)"
                        :file="file"
                        custom-preview
                        :read-only="!canBeEdit(file)"
                        class="col-3"
                    />
                </div>
            </div>
        </div>
        <p v-else class="col-12">Файлы отсутствуют..</p>
        <div class="task-card-files__form mb-2">
            <FileInput
                ref="fileInputEl"
                v-model:native="newFiles"
                class="col-12"
                short
                item-class="col-3"
            />
        </div>
        <div class="col-12">
            <TaskCardButton
                @click.prevent="addFiles"
                class="w-100"
                :disabled="!newFiles?.length || isCreating"
            >
                Сохранить
            </TaskCardButton>
        </div>
    </div>
</template>

<script setup>
import api from '@/api/api.js';
import { onMounted, ref, shallowRef, useTemplateRef, watch } from 'vue';
import { useNotify } from '@/utils/use/useNotify.js';
import Loader from '@/components/common/Loader.vue';
import TaskCardButton from '@/components/TaskCard/TaskCardButton.vue';
import { useConfirm } from '@/composables/useConfirm.js';
import Spinner from '@/components/common/Spinner.vue';
import { spliceById } from '@/utils/helpers/array/spliceById.js';
import File from '@/components/common/Forms/File.vue';
import { usePreviewer } from '@/composables/usePreviewer.js';
import FileInput from '@/components/common/Forms/FileInput.vue';
import { useAuth } from '@/composables/useAuth.js';

const emit = defineEmits(['count-changed']);
const props = defineProps({
    task: {
        type: Object,
        required: true
    }
});

const notify = useNotify();

// preview

const { preview } = usePreviewer();

const openPreview = id => {
    preview(files.value, id);
};

// fetch

watch(
    () => props.task?.updated_at,
    () => {
        if (props.task.files_count > 0) fetchFiles();
        else files.value = [];
    }
);

const isLoading = ref(false);
const isError = ref(false);
const files = shallowRef([]);

async function fetchFiles() {
    isLoading.value = true;

    const response = await api.task.getFiles(props.task.id);
    if (response?.length) files.value = response;

    isLoading.value = false;
}

onMounted(async () => {
    if (props.task.files_count > 0) {
        try {
            await fetchFiles();

            if (props.task.files_count !== files.value.length)
                emit('count-changed', files.value.length);
        } catch (e) {
            isError.value = true;
        }
    }
});

// DELETE

const { confirm } = useConfirm();
const { currentUserIsAdmin, currentUserId } = useAuth();

function canBeEdit(file) {
    return (
        currentUserIsAdmin.value ||
        (file.model_type === 'user' && file.model_id === currentUserId.value)
    );
}

const isDeleting = ref(false);

async function deleteFile(fileId) {
    const confirmed = await confirm('Вы уверены, что хотите безвозвратно удалить файл?');
    if (!confirmed) return;

    isDeleting.value = true;

    const deleted = await api.task.deleteFiles(props.task.id, { media_ids: [fileId] });

    isDeleting.value = false;

    if (deleted) {
        spliceById(files.value, fileId);
        emit('count-changed', files.value.length);
    }
}

// CREATE

const fileInputEl = useTemplateRef('fileInputEl');

const isCreating = ref(false);
const newFiles = ref([]);

async function addFiles() {
    if (!newFiles.value?.length) return;

    isCreating.value = true;

    const response = await api.task.addFiles(props.task.id, { files: newFiles.value });

    if (response) {
        newFiles.value = [];
        fileInputEl.value.clear();
        notify.success('Файлы успешно добавлены.');

        files.value = response;
        emit('count-changed', files.value.length);
    }

    isCreating.value = false;
}
</script>
