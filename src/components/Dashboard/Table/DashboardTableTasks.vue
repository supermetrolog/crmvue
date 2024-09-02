<template>
    <div class="dashboard-tasks-table">
        <template v-if="isLoading">
            <DashboardTasksItemSkeleton v-for="i in lastElementsCount" :key="i" />
        </template>
        <template v-else>
            <DashboardTableTasksItem
                v-for="task in tasks"
                :key="task.id"
                @view="openPreviewer(task, $event)"
                :task="task"
            />
            <EmptyData v-if="!tasks.length">Список задач пуст..</EmptyData>
        </template>
    </div>
</template>

<script setup>
import DashboardTableTasksItem from '@/components/Dashboard/Table/TasksItem/DashboardTableTasksItem.vue';
import DashboardTasksItemSkeleton from '@/components/Dashboard/Table/TasksItem/DashboardTableTasksItemSkeleton.vue';
import { useStore } from 'vuex';
import EmptyData from '@/components/common/EmptyData.vue';
import { computed, h, inject, ref, shallowRef, watch } from 'vue';
import DashboardTableTasksItemPreview from '@/components/Dashboard/Table/TasksItem/DashboardTableTasksItemPreview.vue';
import { useTippy } from 'vue-tippy';
import api from '@/api/api.js';
import { toDateFormat } from '@/utils/formatter.js';

const props = defineProps({
    tasks: {
        type: Array,
        default: () => []
    },
    isLoading: {
        type: Boolean,
        default: false
    }
});
const $openMessengerChat = inject('$openMessengerChat');

const store = useStore();

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
            (Number(currentTask.value.created_by_id) === Number(store.getters.THIS_USER.id) ||
                Number(currentTask.value.user_id) === Number(store.getters.THIS_USER.id) ||
                store.getters.isModerator)
    );
});

const userCanEdit = computed(() => {
    if (!currentTask.value) return false;
    return Boolean(
        Number(currentTask.value.created_by_id) === Number(store.getters.THIS_USER.id) ||
            store.getters.isModerator
    );
});

const fetchTaskPreview = async id => {
    previewIsLoading.value = true;
    const response = await api.task.getOne(id);
    if (response) currentTask.value = response;
    previewIsLoading.value = false;
};

const openPreviewer = (task, event) => {
    if (currentTask.value && currentTask.value.id === task.id && previewIsVisible.value) return;

    fetchTaskPreview(task.id);

    previewIsVisible.value = true;
    setProps({
        getReferenceClientRect: () => ({
            width: 0,
            height: 0,
            top: event.clientY,
            bottom: event.clientY,
            left: event.clientX,
            right: event.clientX
        })
    });

    show();
};

const { show, setProps, hide } = useTippy(() => document.body, {
    content: computed(() =>
        h(DashboardTableTasksItemPreview, {
            task: currentTask.value,
            draggable: userCanDrag.value,
            editable: userCanEdit.value,
            visible: previewIsVisible.value,
            loading: previewIsLoading.value,
            onUpdated(task) {
                Object.assign(currentTask.value, task);
                const currentTaskIndex = props.tasks.findIndex(element => element.id === task.id);
                if (currentTaskIndex !== -1) Object.assign(props.tasks[currentTaskIndex], task);
            },
            async onToChat(payload) {
                const opened = await $openMessengerChat(payload);
                if (opened) hide();
            },
            onRead() {
                const viewerIndex = currentTask.value.observers.findIndex(
                    element => element.user_id === store.getters.THIS_USER.id
                );
                if (viewerIndex !== -1)
                    currentTask.value.observers[viewerIndex].viewed_at = toDateFormat(Date.now());

                const currentTaskIndex = props.tasks.findIndex(
                    element => element.id === currentTask.value.id
                );
                if (currentTaskIndex !== -1)
                    Object.assign(props.tasks[currentTaskIndex].observers[viewerIndex], {
                        viewed_at: toDateFormat(Date.now())
                    });
            }
        })
    ),
    placement: 'bottom-start',
    trigger: 'manual',
    interactive: true,
    arrow: false,
    offset: [10, 10],
    popperOptions: {
        strategy: 'fixed',
        modifiers: [
            {
                name: 'flip',
                options: {
                    fallbackPlacements: ['bottom', 'right']
                }
            },
            {
                name: 'preventOverflow',
                options: {
                    altAxis: true,
                    tether: false
                }
            }
        ]
    },
    onClickOutside() {
        previewIsVisible.value = false;
    },
    onHidden() {
        previewIsVisible.value = false;
    },
    zIndex: 3333,
    maxWidth: 1000
});
</script>
