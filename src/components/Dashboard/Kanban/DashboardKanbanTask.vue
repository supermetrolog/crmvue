<template>
    <div class="dashboard-kanban-task" :class="{ updating: task.isUpdating }">
        <div
            class="dashboard-kanban-task__header"
            :class="{ handle: draggable && !task.isUpdating, expired: expired.isAlreadyExpired }"
        >
            <i
                v-if="expired.isExpired"
                class="fa-solid fa-fire dashboard-cl-danger dashboard-kanban-task__expired"
            />
            <DashboardChip class="dashboard-bg-primary-l">от {{ started }}</DashboardChip>
            <DashboardChip class="dashboard-kanban-task__badge" :class="expired.class">
                до {{ expired.date }}
            </DashboardChip>
            <div v-if="editable && !task.isUpdating" class="dashboard-kanban-task__actions">
                <HoverActionsButton @click="$emit('edit')" label="Редактировать">
                    <i class="fa-solid fa-pen"></i>
                </HoverActionsButton>
                <HoverActionsButton @click="$emit('delete')" label="Удалить">
                    <i class="fa-solid fa-trash"></i>
                </HoverActionsButton>
            </div>
        </div>
        <div class="dashboard-kanban-task__body">
            <Avatar
                v-tippy="task.created_by?.userProfile?.medium_name"
                :src="task.created_by?.userProfile?.avatar"
                :size="35"
            />
            <div class="dashboard-kanban-task__text">
                {{ task.message }}
            </div>
        </div>
        <div class="dashboard-kanban-task__footer">
            <span>Исполнители:</span>
            <Avatar
                v-tippy="task.user?.userProfile?.medium_name"
                :src="task.user?.userProfile?.avatar"
                :size="35"
            />
        </div>
    </div>
</template>

<script>
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import dayjs from 'dayjs';
import Avatar from '@/components/common/Avatar.vue';
import { entityOptions } from '@/const/options/options.js';
import HoverActionsButton from '@/components/common/HoverActions/HoverActionsButton.vue';

export default {
    name: 'DashboardKanbanTask',
    components: { HoverActionsButton, Avatar, DashboardChip },
    emits: ['edit', 'delete'],
    props: {
        task: {
            type: Object,
            required: true
        },
        editable: {
            type: Boolean,
            default: false
        },
        draggable: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        isCompleted() {
            return this.task.status === entityOptions.task.statusTypes.COMPLETED;
        },
        started() {
            const date = dayjs(this.task.start);
            return date.isSame(dayjs(), 'year') ? date.format('D MMM') : date.format('D.MM.YY');
        },
        expired() {
            const date = dayjs(this.task.end);

            return {
                date: date.isSame(dayjs(), 'year') ? date.format('D MMM') : date.format('D.MM.YY'),
                class:
                    date.diff(dayjs(), 'day') < 5 && !this.isCompleted
                        ? 'dashboard-bg-danger dashboard-cl-white'
                        : 'dashboard-bg-primary-l',
                isExpired: date.diff(dayjs(), 'day') <= 3 && !this.isCompleted,
                isAlreadyExpired: date.isBefore(dayjs()) && !this.isCompleted
            };
        }
    }
};
</script>
