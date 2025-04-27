<template>
    <div class="task-card__comments task-card-comments">
        <div
            v-if="comments.length"
            class="task-card__comments-list"
            :class="{ 'task-card__comments-list--shorted': files.length }"
        >
            <Loader
                v-if="isCreating || isDeleting"
                small
                class="center"
                :label="isDeleting ? 'Удаление комментария' : 'Сохранение комментария'"
            />
            <div class="task-card__list position-relative">
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
                    v-if="infiniteIsActive && task.comments_count > 10"
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
            <div v-if="files.length" class="task-card__form-files row mb-1">
                <File
                    v-for="(file, key) in files"
                    :key="file"
                    @delete="deleteFile(key)"
                    :file="file"
                    class="col-3"
                />
            </div>
            <FileInput ref="fileInputElement" v-model:native="files" hidden custom />
            <div class="task-card-form">
                <UiButton
                    @click="openFileDialog"
                    class="task-card-form__button"
                    :disabled="isCreating"
                    color="warning"
                >
                    <i class="fa-solid fa-paperclip"></i>
                </UiButton>
                <UiTextarea
                    ref="textareaEl"
                    v-model="newComment"
                    :disabled="isCreating"
                    auto-height
                    :max-height="110"
                    :min-height="50"
                    placeholder="Напишите сообщение..."
                    class="task-card-form__editor"
                />
                <UiButton
                    @click="addComment"
                    :disabled="(!newComment?.length && !files.length) || isCreating"
                    color="success"
                    class="task-card-form__button"
                >
                    <i class="fa-solid fa-paper-plane"></i>
                </UiButton>
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
import UiTextarea from '@/components/common/Forms/UiTextarea.vue';
import { useNotify } from '@/utils/use/useNotify.js';
import Loader from '@/components/common/Loader.vue';
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
import { usePasteFiles } from '@/composables/usePasteFiles.js';
import { useAsync } from '@/composables/useAsync.js';
import UiButton from '@/components/common/UI/UiButton.vue';

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
    try {
        const response = await api.task.loadComments(
            props.task.id,
            comments.value[comments.value.length - 1].id
        );

        if (response) {
            if (response.length) comments.value.push(...response);
            if (response.length < 10) $state.complete();
            else $state.loaded();

            infiniteIsActive.value = false;
        }
    } catch (error) {
        infiniteIsActive.value = false;
        $state.complete();
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

const { execute: deleteComment, isLoading: isDeleting } = useAsync(api.taskComment.delete, {
    onFetchResponse({ args }) {
        spliceById(comments.value, args[0]);
        emit('deleted', args[0]);
    },
    confirmation: true,
    confirmationContent: {
        title: 'Удалить комментарий',
        message: 'Вы уверены, что хотите безвозвратно удалить комментарий?',
        okButton: 'Удалить',
        okIcon: 'fa-solid fa-trash'
    }
});

// CREATE

const isCreating = ref(false);
const newComment = shallowRef('');

async function addComment() {
    if (!newComment.value?.length && !files.value.length) return;

    isCreating.value = true;

    try {
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
    } finally {
        isCreating.value = false;
    }
}

// files

const fileInputElement = useTemplateRef('fileInputElement');
const files = ref([]);

function openFileDialog() {
    fileInputElement.value.open();
}

function deleteFile(fileIndex) {
    files.value.splice(fileIndex, 1);
}

const textareaEl = useTemplateRef('textareaEl');

usePasteFiles(textareaEl, files);

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
