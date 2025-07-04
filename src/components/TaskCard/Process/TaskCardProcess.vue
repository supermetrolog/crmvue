<template>
    <div data-tour-id="task-process:wrapper" class="task-card-process">
        <p class="task-card-process__title">
            <i class="fa-solid fa-gear mr-1" />
            <span>{{ title }}</span>
            <UiButtonIcon
                @click="run()"
                mini
                class="ml-auto"
                color="light"
                label="Что за управление?"
                icon="fa-solid fa-question"
            />
        </p>
        <UiButton v-if="isLoading" small loading color="white">Загрузка</UiButton>
        <ProcessComponent v-else @show-survey="showSurvey" :task :relations />
    </div>
</template>

<script setup lang="ts">
import TaskCardProcessRequests from '@/components/TaskCard/Process/TaskCardProcessRequests.vue';
import TaskCardProcessContacts from '@/components/TaskCard/Process/TaskCardProcessContacts.vue';
import { Component, computed, onBeforeMount, ref } from 'vue';
import { TaskRelationEntity, TaskType, TaskTypeEnum, TaskView } from '@/types/task';
import api from '@/api/api';
import { captureException } from '@sentry/vue';
import UiButton from '@/components/common/UI/UiButton.vue';
import { useAsyncPopup } from '@/composables/useAsyncPopup';
import { useAuth } from '@/composables/useAuth';
import UiButtonIcon from '@/components/common/UI/UiButtonIcon.vue';
import { useTour } from '@/composables/useTour/useTour';
import TaskCardProcessDefault from '@/components/TaskCard/Process/TaskCardProcessDefault.vue';

const props = defineProps<{ task: TaskView }>();

type TemplateTaskType = Exclude<TaskType, typeof TaskTypeEnum.BASE>;

const templates: Record<TemplateTaskType, Component> = {
    [TaskTypeEnum.REQUEST_HANDLING]: TaskCardProcessRequests,
    [TaskTypeEnum.CONTACT_HANDLING]: TaskCardProcessContacts,
    [TaskTypeEnum.OBJECT_HANDLING]: TaskCardProcessDefault,
    [TaskTypeEnum.SCHEDULED_CALL]: TaskCardProcessContacts,
    [TaskTypeEnum.SCHEDULED_VISIT]: TaskCardProcessContacts,
    [TaskTypeEnum.SCHEDULED_EVENT]: TaskCardProcessContacts
} as const;

const ProcessComponent = computed(
    () => templates[props.task.type as TemplateTaskType] ?? TaskCardProcessDefault
);

const templateTitles: Record<TemplateTaskType, string> = {
    [TaskTypeEnum.REQUEST_HANDLING]: 'Управление запросами',
    [TaskTypeEnum.CONTACT_HANDLING]: 'Управление контактами',
    [TaskTypeEnum.OBJECT_HANDLING]: 'Управление объектами',
    [TaskTypeEnum.SCHEDULED_CALL]: 'Управление звонками',
    [TaskTypeEnum.SCHEDULED_VISIT]: 'Управление встречами',
    [TaskTypeEnum.SCHEDULED_EVENT]: 'Управление событиями'
} as const;

const title = computed(
    () => templateTitles[props.task.type as TemplateTaskType] ?? 'Управление связями'
);

// relations

const relations = ref<TaskRelationEntity[]>([]);
const isLoading = ref(false);

async function fetchTaskRelations() {
    isLoading.value = true;

    try {
        relations.value = await api.task.getRelations(props.task.id);
    } catch (error) {
        captureException(error, {
            data: {
                task_id: props.task.id
            }
        });
    } finally {
        isLoading.value = false;
    }
}

const { currentUserIsModeratorOrHigher } = useAuth();

onBeforeMount(async () => {
    if (props.task.relations_count > 0) await fetchTaskRelations();

    if (currentUserIsModeratorOrHigher.value && relations.value.length > 0) {
        void softRun();
    }
});

const { show } = useAsyncPopup('surveyPreview');

function showSurvey(surveyId: number) {
    show({ surveyId });
}

// tour

const { softRun, run } = useTour('task-process', {
    autorun: false,
    steps: [
        {
            key: 0,
            element: '[data-tour-id="task-process:wrapper"]',
            popover: {
                title: 'Управление связями',
                description:
                    'Теперь вы можете управлять сущностями прямо в карточке задачи. Например, отредактировать что-то, отправить в архив или создать.',
                side: 'right',
                align: 'start'
            }
        }
    ]
});
</script>
