<template>
    <div class="task-card-history-event">
        <component :is="eventComponent" :snapshot="history" :prev-snapshot="prev" />
    </div>
</template>

<script setup>
import { computed } from 'vue';
import TaskCardHistoryEventAssign from '@/components/TaskCard/History/TaskCardHistoryEventAssign.vue';
import TaskCardHistoryEventStatus from '@/components/TaskCard/History/TaskCardHistoryEventStatus.vue';
import TaskCardHistoryEventCreate from '@/components/TaskCard/History/TaskCardHistoryEventCreate.vue';
import TaskCardHistoryEventDescription from '@/components/TaskCard/History/TaskCardHistoryEventDescription.vue';
import TaskCardHistoryEventTags from '@/components/TaskCard/History/TaskCardHistoryEventTags.vue';
import TaskCardHistoryEventEnding from '@/components/TaskCard/History/TaskCardHistoryEventEnding.vue';
import TaskCardHistoryEventObservers from '@/components/TaskCard/History/TaskCardHistoryEventObservers.vue';
import TaskCardHistoryEventFileCreated from '@/components/TaskCard/History/TaskCardHistoryEventFileCreated.vue';
import TaskCardHistoryEventFileDeleted from '@/components/TaskCard/History/TaskCardHistoryEventFileDeleted.vue';
import TaskCardHistoryEventFiles from '@/components/TaskCard/History/TaskCardHistoryEventFiles.vue';
import TaskCardHistoryEventTitle from '@/components/TaskCard/History/TaskCardHistoryEventTitle.vue';
import TaskCardHistoryEventPostponed from '@/components/TaskCard/History/TaskCardHistoryEventPostponed.vue';

const props = defineProps({
    history: {
        type: Object,
        required: true
    },
    event: {
        type: Object,
        required: true
    },
    prev: {
        type: [Object, null],
        default: null
    }
});

const componentsByEvents = {
    assigned: TaskCardHistoryEventAssign,
    status_changed: TaskCardHistoryEventStatus,
    created: TaskCardHistoryEventCreate,
    description_changed: TaskCardHistoryEventDescription,
    title_changed: TaskCardHistoryEventTitle,
    ending_date_changed: TaskCardHistoryEventEnding,
    tags_changed: TaskCardHistoryEventTags,
    observers_changed: TaskCardHistoryEventObservers,
    file_created: TaskCardHistoryEventFileCreated,
    file_deleted: TaskCardHistoryEventFileDeleted,
    files_changed: TaskCardHistoryEventFiles,
    postponed: TaskCardHistoryEventPostponed
};

const eventComponent = computed(() => componentsByEvents[props.event.event_type]);
</script>
