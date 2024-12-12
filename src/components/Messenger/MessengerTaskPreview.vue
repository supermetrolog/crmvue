<template>
    <Modal @close="submit" :show="isVisible" title="Просмотр задачи" :width="1100">
        <template #container>
            <div v-if="isLoading" class="messenger-task-previewer">
                <Spinner class="absolute-center" label="Загрузка задачи.." />
            </div>
            <TaskCard
                v-else
                @updated="onUpdated"
                @to-chat="submit"
                @read="readTask"
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
import { toDateFormat } from '@/utils/formatters/date.js';
import api from '@/api/api.js';
import Spinner from '@/components/common/Spinner.vue';
import TaskCard from '@/components/TaskCard/TaskCard.vue';
import { useDelayedLoader } from '@/composables/useDelayedLoader.js';

const store = useStore();

const currentTask = ref(null);
const { isLoading } = useDelayedLoader();

const readTask = () => {
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
};

const {
    isVisible,
    onPopupShowed,
    destroy: destroyPopup,
    submit: _submit,
    cancel,
    props
} = useAsyncPopup('messengerTaskPreview');

const fetchTask = async taskId => {
    isLoading.value = true;

    const task = await api.task.getOne(taskId);
    if (task) currentTask.value = task;
    else cancel();

    isLoading.value = false;
};

onPopupShowed(async () => {
    await fetchTask(props.value.task.id);
});

onUnmounted(() => {
    destroyPopup();
});

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

const onUpdated = task => {
    Object.assign(currentTask.value, task);
};

const submit = () => {
    _submit(currentTask.value);
};
</script>
