<template>
    <div class="task-card__users">
        <Avatar
            v-if="task.created_by"
            :label="`Создана сотрудником ${task.created_by.userProfile.medium_name}`"
            :src="task.created_by.userProfile.avatar"
            :size="50"
        />
        <i class="task-card__arrow fa-solid fa-arrow-right-long"></i>
        <Tippy v-if="task.user">
            <template #default>
                <Avatar
                    :src="task.user.userProfile.avatar"
                    :size="50"
                    rectangle
                    class="dashboard-card-task__user"
                    :class="{
                        'dashboard-card-task__not-viewed': !task.is_viewed && !isCompleted
                    }"
                />
            </template>
            <template #content>
                <p>Назначена для {{ task.user.userProfile.medium_name }}</p>
                <p v-if="task.is_viewed" class="color-light">Просмотрена {{ viewedAt }}</p>
                <p v-else class="color-light">Не просмотрена</p>
            </template>
        </Tippy>
        <Tippy v-if="observers.length" interactive>
            <div class="task-card__observers">
                <span>+ {{ observers.length }}</span>
                <i class="fa-solid fa-eye" />
            </div>
            <template #content>
                <p class="mb-1">Список всех наблюдателей:</p>
                <div class="d-flex gap-1 flex-wrap">
                    <DashboardTableTasksItemObserver
                        v-for="observer in observers"
                        :key="observer.id"
                        :observer="observer"
                        :size="45"
                    />
                </div>
            </template>
        </Tippy>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { taskOptions } from '@/const/options/task.options.js';
import { toBeautifulDateFormat } from '@/utils/formatters/date.ts';
import { Tippy } from 'vue-tippy';
import Avatar from '@/components/common/Avatar.vue';
import DashboardTableTasksItemObserver from '@/components/Dashboard/Table/TasksItem/DashboardTableTasksItemObserver.vue';

const props = defineProps({
    task: {
        type: Object,
        required: true
    }
});

const isCompleted = computed(() => props.task.status === taskOptions.statusTypes.COMPLETED);

const observers = computed(() =>
    props.task.observers.filter(observer => observer.user.id !== props.task.user.id)
);

const viewedAt = computed(() => {
    return toBeautifulDateFormat(props.task.viewed_at);
});
</script>
