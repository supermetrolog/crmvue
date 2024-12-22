<template>
    <div>
        <div v-if="comments.length" class="task-card__comments-list">
            <div class="task-card__list position-relative">
                <Loader v-if="isCreating" small class="center" />
                <TaskCardComment
                    v-for="comment in comments"
                    :key="comment.id"
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
            <Textarea
                v-model="newComment"
                class="mb-1 task-card__textarea"
                :disabled="isCreating"
                auto-height
            />
            <div class="d-flex gap-2">
                <TaskCardButton
                    @click.prevent="addComment"
                    :disabled="!newComment?.length || isCreating"
                >
                    Отправить
                </TaskCardButton>
            </div>
        </div>
        <Modal
            @close="closeEditForm"
            :show="editFormIsVisible"
            width="500"
            title="Редактирование комментария"
        >
            <Loader v-if="isUpdating" small />
            <Form>
                <Textarea
                    v-model="editingComment.message"
                    class="mb-1 task-card__textarea"
                    label="Комментарий"
                    :disabled="isUpdating"
                    auto-height
                />
            </Form>
            <div class="d-flex gap-2">
                <TaskCardButton
                    @click.prevent="updateComment"
                    :disabled="!editingComment.message.length || isUpdating"
                >
                    Сохранить
                </TaskCardButton>
                <TaskCardButton @click.prevent="closeEditForm" :disabled="isUpdating">
                    Отмена
                </TaskCardButton>
            </div>
        </Modal>
    </div>
</template>

<script setup>
import api from '@/api/api.js';
import TaskCardComment from '@/components/TaskCard/TaskCardComment.vue';
import { ref, shallowRef, watch } from 'vue';
import Textarea from '@/components/common/Forms/Textarea.vue';
import { useNotify } from '@/utils/useNotify.js';
import Loader from '@/components/common/Loader.vue';
import TaskCardButton from '@/components/TaskCard/TaskCardButton.vue';
import { useConfirm } from '@/composables/useConfirm.js';
import { spliceById } from '@/utils/helpers/array/spliceById.js';
import Modal from '@/components/common/Modal.vue';
import Form from '@/components/common/Forms/Form.vue';
import Spinner from '@/components/common/Spinner.vue';
import InfiniteLoading from 'v3-infinite-loading';

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
    () => {
        comments.value.unshift(props.task.last_comments[0]);
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
const isUpdating = ref(false);

function editComment(comment) {
    editingComment.value = {
        id: comment.id,
        message: comment.message
    };

    editFormIsVisible.value = true;
}

async function updateComment() {
    isUpdating.value = true;

    const response = await api.taskComment.update(editingComment.value.id, editingComment.value);

    if (response) {
        const commentIndex = comments.value.findIndex(comment => comment.id === response.id);
        if (commentIndex !== -1) Object.assign(comments.value[commentIndex], response);

        closeEditForm();
    }

    isUpdating.value = false;
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
    if (!newComment.value?.length) return;

    isCreating.value = true;

    const response = await api.task.createComment(props.task.id, { message: newComment.value });

    if (response) {
        comments.value.unshift(response);
        newComment.value = '';
        notify.success('Комментарий успешно добавлен.');
        emit('created', response);
    }

    isCreating.value = false;
}
</script>
