<template>
    <div class="d-flex flex-column gap-2">
        <CompanyTableItemActivityCall
            v-if="scheduledCalls.length"
            @click="$emit('show-task', scheduledCalls[0])"
            :tasks="scheduledCalls"
        />
        <CompanyTableItemActivityVisit
            v-if="scheduledVisits.length"
            @click="$emit('show-task', scheduledVisits[0])"
            :tasks="scheduledVisits"
        />
        <CompanyTableItemActivitySurvey
            @to-chat="$emit('to-chat')"
            @to-survey="$emit('to-survey')"
            :company
        />
        <CompanyTableItemActivityEvent
            v-if="scheduledEvents.length"
            @click="$emit('show-tasks')"
            :tasks="scheduledEvents"
        />
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { TaskTypeEnum } from '@/types/task';
import CompanyTableItemActivityCall from '@/components/Company/Table/CompanyTableItemActivityCall.vue';
import CompanyTableItemActivityVisit from '@/components/Company/Table/CompanyTableItemActivityVisit.vue';
import CompanyTableItemActivityEvent from '@/components/Company/Table/CompanyTableItemActivityEvent.vue';
import CompanyTableItemActivitySurvey from '@/components/Company/Table/CompanyTableItemActivitySurvey.vue';
import { dayjsFromMoscow } from '@/utils/formatters/date.js';
import dayjs from 'dayjs';

defineEmits(['to-chat', 'to-survey', 'show-task', 'show-tasks']);

const props = defineProps({
    company: {
        type: Object,
        required: true
    }
});

const scheduledCalls = computed(() =>
    props.company.tasks.filter(task => task.type === TaskTypeEnum.SCHEDULED_CALL)
);

const scheduledVisits = computed(() =>
    props.company.tasks.filter(task => task.type === TaskTypeEnum.SCHEDULED_VISIT)
);

const excludedTaskTypes = new Set([TaskTypeEnum.SCHEDULED_CALL, TaskTypeEnum.SCHEDULED_VISIT]);

const today = dayjs().endOf('day');

const scheduledEvents = computed(() =>
    props.company.tasks.filter(
        task =>
            !excludedTaskTypes.has(task.type) &&
            dayjsFromMoscow(task.start).isBefore(today.endOf('day'))
    )
);

// TODO: Timeline actions
</script>
