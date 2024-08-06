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
                v-model="items"
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
                    <EmptyLabel v-if="!items.length" class="mb-2">Список задач пуст...</EmptyLabel>
                </template>
            </VirtualDragList>
        </div>
    </div>
</template>

<script>
import DashboardKanbanTask from '@/components/Dashboard/Kanban/DashboardKanbanTask.vue';
import VirtualDragList from 'vue-virtual-draglist';
import InfiniteLoading from 'v3-infinite-loading';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import { mapGetters } from 'vuex';
import DashboardKanbanTaskSkeleton from '@/components/Dashboard/Kanban/DashboardKanbanTaskSkeleton.vue';
import EmptyLabel from '@/components/common/EmptyLabel.vue';

export default {
    name: 'DashboardKanbanBoard',
    components: {
        EmptyLabel,
        DashboardKanbanTaskSkeleton,
        DashboardChip,
        InfiniteLoading,
        VirtualDragList,
        DashboardKanbanTask
    },
    emits: ['load', 'add', 'delete', 'edit', 'update:modelValue'],
    props: {
        title: {
            type: String,
            required: true
        },
        modelValue: {
            type: Array,
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
    },
    data() {
        return {
            lastElementsCount: 3
        };
    },
    computed: {
        ...mapGetters({ currentUser: 'THIS_USER' }),
        items: {
            get() {
                return this.modelValue;
            },
            set(value) {
                this.$emit('update:modelValue', value);
            }
        }
    },
    watch: {
        isLoading(value) {
            if (!value) this.lastElementsCount = Math.min(this.items.length, 4) || 1;
        }
    },
    methods: {
        dropHandler(event) {
            if (event.changed && event.oldIndex === -1) this.$emit('add', event.item);
        },
        userCanDrag(task) {
            return (
                task.deleted_at === null &&
                (Number(task.created_by_id) === Number(this.currentUser.id) ||
                    Number(task.user_id) === Number(this.currentUser.id) ||
                    this.$store.getters.isModerator)
            );
        },
        userCanEdit(task) {
            return (
                Number(task.created_by_id) === Number(this.currentUser.id) ||
                this.$store.getters.isModerator
            );
        }
    }
};
</script>
<style>
.flip-list-move {
    transition: transform 0.5s;
}
.no-move {
    transition: transform 0s;
}
</style>
