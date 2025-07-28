<template>
    <div class="d-flex ml-auto gap-2">
        <SurveyFormStepperRelationsButton
            v-if="company.comments_count"
            @click="pinnedMessagesModalIsVisible = true"
            icon="fa-regular fa-message"
        >
            <span>Комментарии</span>
            <span class="ml-1">({{ company.comments_count }})</span>
        </SurveyFormStepperRelationsButton>
        <SurveyFormStepperRelationsButton
            v-if="survey && baseTasks.length"
            @click="tasksModalIsVisible = true"
            icon="fa-solid fa-bolt"
        >
            <span>Задачи</span>
            <span class="ml-1">(</span>
            <template v-if="completedTasksLength">
                <span class="text-success">{{ completedTasksLength }}</span>
                <span>/</span>
            </template>
            <span>{{ baseTasks.length }}</span>
            <span>)</span>
        </SurveyFormStepperRelationsButton>
        <SurveyFormStepperRelationsButton
            v-if="survey && survey.tasks?.length && scheduledCallTasks.length"
            @click="showCalls"
            icon="fa-solid fa-phone-volume"
            color="danger"
            class="danger"
            label="Нажмите, чтобы посмотреть подробнее"
        >
            <span>Звонок {{ lastScheduledCallDate }}!</span>
            <span v-if="scheduledCallTasks.length > 1" class="ml-1">
                (+{{ scheduledCallTasks.length - 1 }})
            </span>
        </SurveyFormStepperRelationsButton>
        <SurveyFormStepperRelationsButton
            v-if="survey && survey.tasks?.length && scheduledVisitTasks.length"
            @click="showVisits"
            icon="fa-solid fa-phone-volume"
            color="danger"
            class="danger"
            label="Нажмите, чтобы посмотреть подробнее"
        >
            <span>Встреча {{ lastScheduledVisitDate }}!</span>
            <span v-if="scheduledVisitTasks.length > 1" class="ml-1">
                (+{{ scheduledVisitTasks.length - 1 }})
            </span>
        </SurveyFormStepperRelationsButton>
    </div>
    <UiModal v-model:visible="tasksModalIsVisible" title="Задачи по опросу" :width="800">
        <div class="d-flex flex-column gap-2">
            <DashboardTableTasksItem
                v-for="task in baseTasks"
                :key="task.id"
                @view="showTaskPreview(task)"
                :task="task"
            />
        </div>
    </UiModal>
    <UiModal v-model:visible="callsModalIsVisible" title="Запланированные звонки" :width="800">
        <div class="d-flex flex-column gap-2">
            <DashboardTableTasksItem
                v-for="task in scheduledCallTasks"
                :key="task.id"
                @view="showTaskPreview(task)"
                :task="task"
            />
        </div>
    </UiModal>
    <UiModal v-model:visible="visitsModalIsVisible" title="Запланированные встречи" :width="800">
        <div class="d-flex flex-column gap-2">
            <DashboardTableTasksItem
                v-for="task in scheduledVisitTasks"
                :key="task.id"
                @view="showTaskPreview(task)"
                :task="task"
            />
        </div>
    </UiModal>
    <teleport to="body">
        <CompanyTablePreviewComments
            v-if="pinnedMessagesModalIsVisible"
            @close="pinnedMessagesModalIsVisible = false"
            :company
        />
        <TaskPreview
            v-model:visible="taskPreviewIsVisible"
            @closed="currentTask = null"
            @updated="onUpdatedTask"
            :task-id="currentTask?.id"
        />
    </teleport>
</template>
<script setup>
import { computed, ref, toRef } from 'vue';
import UiModal from '@/components/common/UI/UiModal.vue';
import DashboardTableTasksItem from '@/components/Dashboard/Table/TasksItem/DashboardTableTasksItem.vue';
import TaskPreview from '@/components/TaskPreview/TaskPreview.vue';
import SurveyFormStepperRelationsButton from '@/components/SurveyForm/SurveyFormStepperRelationsButton.vue';
import { taskOptions } from '@/const/options/task.options.js';
import { useTypedTasks } from '@/composables/task/useTypedTasks.ts';
import CompanyTablePreviewComments from '@/components/Company/Table/CompanyTablePreviewComments.vue';

const props = defineProps({
    survey: Object,
    company: {
        type: Object,
        required: true
    }
});

const {
    scheduledCallTasks,
    scheduledVisitTasks,
    lastScheduledCallDate,
    lastScheduledVisitDate,
    baseTasks
} = useTypedTasks(toRef(() => props.survey?.tasks ?? []));

// calls

const callsModalIsVisible = ref(false);

function showCalls() {
    if (scheduledCallTasks.value.length > 1) {
        callsModalIsVisible.value = true;
    } else {
        showTaskPreview(scheduledCallTasks.value[0]);
    }
}

// visits

const visitsModalIsVisible = ref(false);

function showVisits() {
    if (scheduledVisitTasks.value.length > 1) {
        visitsModalIsVisible.value = true;
    } else {
        showTaskPreview(scheduledVisitTasks.value[0]);
    }
}

// previews

const pinnedMessagesModalIsVisible = ref(false);
const tasksModalIsVisible = ref(false);

// tasks

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

const completedTasksLength = computed(() =>
    baseTasks.value.reduce(
        (acc, task) => acc + Number(task.status === taskOptions.clearStatusTypes.COMPLETED),
        0
    )
);
</script>
