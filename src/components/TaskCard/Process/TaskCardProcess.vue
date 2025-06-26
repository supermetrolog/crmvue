<template>
    <div class="task-card-process">
        <p class="task-card-process__title">
            <i class="fa-solid fa-gear mr-1" />
            <span>{{ title }}</span>
        </p>
        <UiButton v-if="isLoading"
small
loading
disabled
color="white">Загрузка </UiButton>
        <ProcessComponent v-else :task :relations />
    </div>
</template>

<script setup lang="ts">
import TaskCardProcessRequests from '@/components/TaskCard/Process/TaskCardProcessRequests.vue';
import TaskCardProcessContact from '@/components/TaskCard/Process/TaskCardProcessContact.vue';
import { Component, computed, onBeforeMount, ref } from 'vue';
import { TaskRelationEntity, TaskType, TaskTypeEnum, TaskView } from '@/types/task';
import api from '@/api/api';
import { captureException } from '@sentry/vue';
import UiButton from '@/components/common/UI/UiButton.vue';

const props = defineProps<{ task: TaskView }>();

type TemplateTaskType = Exclude<TaskType, typeof TaskTypeEnum.BASE>;

const templates: Record<TemplateTaskType, Component> = {
    [TaskTypeEnum.REQUEST_HANDLING]: TaskCardProcessRequests,
    [TaskTypeEnum.CONTACT_HANDLING]: TaskCardProcessContact,
    [TaskTypeEnum.OBJECT_HANDLING]: TaskCardProcessContact,
    [TaskTypeEnum.SCHEDULED_CALL]: TaskCardProcessContact,
    [TaskTypeEnum.SCHEDULED_VISIT]: TaskCardProcessContact
} as const;

const ProcessComponent = computed(() => templates[props.task.type as TemplateTaskType]);

const templateTitles: Record<TemplateTaskType, string> = {
    [TaskTypeEnum.REQUEST_HANDLING]: 'Управление запросами',
    [TaskTypeEnum.CONTACT_HANDLING]: 'Управление контактами',
    [TaskTypeEnum.OBJECT_HANDLING]: 'Управление объектами',
    [TaskTypeEnum.SCHEDULED_CALL]: 'Управление звонками',
    [TaskTypeEnum.SCHEDULED_VISIT]: 'Управление встречами'
} as const;

const title = computed(() => templateTitles[props.task.type as TemplateTaskType]);

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

onBeforeMount(() => {
    if (props.task.relations_count > 0) fetchTaskRelations();
});
</script>
