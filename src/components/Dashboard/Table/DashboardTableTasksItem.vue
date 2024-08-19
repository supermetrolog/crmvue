<template>
    <div
        @click="$emit('view', $event)"
        class="dashboard-card-task"
        :class="{ expired: isAlreadyExpired, completed: isCompleted }"
    >
        <div class="dashboard-card-task__labels">
            <DashboardTableTasksItemLabel v-if="isNew">Новая</DashboardTableTasksItemLabel>
            <DashboardTableTasksItemLabel v-if="isImportant">
                Срочная
            </DashboardTableTasksItemLabel>
            <DashboardTableTasksItemLabel v-if="isCanceled" class="canceled">
                Отложенная
            </DashboardTableTasksItemLabel>
        </div>
        <div class="dashboard-card-task__body">
            <div class="dashboard-card-task__content">
                <div v-if="isMyTask" v-tippy="'Назначена мной'" class="dashboard-card-task__icon">
                    <i class="fa-solid fa-arrow-right-long"></i>
                </div>
                <div
                    v-else-if="isViewing"
                    v-tippy="'Вы являетесь наблюдателем'"
                    class="dashboard-card-task__icon"
                >
                    <i class="fa-solid fa-eye"></i>
                </div>
                <span>#{{ task.id }}</span>
                <Avatar
                    v-if="task.created_by_type === 'user'"
                    v-tippy="`Создана сотрудником ${task.created_by.userProfile.medium_name}`"
                    :src="task.created_by.userProfile.avatar"
                    :size="45"
                />
                <DashboardTableTasksItemSystem v-else label="Системная задача" :size="45" />
                <p
                    class="dashboard-card-task__text"
                    :class="{ deleted: isDeleted, completed: isCompleted }"
                >
                    {{ task.message }}
                </p>
                <div class="dashboard-card-task__meta">
                    <div v-if="!isForMe" class="dashboard-card-task__viewers">
                        <Avatar
                            v-tippy="`${task.user.userProfile.medium_name} наблюдает`"
                            :src="task.user.userProfile.avatar"
                            :size="30"
                            :class="{ 'dashboard-card-task__not-viewed': false }"
                        />
                        <Avatar
                            v-tippy="`${task.user.userProfile.medium_name} наблюдает`"
                            :src="task.user.userProfile.avatar"
                            :size="30"
                            :class="{ 'dashboard-card-task__not-viewed': true }"
                        />
                    </div>
                    <Avatar
                        v-if="!isForMe"
                        v-tippy="`Назначена для ${task.user.userProfile.medium_name}`"
                        :src="task.user.userProfile.avatar"
                        :size="45"
                        rectangle
                        :class="{ 'dashboard-card-task__not-viewed': true }"
                    />
                </div>
            </div>
            <DashboardTableTasksItemDate :class="{ active: isForMe }" :task="task" />
            <div v-if="!isForMe" class="dashboard-card-task__date-helper"></div>
        </div>
    </div>
</template>

<script setup>
import dayjs from 'dayjs';
import Avatar from '@/components/common/Avatar.vue';
import { computed } from 'vue';
import { taskOptions } from '@/const/options/task.options.js';
import DashboardTableTasksItemSystem from '@/components/Dashboard/Table/DashboardTableTasksItemSystem.vue';
import { useStore } from 'vuex';
import DashboardTableTasksItemDate from '@/components/Dashboard/Table/DashboardTableTasksItemDate.vue';
import DashboardTableTasksItemLabel from '@/components/Dashboard/Table/DashboardTableTasksItemLabel.vue';

defineEmits(['view']);
const props = defineProps({
    task: {
        type: Object,
        required: true
    }
});

const store = useStore();

const isNew = computed(() => props.task.status === taskOptions.statusTypes.NEW);
// TODO: Create important dependency
const isImportant = computed(() => false);
const isMyTask = computed(() => {
    return (
        props.task.created_by_type === 'user' &&
        Number(props.task.created_by_id) === Number(store.getters.THIS_USER.id)
    );
});
const isForMe = computed(() => {
    return Number(props.task.user_id) === Number(store.getters.THIS_USER.id);
});
const isViewing = computed(() => !isMyTask.value && !isForMe.value);
const isCompleted = computed(() => props.task.status === taskOptions.statusTypes.COMPLETED);
const expiredDayjs = computed(() => dayjs(props.task.end));
const isCanceled = computed(() => props.task.status === taskOptions.statusTypes.CANCELED);
const isAlreadyExpired = computed(() => expiredDayjs.value.isBefore(dayjs()) && !isCompleted.value);
const isDeleted = computed(() => props.task.deleted_at !== null);
</script>
