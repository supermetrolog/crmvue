<template>
    <div class="dashboard-task-item-preview__comments dashboard-task-item-preview-comments">
        <div class="d-flex justify-content-between">
            <p class="dashboard-task-item-preview__label">Список всех комментариев</p>
            <i
                v-tippy="'Закрыть'"
                @click="$emit('close')"
                class="dashboard-task-item-preview__close fa-regular fa-xmark-circle"
            />
        </div>
        <Spinner v-if="isLoading" class="absolute-center" />
        <template v-else>
            <div
                v-if="comments.length"
                ref="commentsNode"
                class="dashboard-task-item-preview__comments-list"
            >
                <div class="dashboard-task-item-preview__list position-relative">
                    <Loader v-if="isCreating" class="center" />
                    <DashboardTableTasksItemPreviewComment
                        v-for="comment in comments"
                        :key="comment.id"
                        :comment="comment"
                    />
                </div>
            </div>
            <EmptyLabel v-else>Список комментариев пуст</EmptyLabel>
            <div class="dashboard-task-item-preview__form">
                <Textarea
                    v-model="newComment"
                    class="mb-1 dashboard-task-item-preview__textarea"
                    label="Оставьте комментарий"
                />
                <div class="d-flex gap-2">
                    <button
                        @click.prevent="addComment"
                        :disabled="!newComment?.length || isCreating"
                        class="dashboard-task-item-preview__button"
                    >
                        Отправить
                    </button>
                    <button
                        @click.prevent="$emit('close')"
                        class="dashboard-task-item-preview__button"
                    >
                        Закрыть
                    </button>
                </div>
            </div>
        </template>
    </div>
</template>

<script setup>
import { useDelayedLoader } from '@/composables/useDelayedLoader.js';
import api from '@/api/api.js';
import EmptyLabel from '@/components/common/EmptyLabel.vue';
import DashboardTableTasksItemPreviewComment from '@/components/Dashboard/Table/TasksItem/DashboardTableTasksItemPreviewComment.vue';
import { onBeforeMount, ref, shallowRef, watch } from 'vue';
import Spinner from '@/components/common/Spinner.vue';
import Textarea from '@/components/common/Forms/Textarea.vue';
import { useNotify } from '@/utils/useNotify.js';
import Loader from '@/components/common/Loader.vue';

const emit = defineEmits(['close', 'added-comment']);
const props = defineProps({
    taskId: {
        type: Number,
        required: true
    }
});

const notify = useNotify();

const { isLoading } = useDelayedLoader();
const comments = ref([]);
const newComment = shallowRef('');
const isCreating = shallowRef(false);
const commentsNode = shallowRef(null);

const fetchComments = async () => {
    isLoading.value = true;

    const response = await api.task.getComments(props.taskId);
    if (response) {
        comments.value = response;
    }

    isLoading.value = false;
};

const addComment = async () => {
    if (!newComment.value?.length) return;

    isCreating.value = true;

    const response = await api.task.createComment(props.taskId, { message: newComment.value });
    if (response) {
        comments.value.push(response);
        newComment.value = '';
        notify.success('Комментарий успешно добавлен.');
        emit('added-comment', response);
    }

    isCreating.value = false;
};

watch(
    () => commentsNode.value,
    () => {
        scrollToEnd();
    }
);

const scrollToEnd = async () => {
    commentsNode.value.scrollTop = commentsNode.value.scrollHeight;
};

onBeforeMount(() => {
    fetchComments();
});
</script>
