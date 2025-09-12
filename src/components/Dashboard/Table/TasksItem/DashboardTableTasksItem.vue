<template>
    <div
        class="dashboard-card-task"
        :class="{
            expired: isAlreadyExpired && !isCanceled,
            completed: isCompleted,
            self: isForMe,
            myself: isMyTask,
            viewing: isViewing,
            viewed: isViewedByCurrentUser,
            canceled: isCanceled,
            started: isStarted
        }"
    >
        <div
            v-if="showTags"
            class="dashboard-card-task__labels"
            :class="{ moved: isMyTask || isViewing }"
        >
            <DashboardTableTasksItemLabel
                v-if="isFavorite"
                v-tippy="'В избранном'"
                class="dashboard-bg-warning"
            >
                <i class="fa-solid fa-star" />
            </DashboardTableTasksItemLabel>
            <DashboardTableTasksItemLabel v-if="isObservingByCurrentUser && !isViewedByCurrentUser">
                Не просмотрена
            </DashboardTableTasksItemLabel>
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
        <template v-if="showDiligence">
            <div
                v-if="isMyTask && isForMe"
                v-tippy="'Назначена самому себе'"
                class="dashboard-card-task__icon dashboard-card-task__way"
            >
                <i class="fa-solid fa-user-tag"></i>
            </div>
            <div
                v-else-if="isMyTask"
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
                <i
                    class="fa-solid fa-eye"
                    :class="{ 'dashboard-cl-success': isViewedByCurrentUser }"
                ></i>
            </div>
        </template>
        <div @click="$emit('view', $event)" class="dashboard-card-task__body">
            <div class="dashboard-card-task__content">
                <UserFoldersDropdown
                    :entity="task.id"
                    :button-color="isAlreadyExpired && !isCanceled ? 'light' : 'grey-l'"
                    morph="task"
                />
                <span class="dashboard-card-task__id">#{{ task.id }}</span>
                <Avatar
                    v-if="task.created_by_type === 'user'"
                    :label="`Создана сотрудником ${task.created_by.userProfile.medium_name}`"
                    :src="task.created_by.userProfile.avatar"
                    :size="avatarSize"
                />
                <DashboardTableTasksItemSystem v-else label="Системная задача" :size="45" />
                <p
                    class="dashboard-card-task__text"
                    :class="{ deleted: isDeleted, completed: isCompleted }"
                >
                    {{ task.title }}
                </p>
                <div class="dashboard-card-task__meta">
                    <div
                        v-if="!isForMe && task.observers?.length"
                        class="dashboard-card-task__viewers"
                    >
                        <DashboardTableTasksItemObserver
                            v-for="observer in observers"
                            :key="observer.user_id"
                            :observer="observer"
                            :size="observerSize"
                        />
                    </div>
                    <Tippy v-if="!isForMe && task.user">
                        <template #default>
                            <Avatar
                                :src="task.user.userProfile.avatar"
                                :size="avatarSize"
                                rectangle
                                class="dashboard-card-task__user"
                                :class="{
                                    'dashboard-card-task__not-viewed':
                                        !task.is_viewed && !isCompleted
                                }"
                            />
                        </template>
                        <template #content>
                            <p>Назначена для {{ task.user.userProfile.medium_name }}</p>
                            <p v-if="task.is_viewed" class="color-light">
                                Просмотрена {{ viewedAt }}
                            </p>
                            <p v-else class="color-light">Не просмотрена</p>
                        </template>
                    </Tippy>
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
import DashboardTableTasksItemDate from '@/components/Dashboard/Table/TasksItem/DashboardTableTasksItemDate.vue';
import DashboardTableTasksItemLabel from '@/components/Dashboard/Table/TasksItem/DashboardTableTasksItemLabel.vue';
import {
    dayjsFromServer,
    nowInServer,
    toBeautifulDateFormat,
    toDateFormat
} from '@/utils/formatters/date.ts';
import { Tippy } from 'vue-tippy';
import { useAuth } from '@/composables/useAuth';
import DashboardTableTasksItemObserver from '@/components/Dashboard/Table/TasksItem/DashboardTableTasksItemObserver.vue';
import { isString } from '@/utils/helpers/string/isString.js';
import { useFavoriteTasks } from '@/composables/useFavoriteTasks.js';
import UserFoldersDropdown from '@/components/UserFolder/UserFoldersDropdown.vue';

defineEmits(['view']);
const props = defineProps({
    task: {
        type: Object,
        required: true
    },
    avatarSize: {
        type: Number,
        default: 55
    },
    observerSize: {
        type: Number,
        default: 55
    },
    showDiligence: {
        type: Boolean,
        default: true
    },
    showTags: {
        type: Boolean,
        default: true
    }
});

const { currentUser } = useAuth();

const isMyTask = computed(() => {
    return (
        props.task.created_by_type === 'user' &&
        Number(props.task.created_by_id) === Number(currentUser.value.id)
    );
});
const isForMe = computed(() => {
    return Number(props.task.user_id) === Number(currentUser.value.id);
});

const isObservingByCurrentUser = computed(() =>
    props.task.observers.some(observer => observer.user_id === currentUser.value.id)
);

const isViewedByCurrentUser = computed(() =>
    props.task.observers.some(
        observer => observer.user_id === currentUser.value.id && observer.viewed_at !== null
    )
);

const isViewing = computed(
    () => !isMyTask.value && !isForMe.value && isObservingByCurrentUser.value
);
const isCompleted = computed(() => props.task.status === taskOptions.statusTypes.COMPLETED);

const expiredDayjs = computed(() => {
    if (isString(props.task.end)) return dayjsFromServer(props.task.end);
    return dayjs(props.task.end);
});

const startDayjs = computed(() => {
    if (isString(props.task.start)) return dayjsFromServer(props.task.start);
    return dayjs(props.task.start);
});

const isCanceled = computed(() => props.task.status === taskOptions.statusTypes.CANCELED);
const isAlreadyExpired = computed(
    () => expiredDayjs.value.isBefore(nowInServer()) && !isCompleted.value
);
const isDeleted = computed(() => props.task.deleted_at != null);

const isStarted = computed(() => startDayjs.value.isBefore(nowInServer()));

const impossibleDate = computed(() => {
    if (props.task.impossible_to) return toDateFormat(props.task.impossible_to, 'D.MM.YY');
    return 'неизвестной даты';
});

const observers = computed(() => {
    return props.task.observers.filter(element => element.user_id !== props.task.user_id);
});

const viewedAt = computed(() => {
    return toBeautifulDateFormat(props.task.viewed_at);
});

// favorites

const { isFavoriteTask } = useFavoriteTasks();

const isFavorite = computed(() => isFavoriteTask(props.task.id));
</script>
