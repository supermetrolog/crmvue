<template>
    <div v-if="previewIsLoading" class="dashboard-tasks-table__card">
        <Spinner label="Загрузка задачи.." class="absolute-center" />
    </div>
    <TaskCard
        v-else-if="currentTask"
        @read="onRead"
        @to-chat="toChat"
        @updated="onUpdated"
        @deleted-comment="onDeletedComment"
        @added-comment="onAddedComment"
        @history-changed="onChangedHistory"
        @files-count-changed="onChangedFilesCount"
        @relations-count-changed="onChangedRelationsCount"
        class="dashboard-tasks-table__card"
        :task="currentTask"
        :draggable="userCanDrag"
        :editable="userCanEdit"
        :active-comment-id
    />
</template>
<script setup>
import Spinner from '@/components/common/Spinner.vue';
import TaskCard from '@/components/TaskCard/TaskCard.vue';
import { useMessenger } from '@/components/Messenger/useMessenger.js';
import { useAuth } from '@/composables/useAuth';
import { computed, onBeforeMount, ref } from 'vue';
import api from '@/api/api.js';
import { toDateFormat } from '@/utils/formatters/date.ts';
import { spliceById } from '@/utils/helpers/array/spliceById.js';
import { isObject } from '@/utils/helpers/object/isObject.js';

const emit = defineEmits(['updated', 'close']);

const props = defineProps({
    taskId: {
        type: Number,
        required: true
    },
    activeCommentId: Number
});

const { openMessenger } = useMessenger();
const { currentUserId, currentUserIsModeratorOrHigher } = useAuth();

const currentTask = ref(null);

const userCanDrag = computed(() => {
    if (!currentTask.value) return false;

    return Boolean(
        currentTask.value.deleted_at === null &&
            (Number(currentTask.value.created_by_id) === Number(currentUserId.value) ||
                Number(currentTask.value.user_id) === Number(currentUserId.value) ||
                currentUserIsModeratorOrHigher.value)
    );
});

const userCanEdit = computed(() => {
    if (!currentTask.value) return false;

    return Boolean(
        Number(currentTask.value.created_by_id) === Number(currentUserId.value) ||
            currentUserIsModeratorOrHigher.value
    );
});

const previewIsLoading = ref(false);

async function fetchTaskPreview() {
    previewIsLoading.value = true;

    const response = await api.task.getOne(props.taskId);

    if (response) currentTask.value = response;
    previewIsLoading.value = false;
}

onBeforeMount(fetchTaskPreview);

function onRead() {
    const viewerIndex = currentTask.value.observers.findIndex(
        element => element.user_id === currentUserId.value
    );
    if (viewerIndex !== -1)
        currentTask.value.observers[viewerIndex].viewed_at = toDateFormat(Date.now());

    emit('updated', {
        id: currentTask.value.id,
        observers: currentTask.value.observers,
        is_viewed: currentTask.value.user_id === currentUserId.value,
        viewed_at: Date.now()
    });
}

async function toChat(payload) {
    const opened = await openMessenger(payload);

    if (opened) {
        emit('close');
    }
}

function onUpdated(task) {
    if (isObject(task)) {
        Object.assign(currentTask.value, task);
        emit('updated', task);
    }
}

function onDeletedComment(commentId) {
    currentTask.value.comments_count--;
    spliceById(currentTask.value.last_comments, commentId);
}

function onAddedComment(comment) {
    currentTask.value.comments_count++;
    currentTask.value.last_comments.unshift(comment);
}

function onChangedHistory(count) {
    currentTask.value.histories_count = count;
}

function onChangedFilesCount(count) {
    currentTask.value.files_count = count;
}

function onChangedRelationsCount(count) {
    currentTask.value.relations_count = count;
}
</script>
