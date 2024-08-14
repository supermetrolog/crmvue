<template>
    <div class="dashboard-kanban-board">
        <div class="dashboard-kanban-board__header">
            <slot name="icon"></slot>
            <span>{{ title }} ({{ pagination?.totalCount ?? 0 }})</span>
            <div v-if="$slots.action" class="dashboard-kanban-board__actions">
                <slot name="action"></slot>
            </div>
        </div>
        <div class="dashboard-kanban-board__body">
            <div v-if="isLoading" class="dashboard-kanban-board__virtual">
                <DashboardKanbanTaskSkeleton
                    v-for="i in lastElementsCount"
                    :key="i"
                    class="virtual-dnd-list-item"
                />
            </div>
            <VirtualDragList
                v-else
                v-model="modelValue"
                @drop="dropHandler"
                group="kanban"
                class="dashboard-kanban-board__virtual"
                :data-key="'id'"
                :keeps="20"
                :sortable="false"
                handle=".handle"
                chosenClass="chosen"
            >
                <template #item="{ record }">
                    <DashboardKanbanTask
                        @edit="$emit('edit', record)"
                        @delete="$emit('delete', record)"
                        :task="record"
                        :draggable="userCanDrag(record)"
                        :editable="userCanEdit(record)"
                    />
                </template>
                <template #footer>
                    <InfiniteLoading
                        v-if="pagination?.pageCount > 1"
                        @infinite="$emit('load', $event)"
                    >
                        <template #complete>
                            <DashboardChip class="dashboard-bg-success-l w-100 text-center">
                                Задач больше нет
                            </DashboardChip>
                        </template>
                    </InfiniteLoading>
                    <EmptyLabel v-if="!modelValue.length" class="mb-2"
                        >Список задач пуст...</EmptyLabel
                    >
                </template>
            </VirtualDragList>
        </div>
    </div>
</template>

<script setup>
import DashboardKanbanTask from '@/components/Dashboard/Kanban/DashboardKanbanTask.vue';
import VirtualDragList from 'vue-virtual-draglist';
import InfiniteLoading from 'v3-infinite-loading';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import { useStore } from 'vuex';
import DashboardKanbanTaskSkeleton from '@/components/Dashboard/Kanban/DashboardKanbanTaskSkeleton.vue';
import EmptyLabel from '@/components/common/EmptyLabel.vue';
import { computed, shallowRef, watch } from 'vue';

const store = useStore();

const emit = defineEmits(['load', 'add', 'delete', 'edit']);
const props = defineProps({
    title: {
        type: String,
        required: true
    },
    pagination: {
        type: Object,
        default: null
    },
    isLoading: {
        type: Boolean,
        default: false
    }
});
const modelValue = defineModel({ type: Array, default: () => [] });

const lastElementsCount = shallowRef(3);

const currentUser = computed(() => store.getters.THIS_USER);
watch(
    () => props.isLoading,
    value => {
        if (!value) lastElementsCount.value = Math.min(modelValue.value.length, 4) || 1;
    }
);

const dropHandler = event => {
    if (event.changed && event.oldIndex === -1) emit('add', event.item);
};
const userCanDrag = task => {
    return (
        task.deleted_at === null &&
        (Number(task.created_by_id) === Number(currentUser.value.id) ||
            Number(task.user_id) === Number(currentUser.value.id) ||
            store.getters.isModerator)
    );
};
const userCanEdit = task =>
    Number(task.created_by_id) === Number(currentUser.value.id) || store.getters.isModerator;
</script>
<style>
.flip-list-move {
    transition: transform 0.5s;
}
.no-move {
    transition: transform 0s;
}
</style>
