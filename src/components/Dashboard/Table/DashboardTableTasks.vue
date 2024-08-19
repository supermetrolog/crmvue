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
import DashboardTableTasksItem from '@/components/Dashboard/Table/DashboardTableTasksItem.vue';
import DashboardTasksItemSkeleton from '@/components/Dashboard/Table/DashboardTableTasksItemSkeleton.vue';
import { useStore } from 'vuex';
import EmptyData from '@/components/common/EmptyData.vue';
import { computed, h, inject, ref, shallowRef, watch } from 'vue';
import DashboardTableTasksItemPreview from '@/components/Dashboard/Table/DashboardTableTasksItemPreview.vue';
import { useTippy } from 'vue-tippy';

defineEmits(['edit']);
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

const openPreviewer = (task, event) => {
    if (currentTask.value && currentTask.value.id === task.id && previewIsVisible.value) return;

    previewIsVisible.value = true;
    currentTask.value = task;
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

const { show, setProps } = useTippy(() => document.body, {
    content: computed(() =>
        h(DashboardTableTasksItemPreview, {
            task: currentTask.value,
            draggable: userCanDrag.value,
            editable: userCanEdit.value,
            visible: previewIsVisible.value,
            onUpdated(task) {
                Object.assign(currentTask.value, task);
            },
            onToChat() {
                const companyID =
                    currentTask.value.relation.model_type === 'request'
                        ? currentTask.value.relation.model.company_id
                        : currentTask.value.relation.model.object.company_id;

                $openMessengerChat({
                    companyID,
                    objectID: currentTask.value.relation.model.id,
                    modelType: currentTask.value.relation.model_type
                });
            }
        })
    ),
    placement: 'bottom-start',
    trigger: 'manual',
    interactive: true,
    arrow: false,
    offset: [10, 10],
    onClickOutside() {
        previewIsVisible.value = false;
    },
    onHidden() {
        previewIsVisible.value = false;
    },
    zIndex: 3333,
    maxWidth: 500
});
</script>
