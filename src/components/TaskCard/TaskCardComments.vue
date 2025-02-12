<template>
    <div>
        <div v-if="comments.length" class="task-card__comments-list">
            <div class="task-card__list position-relative">
                <Loader v-if="isCreating" small class="center" />
                <TaskCardComment
                    v-for="comment in comments"
                    :key="comment.id"
                    @preview="openPreview(comment.files, $event)"
                    @delete="deleteComment(comment.id)"
                    @edit="editComment(comment)"
                    :comment="comment"
                    editable
                />
                <InfiniteLoading
                    v-if="infiniteIsActive && task.comments_count > 5"
                    @infinite="loadComments"
                >
                    <template #complete><span></span></template>
                    <template #spinner>
                        <Spinner class="small" />
                    </template>
                </InfiniteLoading>
            </div>
        </div>
        <p v-else>Комментарии отсутствуют..</p>
        <div class="task-card__form">
            <div v-if="files.length" class="row mb-1">
                <File
                    v-for="(file, key) in files"
                    :key="file"
                    @delete="deleteFile(key)"
                    :file="file"
                    class="col-3"
                />
            </div>
            <FileInput ref="fileInputElement" v-model:native="files" hidden custom />
            <Textarea
                v-model="newComment"
                class="mb-1 task-card__textarea"
                :disabled="isCreating"
                auto-height
            />
            <div class="d-flex gap-2">
                <TaskCardButton
                    @click.prevent="addComment"
                    :disabled="(!newComment?.length && !files.length) || isCreating"
                >
                    Отправить
                </TaskCardButton>
                <TaskCardButton @click.prevent="openFileDialog" :disabled="isCreating">
                    <i class="fa-solid fa-file-circle-plus mr-1" />
                    <span>Прикрепить файл</span>
                </TaskCardButton>
            </div>
        </div>
        <UiModal
            v-model:visible="editFormIsVisible"
            @close="closeEditForm"
            :width="500"
            custom-close
            title="Редактирование комментария"
        >
            <FormTaskComment
                @close="closeEditForm"
                @updated="updateComment"
                :form-data="editingComment"
            />
        </UiModal>
    </div>
</template>

<script setup>
import api from '@/api/api.js';
import TaskCardComment from '@/components/TaskCard/TaskCardComment.vue';
import { ref, shallowRef, useTemplateRef, watch } from 'vue';
import Textarea from '@/components/common/Forms/Textarea.vue';
import { useNotify } from '@/utils/use/useNotify.js';
import Loader from '@/components/common/Loader.vue';
import TaskCardButton from '@/components/TaskCard/TaskCardButton.vue';
import { useConfirm } from '@/composables/useConfirm.js';
import Spinner from '@/components/common/Spinner.vue';
import InfiniteLoading from 'v3-infinite-loading';
import { isNullish } from '@/utils/helpers/common/isNullish.js';
import { spliceById } from '@/utils/helpers/array/spliceById.js';
import File from '@/components/common/Forms/File.vue';
import FileInput from '@/components/common/Forms/FileInput.vue';
import FormTaskComment from '@/components/Forms/FormTaskComment.vue';
import UiModal from '@/components/common/UI/UiModal.vue';
import { usePreviewer } from '@/composables/usePreviewer.js';
import { isImageMedia } from '@/utils/helpers/models/media.js';

const emit = defineEmits(['created', 'deleted']);
const props = defineProps({
    task: {
        type: Object,
        required: true
    }
});

const comments = shallowRef([...props.task.last_comments]);

watch(
    () => props.task.last_comments[0]?.id,
    (newValue, oldValue) => {
        if (isNullish(newValue)) return;

        if (isNullish(oldValue)) comments.value = [...props.task.last_comments];
        else if (newValue > oldValue)
            comments.value.unshift(
                ...props.task.last_comments.filter(comment => comment.id > oldValue)
            );
        else comments.value = comments.value.filter(comment => comment.id <= newValue);
    }
);

const notify = useNotify();

const infiniteIsActive = ref(true);

async function loadComments($state) {
    const response = await api.task.loadComments(
        props.task.id,
        comments.value[comments.value.length - 1].id
    );

    if (response) {
        if (response.length) comments.value.push(...response);
        if (response.length < 5) $state.complete();
        else $state.loaded();

        infiniteIsActive.value = false;
    }
}

// EDIT

const editFormIsVisible = ref(false);
const editingComment = ref(null);

function editComment(comment) {
    editingComment.value = comment;
    editFormIsVisible.value = true;
}

function updateComment(response) {
    const commentIndex = comments.value.findIndex(comment => comment.id === response.id);
    if (commentIndex !== -1) Object.assign(comments.value[commentIndex], response);

    closeEditForm();
}

function closeEditForm() {
    editFormIsVisible.value = false;
    editingComment.value = null;
}

// DELETE

const { confirm } = useConfirm();

async function deleteComment(commentId) {
    const confirmed = await confirm('Вы уверены, что хотите безвозвратно удалить комментарий?');
    if (!confirmed) return;

    const deleted = await api.taskComment.delete(commentId);

    if (deleted) {
        spliceById(comments.value, commentId);
        emit('deleted', commentId);
    }
}

// CREATE

const isCreating = ref(false);
const newComment = shallowRef('');

async function addComment() {
    if (!newComment.value?.length && !files.value.length) return;

    isCreating.value = true;

    const response = await api.task.createComment(props.task.id, {
        message: newComment.value,
        files: files.value
    });

    if (response) {
        newComment.value = '';
        files.value = [];

        notify.success('Комментарий успешно добавлен.');
        emit('created', response);
    }

    isCreating.value = false;
}

// files

const fileInputElement = useTemplateRef('fileInputElement');
const files = ref([]);

function openFileDialog() {
    fileInputElement.value.clickOpenFile();
}

function deleteFile(fileIndex) {
    files.value.splice(fileIndex, 1);
}

// preview

const { preview } = usePreviewer();

function openPreview(files, id) {
    preview(
        files.filter(isImageMedia).map(file => ({
            id: file.id,
            src: file.src
        })),
        id
    );
}
</script>
