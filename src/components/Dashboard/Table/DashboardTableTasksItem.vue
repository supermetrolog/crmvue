<template>
    <div class="dashboard-card-task" :class="{ expired: isAlreadyExpired }">
        <i
            v-if="isExpired"
            class="dashboard-card-task__icon fa-solid fa-fire dashboard-cl-danger"
        ></i>
        <span>#{{ task.id }}</span>
        <Avatar
            v-tippy="`Назначена на ${task.user.userProfile.medium_name}`"
            :src="task.user.userProfile.avatar"
            :size="35"
        />
        <p
            class="dashboard-card-task__text"
            :class="{ deleted: isDeleted, completed: isCompleted }"
        >
            {{ task.message }}
        </p>
        <div class="dashboard-card-task__meta">
            <Tooltip>
                <template #trigger>
                    <i class="fa-regular fa-circle-question dashboard-card-task__icon"></i>
                </template>
                <template #content>
                    <div class="dashboard-card-task__info">
                        <p class="dashboard-card-task__row">
                            <span>Создано: </span>
                            <span>{{ createdDate }}</span>
                        </p>
                        <p class="dashboard-card-task__row">
                            <span>Обновлено: </span>
                            <span>{{ updatedDate }}</span>
                        </p>
                        <p class="dashboard-card-task__row">
                            <span>Сгорает: </span>
                            <span>{{ expiredFullDate }}</span>
                        </p>
                        <p v-if="task.created_by_type === 'user'" class="dashboard-card-task__row">
                            <span>Создано пользователем: </span>
                            <span>{{ task.created_by.userProfile.medium_name }}</span>
                        </p>
                        <p class="dashboard-card-task__row">
                            <span>Назначена на: </span>
                            <span>{{ task.user.userProfile.medium_name }}</span>
                        </p>
                        <p v-if="task.deleted_at" class="dashboard-card-task__row">
                            <span>Удалено: </span>
                            <span>{{ deletedDate }}</span>
                        </p>
                    </div>
                </template>
            </Tooltip>
            <DashboardChip :class="statusColor">{{ status }}</DashboardChip>
            <DashboardChip v-if="isDeleted" class="dashboard-bg-danger dashboard-cl-white">
                Удалено
            </DashboardChip>
            <span class="dashboard-card-task__date">До {{ expiredDate }}</span>
            <div v-if="draggable" class="dashboard-card-task__moves">
                <HoverActionsButton
                    @click.stop="moveSettingsIsVisible = !moveSettingsIsVisible"
                    label="Изменить статус"
                >
                    <i class="fa-solid fa-arrow-right-arrow-left"></i>
                </HoverActionsButton>
                <div
                    v-if="moveSettingsIsVisible"
                    class="dashboard-card-task__moves-options hover-actions"
                >
                    <div class="hover-actions__content">
                        <HoverActionsButton
                            @click="$emit('toggle-status', entityOptions.task.statusTypes.NEW)"
                            :disabled="task.status === entityOptions.task.statusTypes.NEW"
                            label="Новая"
                        >
                            <i class="fa-solid fa-plus"></i>
                        </HoverActionsButton>
                        <HoverActionsButton
                            @click="
                                $emit('toggle-status', entityOptions.task.statusTypes.IN_PROGRESS)
                            "
                            :disabled="task.status === entityOptions.task.statusTypes.IN_PROGRESS"
                            label="В процессе"
                        >
                            <i class="fa-solid fa-hourglass-half"></i>
                        </HoverActionsButton>
                        <HoverActionsButton
                            @click="
                                $emit('toggle-status', entityOptions.task.statusTypes.COMPLETED)
                            "
                            :disabled="isCompleted"
                            label="Выполнена"
                        >
                            <i class="fa-regular fa-circle-check"></i>
                        </HoverActionsButton>
                        <HoverActionsButton
                            @click="$emit('toggle-status', entityOptions.task.statusTypes.CANCELED)"
                            :disabled="task.status === entityOptions.task.statusTypes.CANCELED"
                            label="Отложена"
                        >
                            <i class="fa-solid fa-pause"></i>
                        </HoverActionsButton>
                    </div>
                </div>
            </div>
            <template v-if="editable">
                <HoverActionsButton @click="$emit('edit')" label="Редактировать">
                    <i class="fa-solid fa-pen" />
                </HoverActionsButton>
                <HoverActionsButton @click="$emit('delete')" :disabled="isDeleted" label="Удалить">
                    <i class="fa-solid fa-trash" />
                </HoverActionsButton>
            </template>
            <Avatar
                v-if="task.created_by_type === 'user'"
                v-tippy="`Создана пользователем ${task.created_by.userProfile.medium_name}`"
                :src="task.created_by.userProfile.avatar"
                :size="35"
            />
        </div>
    </div>
</template>

<script>
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import HoverActionsButton from '@/components/common/HoverActions/HoverActionsButton.vue';
import { entityOptions } from '@/const/options/options.js';
import dayjs from 'dayjs';
import Tooltip from '@/components/common/Tooltip.vue';
import Avatar from '@/components/common/Avatar.vue';

export default {
    name: 'DashboardTableTasksItem',
    components: { Avatar, Tooltip, HoverActionsButton, DashboardChip },
    emits: ['delete', 'edit', 'toggle-status'],
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
    data() {
        return {
            moveSettingsIsVisible: false
        };
    },
    computed: {
        entityOptions() {
            return entityOptions;
        },
        isCompleted() {
            return this.task.status === entityOptions.task.statusTypes.COMPLETED;
        },
        isExpired() {
            return dayjs(this.task.end).diff(dayjs(), 'day') <= 3 && !this.isCompleted;
        },
        isAlreadyExpired() {
            return dayjs(this.task.end).isBefore(dayjs()) && !this.isCompleted;
        },
        isDeleted() {
            return this.task.deleted_at !== null;
        },
        expiredDate() {
            const dayjsDate = dayjs(this.task.end);

            if (dayjsDate.isSame(dayjs(), 'year')) return dayjs(this.task.end).format('D MMMM');
            return dayjs(this.task.end).format('D MMMM YYYY');
        },
        expiredFullDate() {
            return dayjs(this.task.end).format('D MMMM YYYY, HH:mm');
        },
        deletedDate() {
            return dayjs(this.task.deleted_at).format('D MMMM YYYY, HH:mm');
        },
        createdDate() {
            return dayjs(this.task.created_at).format('D MMMM YYYY, HH:mm');
        },
        updatedDate() {
            return dayjs(this.task.updated_at).format('D MMMM YYYY, HH:mm');
        },
        status() {
            return entityOptions.task.status[this.task.status];
        },
        statusColor() {
            return {
                1: 'dashboard-bg-primary-l',
                2: 'dashboard-bg-warning-l',
                3: 'dashboard-bg-success-l',
                4: 'dashboard-bg-danger-l'
            }[this.task.status];
        }
    },
    watch: {
        moveSettingsIsVisible(newValue) {
            if (newValue) document.addEventListener('click', this.moveClickHandler);
            else document.removeEventListener('click', this.moveClickHandler);
        }
    },
    methods: {
        moveClickHandler() {
            this.moveSettingsIsVisible = false;
        }
    }
};
</script>
