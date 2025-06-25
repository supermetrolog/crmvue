<template>
    <div class="d-flex ml-auto gap-2">
        <SurveyFormStepperRelationsButton
            v-if="company.pinned_messages?.length"
            @click="pinnedMessagesModalIsVisible = true"
            icon="fa-regular fa-message"
        >
            <span>Комментарии</span>
            <span class="ml-1">({{ company.pinned_messages?.length }})</span>
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
    <UiModal
        v-model:visible="pinnedMessagesModalIsVisible"
        title="Закрепленные комментарии"
        :width="600"
    >
        <div class="d-flex flex-column gap-2">
            <MessengerDialogLastMessage
                v-for="message in company.pinned_messages"
                :key="message.id"
                :last-message="message.message"
                class="company-table-item__message w-100"
                only-avatar
                column
            >
                <template #after>
                    <UiDropdownActions small label="Действия над сообщением" class="ml-auto">
                        <template #menu>
                            <UiDropdownActionsButton
                                @handle="unpinMessage(message)"
                                label="Открепить сообщение"
                                icon="fa-solid fa-trash"
                            />
                        </template>
                    </UiDropdownActions>
                </template>
            </MessengerDialogLastMessage>
        </div>
    </UiModal>
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
import MessengerDialogLastMessage from '@/components/Messenger/Dialog/MessengerDialogLastMessage.vue';
import UiDropdownActionsButton from '@/components/common/UI/DropdownActions/UiDropdownActionsButton.vue';
import UiDropdownActions from '@/components/common/UI/DropdownActions/UiDropdownActions.vue';
import { useConfirm } from '@/composables/useConfirm.js';
import { useNotify } from '@/utils/use/useNotify.js';
import api from '@/api/api.js';
import { spliceById } from '@/utils/helpers/array/spliceById.js';
import { captureException } from '@sentry/vue';
import TaskPreview from '@/components/TaskPreview/TaskPreview.vue';
import SurveyFormStepperRelationsButton from '@/components/SurveyForm/SurveyFormStepperRelationsButton.vue';
import { taskOptions } from '@/const/options/task.options.js';
import { useTypedTasks } from '@/composables/task/useTypedTasks.ts';

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

// pinned messages

const { confirm } = useConfirm();
const notify = useNotify();

async function unpinMessage(message) {
    const confirmed = await confirm(
        'Открепить сообщение',
        'Вы уверены, что хотите открепить сообщение?'
    );
    if (!confirmed) return;

    try {
        await api.companies.unpinMessage(message.id);
        spliceById(props.company.pinned_messages, message.id);
    } catch (error) {
        notify.error('Произошла ошибка. Попробуйте позже');
        captureException(error, { company_id: message.entity_id });
    }
}

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
