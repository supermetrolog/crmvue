<template>
    <Modal
        @close="submit"
        :show="isVisible"
        title="Просмотр задачи"
        :width="1100"
        :blackout-opacity="0.5"
    >
        <template #container>
            <div v-if="isLoading" class="messenger-task-previewer">
                <Spinner class="absolute-center" label="Загрузка задачи.." />
            </div>
            <TaskCard
                v-else
                @updated="onUpdated"
                @to-chat="submit"
                @read="readTask"
                @added-comment="onAddedComment"
                @deleted-comment="onDeletedComment"
                @files-count-changed="onChangedFilesCount"
                class="messenger-task-previewer"
                :task="currentTask"
                :draggable="userCanDrag"
                :editable="userCanEdit"
                visible
            />
        </template>
    </Modal>
</template>
<script setup>
import { computed, onUnmounted, ref } from 'vue';
import { useAsyncPopup } from '@/composables/useAsyncPopup.js';
import Modal from '@/components/common/Modal.vue';
import { useStore } from 'vuex';
import { toDateFormat } from '@/utils/formatters/date.ts';
import api from '@/api/api.js';
import Spinner from '@/components/common/Spinner.vue';
import TaskCard from '@/components/TaskCard/TaskCard.vue';
import { useDelayedLoader } from '@/composables/useDelayedLoader.js';
import { spliceById } from '@/utils/helpers/array/spliceById.js';
import { isObject } from '@/utils/helpers/object/isObject.js';

const store = useStore();

const {
    isVisible,
    onPopupShowed,
    destroy: destroyPopup,
    submit: _submit,
    cancel,
    props
} = useAsyncPopup('messengerTaskPreview');

onPopupShowed(async () => {
    await fetchTask(props.value.task.id);
});

const currentTask = ref(null);
const { isLoading } = useDelayedLoader();

async function fetchTask(taskId) {
    isLoading.value = true;

    const task = await api.task.getOne(taskId);
    if (task) currentTask.value = task;
    else cancel();

    isLoading.value = false;
}

function readTask() {
    const viewerIndex = currentTask.value.observers.findIndex(
        element => element.user_id === store.getters.THIS_USER.id
    );
    if (viewerIndex !== -1)
        currentTask.value.observers[viewerIndex].viewed_at = toDateFormat(Date.now());

    submit({
        id: currentTask.value.id,
        observers: currentTask.value.observers,
        is_viewed: currentTask.value.user_id === store.getters.THIS_USER.id
    });
}

function submit() {
    _submit(currentTask.value);
}

function onUpdated(task) {
    if (isObject(task)) {
        Object.assign(currentTask.value, task);
    }
}

function onAddedComment(comment) {
    currentTask.value.comments_count++;
    currentTask.value.last_comments.unshift(comment);
}

function onDeletedComment(commentId) {
    currentTask.value.comments_count--;
    spliceById(currentTask.value.last_comments, commentId);
}

function onChangedFilesCount(count) {
    currentTask.value.files_count = count;
}

const userCanEdit = computed(() => {
    if (!currentTask.value) return false;
    return Boolean(
        Number(currentTask.value.created_by_id) === Number(store.getters.THIS_USER.id) ||
            store.getters.isModerator
    );
});

const userCanDrag = computed(() => {
    if (!currentTask.value) return false;
    return Boolean(
        currentTask.value.deleted_at === null &&
            (Number(currentTask.value.created_by_id) === Number(store.getters.THIS_USER.id) ||
                Number(currentTask.value.user_id) === Number(store.getters.THIS_USER.id) ||
                store.getters.isModerator)
    );
});

onUnmounted(() => {
    destroyPopup();
});
</script>
