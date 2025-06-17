<template>
    <div class="pt-3">
        <SurveyFormHeaderCompany
            @update-company="$emit('update-company')"
            @update-logo="$emit('update-logo', $event)"
            @to-chat="$emit('to-chat')"
            @create-task="$emit('create-task')"
            @schedule-call="scheduleCallModalIsVisible = true"
            @show-task="showTaskPreview"
            :company
            :last-surveys
            :surveys-count
            :survey
            editable
        />
        <teleport to="body">
            <CallScheduler
                v-if="scheduleCallModalIsVisible"
                @created="onCreatedScheduledCall"
                @close="closeScheduleCallModal"
                :company
            />
            <TaskPreview
                v-model:visible="taskPreviewIsVisible"
                @closed="currentTask = null"
                @updated="onUpdatedTask"
                :task-id="currentTask?.id"
            />
        </teleport>
    </div>
</template>
<script setup>
import SurveyFormHeaderCompany from '@/components/SurveyForm/SurveyFormHeaderCompany.vue';
import CallScheduler from '@/components/CallScheduler/CallScheduler.vue';
import { ref } from 'vue';
import TaskPreview from '@/components/TaskPreview/TaskPreview.vue';

const emit = defineEmits([
    'update-logo',
    'update-company',
    'to-chat',
    'create-task',
    'call-scheduled'
]);

const props = defineProps({
    company: {
        type: Object,
        required: true
    },
    lastSurveys: {
        type: Array,
        default: () => []
    },
    surveysCount: {
        type: Number,
        default: 0
    },
    survey: Object
});

const scheduleCallModalIsVisible = ref(false);

function closeScheduleCallModal() {
    scheduleCallModalIsVisible.value = false;
}

function onCreatedScheduledCall(task, payload) {
    emit('call-scheduled', payload.start);

    if (props.survey.tasks) {
        // eslint-disable-next-line vue/no-mutating-props
        props.survey.tasks.push(task);
    } else {
        // eslint-disable-next-line vue/no-mutating-props
        props.survey.tasks = [task];
    }

    closeScheduleCallModal();
}

// task preview

const currentTask = ref(null);
const taskPreviewIsVisible = ref(false);

function showTaskPreview(task) {
    currentTask.value = task;
    taskPreviewIsVisible.value = true;
}

function onUpdatedTask(payload) {
    Object.assign(currentTask.value, payload);
    currentTask.value = null;
}
</script>
