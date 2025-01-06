<template>
    <div class="dashboard-favorite-tasks-table">
        <DashboardChip class="dashboard-bg-warning-l mb-4" with-icon>
            <i class="fa-solid fa-star"></i>
            <span>Избранный задачи</span>
        </DashboardChip>
        <VirtualDragList
            v-model="currentTasks"
            group="tasks"
            data-key="id"
            :keeps="40"
            chosenClass="chosen"
            wrap-class="dashboard-tasks-table"
            lockAxis="x"
        >
            <template #item="{ record }">
                <DashboardTableTasksItem @view="openPreviewer(record, $event)" :task="record" />
            </template>
        </VirtualDragList>
        <EmptyData v-if="!tasks.length">Список избранного пуст..</EmptyData>
        <Modal @close="previewIsVisible = false" :show="previewIsVisible">
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
                    class="dashboard-tasks-table__card"
                    :task="currentTask"
                    :draggable="userCanDrag"
                    :editable="userCanEdit"
                />
            </template>
        </Modal>
    </div>
</template>

<script setup>
import DashboardTableTasksItem from '@/components/Dashboard/Table/TasksItem/DashboardTableTasksItem.vue';
import { computed, ref, shallowRef } from 'vue';
import TaskCard from '@/components/TaskCard/TaskCard.vue';
import api from '@/api/api.js';
import { useMessenger } from '@/components/Messenger/useMessenger.js';
import { useAuth } from '@/composables/useAuth.js';
import Modal from '@/components/common/Modal.vue';
import Spinner from '@/components/common/Spinner.vue';
import { toDateFormat } from '@/utils/formatters/date.js';
import { spliceById } from '@/utils/helpers/array/spliceById.js';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import EmptyData from '@/components/common/EmptyData.vue';
import VirtualDragList from 'vue-virtual-draglist';

const emit = defineEmits(['task-updated', 'hide']);
const props = defineProps({
    tasks: {
        type: Array,
        default: () => []
    }
});

const currentTasks = ref([...props.tasks]);

const { openMessenger } = useMessenger();
const { currentUserId, currentUserIsModerator } = useAuth();

const currentTask = ref(null);
const previewIsVisible = shallowRef(false);
const previewIsLoading = shallowRef(false);

const userCanDrag = computed(() => {
    if (!currentTask.value) return false;
    return Boolean(
        currentTask.value.deleted_at === null &&
            (Number(currentTask.value.created_by_id) === Number(currentUserId.value) ||
                Number(currentTask.value.user_id) === Number(currentUserId.value) ||
                currentUserIsModerator.value)
    );
});

const userCanEdit = computed(() => {
    if (!currentTask.value) return false;
    return Boolean(
        Number(currentTask.value.created_by_id) === Number(currentUserId.value) ||
            currentUserIsModerator.value
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
</script>
