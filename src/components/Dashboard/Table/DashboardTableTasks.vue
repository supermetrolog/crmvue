<template>
    <div class="dashboard-tasks-table">
        <template v-if="isLoading">
            <DashboardTasksItemSkeleton v-for="i in lastElementsCount" :key="i" />
        </template>
        <template v-else-if="!hidden">
            <DashboardTableTasksItem
                v-for="task in tasks"
                :key="task.id"
                @view="openPreviewer(task, $event)"
                :task="task"
            />
            <EmptyData v-if="!tasks.length">Список задач пуст..</EmptyData>
        </template>
        <UiModal v-model:visible="previewIsVisible" title="Просмотр задачи" :blackout-opacity="0.5">
            <template #container>
                <div v-if="previewIsLoading" class="dashboard-tasks-table__card">
                    <Spinner label="Загрузка задачи.." class="absolute-center" />
                </div>
                <TaskCard
                    v-else
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
                />
            </template>
        </UiModal>
    </div>
</template>

<script setup>
import DashboardTableTasksItem from '@/components/Dashboard/Table/TasksItem/DashboardTableTasksItem.vue';
import DashboardTasksItemSkeleton from '@/components/Dashboard/Table/TasksItem/DashboardTableTasksItemSkeleton.vue';
import EmptyData from '@/components/common/EmptyData.vue';
import { computed, ref, shallowRef, watch } from 'vue';
import TaskCard from '@/components/TaskCard/TaskCard.vue';
import api from '@/api/api.js';
import { useMessenger } from '@/components/Messenger/useMessenger.js';
import { useAuth } from '@/composables/useAuth';
import Spinner from '@/components/common/Spinner.vue';
import { toDateFormat } from '@/utils/formatters/date.ts';
import { spliceById } from '@/utils/helpers/array/spliceById.js';
import UiModal from '@/components/common/UI/UiModal.vue';

const emit = defineEmits(['task-updated', 'hide']);
const props = defineProps({
    tasks: {
        type: Array,
        default: () => []
    },
    isLoading: Boolean,
    hidden: Boolean
});

const { openMessenger } = useMessenger();
const { currentUserId, currentUserIsModeratorOrHigher } = useAuth();

const lastElementsCount = shallowRef(5);
const currentTask = ref(null);
const previewIsVisible = shallowRef(false);
const previewIsLoading = shallowRef(false);

watch(
    () => props.isLoading,
    value => {
        if (!value) lastElementsCount.value = Math.min(props.tasks.length, 5) || 4;
    }
);

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

const fetchTaskPreview = async id => {
    previewIsLoading.value = true;

    const response = await api.task.getOne(id);

    if (response) currentTask.value = response;
    previewIsLoading.value = false;
};

const openPreviewer = task => {
    fetchTaskPreview(task.id);

    previewIsVisible.value = true;
};

function onRead() {
    const viewerIndex = currentTask.value.observers.findIndex(
        element => element.user_id === currentUserId.value
    );
    if (viewerIndex !== -1)
        currentTask.value.observers[viewerIndex].viewed_at = toDateFormat(Date.now());

    emit('task-updated', {
        id: currentTask.value.id,
        observers: currentTask.value.observers,
        is_viewed: currentTask.value.user_id === currentUserId.value,
        viewed_at: Date.now()
    });
}

async function toChat(payload) {
    const opened = await openMessenger(payload);
    if (opened) {
        hide();
        emit('hide');
    }
}

function hide() {
    previewIsVisible.value = false;
    currentTask.value = false;
}

function onUpdated(task) {
    Object.assign(currentTask.value, task);
    emit('task-updated', task);
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
