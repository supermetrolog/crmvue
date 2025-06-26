<template>
    <div class="pt-3">
        <SurveyFormHeaderCompany
            @update-company="$emit('update-company')"
            @update-logo="$emit('update-logo', $event)"
            @to-chat="$emit('to-chat')"
            @create-task="$emit('create-task')"
            @schedule-call="scheduleCallModalIsVisible = true"
            @schedule-visit="scheduleVisitModalIsVisible = true"
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
                :relations="schedulerRelations"
            />
            <VisitScheduler
                v-if="scheduleVisitModalIsVisible"
                @created="onCreatedScheduledVisit"
                @close="closeScheduleVisitModal"
                :company
                :relations="schedulerRelations"
            />
        </teleport>
    </div>
</template>
<script setup>
import SurveyFormHeaderCompany from '@/components/SurveyForm/SurveyFormHeaderCompany.vue';
import CallScheduler from '@/components/CallScheduler/CallScheduler.vue';
import { computed, ref } from 'vue';
import VisitScheduler from '@/components/VisitScheduler/VisitScheduler.vue';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.ts';

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

const schedulerRelations = computed(() => {
    if (isNotNullish(props.survey)) {
        return [{ entity_type: 'survey', entity_id: props.survey.id }];
    }

    return [];
});

function tryAddTaskToSurvey(task) {
    if (!props.survey) return;

    if (props.survey.tasks) {
        // eslint-disable-next-line vue/no-mutating-props
        props.survey.tasks.push(task);
    } else {
        // eslint-disable-next-line vue/no-mutating-props
        props.survey.tasks = [task];
    }
}

// call

const scheduleCallModalIsVisible = ref(false);

function closeScheduleCallModal() {
    scheduleCallModalIsVisible.value = false;
}

function onCreatedScheduledCall(task, payload) {
    emit('call-scheduled', payload.start);

    tryAddTaskToSurvey(task);

    closeScheduleCallModal();
}

// visit

const scheduleVisitModalIsVisible = ref(false);

function closeScheduleVisitModal() {
    scheduleVisitModalIsVisible.value = false;
}

function onCreatedScheduledVisit(task) {
    tryAddTaskToSurvey(task);
    closeScheduleVisitModal();
}
</script>
