<template>
    <div class="company-table-item-summary">
        <div class="company-table-item-summary__content">
            <div class="company-table-item-summary__header mb-1">
                <CompanyTableItemSummaryTabSurvey
                    v-model="currentTab"
                    @to-survey="$emit('open-survey')"
                    :company
                    :name="TABS.SURVEY"
                />
                <CompanyTableItemSummaryTabTasks
                    v-model="currentTab"
                    :tasks="baseTasks"
                    :name="TABS.TASKS"
                />
                <UiButton
                    v-if="scheduledCallTasks.length"
                    @click="showScheduledCallTasks"
                    class="fs-2 company-table-item-summary-survey__tab"
                    color="transparent"
                    small
                    :class="{
                        danger: lastScheduledCallDateExpired,
                        primary: !lastScheduledCallDateExpired
                    }"
                >
                    <span>Звонок {{ nearestScheduledCallDate }}</span>
                    <span v-if="scheduledCallTasks.length > 1" class="ml-1">
                        (+ еще {{ scheduledCallTasks.length - 1 }})
                    </span>
                </UiButton>
                <UiButton
                    v-if="scheduledVisitTasks.length"
                    @click="showScheduledVisitTasks"
                    class="fs-2 company-table-item-summary-survey__tab"
                    color="transparent"
                    small
                    :class="{
                        danger: lastScheduledVisitDateExpired,
                        primary: !lastScheduledVisitDateExpired
                    }"
                >
                    <span>Встреча {{ nearestScheduledVisitDate }}</span>
                    <span v-if="scheduledVisitTasks.length > 1" class="ml-1">
                        (+ еще {{ scheduledVisitTasks.length - 1 }})
                    </span>
                </UiButton>
            </div>
            <CompanyTableItemSummarySurvey
                v-if="currentTab === TABS.SURVEY"
                @edit-comment="$emit('edit-survey-comment')"
                @open-preview="$emit('show-survey')"
                :company
            />
            <CompanyTableItemSummaryTasks
                v-if="currentTab === TABS.TASKS"
                @show-task="$emit('show-task', $event)"
                :tasks="baseTasks"
            />
        </div>
        <CompanyTableItemActions
            @create-task="$emit('create-task')"
            @schedule-call="$emit('schedule-call')"
            @schedule-visit="$emit('schedule-visit')"
            @schedule-event="$emit('schedule-event')"
            @disable="$emit('disable')"
            @enable="$emit('enable')"
            @open-chat="$emit('open-chat')"
            @open-survey="$emit('open-survey')"
            @deleted-from-folder="$emit('deleted-from-folder', $event)"
            :company
            class="mt-2"
        />
        <UiModal
            v-model:visible="scheduledCallTasksIsVisible"
            :title="`Запланированные звонки (${scheduledCallTasks.length})`"
            :width="800"
        >
            <div class="d-flex flex-column gap-2">
                <DashboardTableTasksItem
                    v-for="task in scheduledCallTasks"
                    :key="task.id"
                    @view="$emit('show-task', task)"
                    :task="task"
                />
            </div>
        </UiModal>
        <UiModal
            v-model:visible="scheduledVisitTasksIsVisible"
            :title="`Запланированные встречи (${scheduledVisitTasks.length})`"
            :width="800"
        >
            <div class="d-flex flex-column gap-2">
                <DashboardTableTasksItem
                    v-for="task in scheduledVisitTasks"
                    :key="task.id"
                    @view="$emit('show-task', task)"
                    :task="task"
                />
            </div>
        </UiModal>
    </div>
</template>

<script setup>
import CompanyTableItemActions from '@/components/Company/Table/CompanyTableItemActions.vue';
import CompanyTableItemSummaryTabSurvey from '@/components/Company/Table/CompanyTableItemSummaryTabSurvey.vue';
import { computed, ref, toRef } from 'vue';
import { useTypedTasks } from '@/composables/task/useTypedTasks';
import CompanyTableItemSummaryTabTasks from '@/components/Company/Table/CompanyTableItemSummaryTabTasks.vue';
import CompanyTableItemSummaryTasks from '@/components/Company/Table/CompanyTableItemSummaryTasks.vue';
import CompanyTableItemSummarySurvey from '@/components/Company/Table/CompanyTableItemSummarySurvey.vue';
import UiButton from '@/components/common/UI/UiButton.vue';
import DashboardTableTasksItem from '@/components/Dashboard/Table/TasksItem/DashboardTableTasksItem.vue';
import UiModal from '@/components/common/UI/UiModal.vue';
import { dayjsFromMoscow } from '@/utils/formatters/date.js';
import { now } from '@vueuse/core';

const emit = defineEmits([
    'deleted-from-folder',
    'show-message',
    'unpin-message',
    'create-task',
    'show-created-tasks',
    'disable',
    'enable',
    'show-survey',
    'show-task',
    'edit-survey-comment',
    'schedule-call',
    'schedule-visit',
    'schedule-event',
    'open-chat',
    'open-survey'
]);

const props = defineProps({
    company: {
        type: Object,
        required: true
    }
});

const TABS = {
    SURVEY: 'survey',
    TASKS: 'tasks'
};

const currentTab = ref(TABS.SURVEY);

const {
    scheduledCallTasks,
    scheduledVisitTasks,
    nearestScheduledCall,
    nearestScheduledCallDate,
    nearestScheduledVisit,
    nearestScheduledVisitDate,
    baseTasks
} = useTypedTasks(toRef(() => props.company.tasks ?? []));

const lastScheduledCallDateExpired = computed(
    () =>
        nearestScheduledCall.value &&
        dayjsFromMoscow(nearestScheduledCall.value.start).isBefore(now(), 'day')
);

const lastScheduledVisitDateExpired = computed(
    () =>
        nearestScheduledVisit.value &&
        dayjsFromMoscow(nearestScheduledVisit.value.start).isBefore(now(), 'day')
);

const scheduledCallTasksIsVisible = ref(false);

function showScheduledCallTasks() {
    if (scheduledCallTasks.value.length > 1) {
        scheduledCallTasksIsVisible.value = true;
    } else {
        emit('show-task', scheduledCallTasks.value[0]);
    }
}

const scheduledVisitTasksIsVisible = ref(false);

function showScheduledVisitTasks() {
    if (scheduledVisitTasks.value.length > 1) {
        scheduledVisitTasksIsVisible.value = true;
    } else {
        emit('show-task', scheduledVisitTasks.value[0]);
    }
}
</script>
