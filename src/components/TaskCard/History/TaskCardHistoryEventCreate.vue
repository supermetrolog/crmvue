<template>
    <div class="task-card-history-event__content">
        <div class="task-card-history-event__column">
            <TaskCardHistoryEventRow label="Исполнитель">
                <div class="task-card-history-event__assigner">
                    <Avatar
                        :src="snapshot.user.userProfile.avatar"
                        :size="20"
                        :label="snapshot.user.userProfile.medium_name"
                    />
                    <span>{{ snapshot.user.userProfile.medium_name }}</span>
                </div>
            </TaskCardHistoryEventRow>
            <TaskCardHistoryEventRow label="Тэги">
                <div v-if="snapshot.tags.length" class="task-card__chips">
                    <DashboardChip
                        v-for="tag in snapshot.tags"
                        :key="tag.id"
                        class="task-card__tag task-card-history-event__tag"
                        :style="{ backgroundColor: '#' + tag.color }"
                    >
                        <span>{{ tag.name ?? tag.label }}</span>
                    </DashboardChip>
                </div>
                <i v-else class="mt-1 fa-solid fa-minus"></i>
            </TaskCardHistoryEventRow>
            <TaskCardHistoryEventRow label="Выполнить до">{{ endDate }}</TaskCardHistoryEventRow>
            <TaskCardHistoryEventRow label="Наблюдатели">
                <div v-if="observers.length" class="task-card-history-event__observers">
                    <Avatar
                        v-for="observer in observers"
                        :key="observer.id"
                        :src="observer.userProfile.avatar"
                        :size="20"
                        :label="observer.userProfile.medium_name"
                    />
                </div>
                <i v-else class="mt-1 fa-solid fa-minus"></i>
            </TaskCardHistoryEventRow>
            <TaskCardHistoryEventRow v-if="snapshot.title" ref="titleEl" label="Заголовок">
                {{ title }}
            </TaskCardHistoryEventRow>
            <TaskCardHistoryEventRow ref="messageEl" label="Описание">
                <span v-if="snapshot.message">{{ message }}</span>
                <i v-else class="mt-1 fa-solid fa-minus"></i>
            </TaskCardHistoryEventRow>
        </div>
    </div>
</template>

<script setup>
import { computed, useTemplateRef } from 'vue';
import Avatar from '@/components/common/Avatar.vue';
import TaskCardHistoryEventRow from '@/components/TaskCard/History/TaskCardHistoryEventRow.vue';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import { toDateFormat } from '@/utils/formatters/date.js';
import { useTippy } from 'vue-tippy';

const props = defineProps({
    snapshot: {
        type: Object,
        required: true
    }
});

const observers = computed(() =>
    props.snapshot.observers.filter(observer => observer.id !== props.snapshot.user_id)
);

const endDate = computed(() => toDateFormat(props.snapshot.end, 'D MMM YY'));

const title = computed(() => {
    return props.snapshot.title.slice(0, 30) + (props.snapshot.title.length > 30 ? '...' : '');
});

const titleEl = useTemplateRef('titleEl');
useTippy(titleEl, {
    content: props.snapshot.title
});

const message = computed(() => {
    return props.snapshot.message.slice(0, 30) + (props.snapshot.message.length > 30 ? '...' : '');
});

const messageEl = useTemplateRef('messageEl');
useTippy(titleEl, {
    content: props.snapshot.message
});
</script>
