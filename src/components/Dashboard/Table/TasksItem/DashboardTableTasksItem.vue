<template>
    <div
        @click="$emit('view', $event)"
        class="dashboard-card-task"
        :class="{ expired: isAlreadyExpired, completed: isCompleted, self: isForMe }"
    >
        <div class="dashboard-card-task__labels" :class="{ moved: isMyTask || isViewing }">
            <DashboardTableTasksItemLabel v-if="isNew">Новая</DashboardTableTasksItemLabel>
            <DashboardTableTasksItemLabel v-if="isCanceled" class="canceled">
                Отложено до {{ impossibleDate }}
            </DashboardTableTasksItemLabel>
            <DashboardTableTasksItemLabel
                v-for="tag in task.tags"
                :key="tag.id"
                :style="{ 'background-color': '#' + tag.color }"
            >
                {{ tag.name }}
            </DashboardTableTasksItemLabel>
        </div>
        <div class="dashboard-card-task__body">
            <div class="dashboard-card-task__content">
                <div
                    v-if="isMyTask"
                    v-tippy="'Назначена мной'"
                    class="dashboard-card-task__icon dashboard-card-task__way"
                >
                    <i class="fa-solid fa-arrow-right-long"></i>
                </div>
                <div
                    v-else-if="isViewing"
                    v-tippy="'Вы являетесь наблюдателем'"
                    class="dashboard-card-task__icon dashboard-card-task__way"
                >
                    <i class="fa-solid fa-eye"></i>
                </div>
                <span class="dashboard-card-task__id">#{{ task.id }}</span>
                <Avatar
                    v-if="task.created_by_type === 'user'"
                    v-tippy="`Создана сотрудником ${task.created_by.userProfile.medium_name}`"
                    :src="task.created_by.userProfile.avatar"
                    :size="55"
                />
                <DashboardTableTasksItemSystem v-else label="Системная задача" :size="45" />
                <p
                    class="dashboard-card-task__text"
                    :class="{ deleted: isDeleted, completed: isCompleted }"
                >
                    {{ task.message }}
                </p>
                <div class="dashboard-card-task__meta">
                    <div
                        v-if="!isForMe && task.observers?.length"
                        class="dashboard-card-task__viewers"
                    >
                        <Avatar
                            v-for="observer in observers"
                            :key="observer.user.id"
                            v-tippy="`${observer.user.userProfile.medium_name} наблюдает`"
                            :src="observer.user.userProfile.avatar"
                            :size="40"
                            class="dashboard-card-task__user"
                            :class="{ 'dashboard-card-task__not-viewed': !observer.viewed_at }"
                        />
                    </div>
                    <Avatar
                        v-if="!isForMe"
                        v-tippy="`Назначена для ${task.user.userProfile.medium_name}`"
                        :src="task.user.userProfile.avatar"
                        :size="55"
                        rectangle
                        class="dashboard-card-task__user"
                        :class="{ 'dashboard-card-task__not-viewed': !task.is_viewed }"
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
import DashboardTableTasksItemSystem from '@/components/Dashboard/Table/TasksItem/DashboardTableTasksItemSystem.vue';
import { useStore } from 'vuex';
import DashboardTableTasksItemDate from '@/components/Dashboard/Table/TasksItem/DashboardTableTasksItemDate.vue';
import DashboardTableTasksItemLabel from '@/components/Dashboard/Table/TasksItem/DashboardTableTasksItemLabel.vue';
import { toDateFormat } from '@/utils/formatter.js';

defineEmits(['view']);
const props = defineProps({
    task: {
        type: Object,
        required: true
    }
});

const store = useStore();

const isNew = computed(() => props.task.status === taskOptions.statusTypes.NEW);
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
const impossibleDate = computed(() => {
    if (props.task.impossible_to) return toDateFormat(props.task.impossible_to, 'D.MM.YY');
    return 'неизвестной даты';
});

const observers = computed(() => {
    return props.task.observers.filter(element => element.user_id !== props.task.user_id);
});
</script>
