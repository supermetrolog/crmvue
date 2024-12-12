<template>
    <div class="task-card-comment">
        <Avatar :src="history.created_by.userProfile.avatar" :size="30" />
        <div class="task-card-comment__content">
            <div class="task-card-comment__header">
                <span class="task-card-comment__username">
                    {{ history.created_by.userProfile.medium_name }}
                </span>
                <span class="task-card-comment__dot mx-1">·</span>
                <span class="task-card-comment__type">{{ historyType }}</span>
                <span class="task-card-comment__dot mx-1">·</span>
                <span class="task-card-comment__date">{{ createdAt }}</span>
            </div>
            <div class="task-card-comment__body mt-1">
                <TaskCardHistoryEvent
                    v-for="event in history.events"
                    :key="event.id"
                    :event="event"
                    :history="history.snapshot"
                    :prev="prev?.snapshot"
                />
            </div>
        </div>
    </div>
</template>

<script setup>
import TaskCardHistoryEvent from '@/components/TaskCard/History/TaskCardHistoryEvent.vue';
import Avatar from '@/components/common/Avatar.vue';
import { computed } from 'vue';
import { toBeautifulDateFormat } from '@/utils/formatters/date.js';
import { taskOptions } from '@/const/options/task.options.js';

const props = defineProps({
    history: {
        type: Object,
        required: true
    },
    prev: {
        type: [Object, null],
        default: null
    }
});

const historyType = computed(() => {
    if (props.history.events.length === 1) {
        return (
            taskOptions.historyTextByType[props.history.events[0].event_type] ?? 'Задача обновлена'
        );
    }

    return 'Задача обновлена';
});

const createdAt = computed(() => toBeautifulDateFormat(props.history.snapshot.created_at));
</script>
