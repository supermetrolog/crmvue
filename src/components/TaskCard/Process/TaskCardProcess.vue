<template>
    <div class="task-card-process">
        <p class="task-card-process__title">
            <i class="fa-solid fa-gear mr-1" />
            <span>{{ title }}</span>
        </p>
        <ProcessComponent :task :relations />
    </div>
</template>

<script setup lang="ts">
import TaskCardProcessRequests from '@/components/TaskCard/Process/TaskCardProcessRequests.vue';
import TaskCardProcessContact from '@/components/TaskCard/Process/TaskCardProcessContact.vue';
import { computed, onBeforeMount, ref } from 'vue';
import { TaskRelationEntity, TaskTypeEnum, TaskView } from '@/types/task';
import api from '@/api/api';
import { captureException } from '@sentry/vue';

const props = defineProps<{ task: TaskView }>();

const templates = {
    [TaskTypeEnum.REQUEST_HANDLING]: TaskCardProcessRequests,
    [TaskTypeEnum.CONTACT_HANDLING]: TaskCardProcessContact,
    [TaskTypeEnum.OBJECT_HANDLING]: TaskCardProcessContact,
    [TaskTypeEnum.SCHEDULED_CALL]: TaskCardProcessContact,
    [TaskTypeEnum.SCHEDULED_VISIT]: TaskCardProcessContact
};

const ProcessComponent = computed(() => templates[props.task.type]);

const templateTitles = {
    [TaskTypeEnum.REQUEST_HANDLING]: 'Управление запросами',
    [TaskTypeEnum.CONTACT_HANDLING]: 'Управление контактами',
    [TaskTypeEnum.OBJECT_HANDLING]: 'Управление объектами',
    [TaskTypeEnum.SCHEDULED_CALL]: 'Управление звонками',
    [TaskTypeEnum.SCHEDULED_VISIT]: 'Управление встречами'
};

const title = computed(() => templateTitles[props.task.type]);

// relations

const relations = ref<TaskRelationEntity[]>([]);
const isLoading = ref(false);

async function fetchTaskRelations() {
    isLoading.value = true;

    try {
        relations.value = await api.task.getRelations(props.task.id);
    } catch (error) {
        captureException(error, {
            task_id: props.task.id
        });
    } finally {
        isLoading.value = false;
    }
}

onBeforeMount(() => {
    if (props.task.relations_count > 0) fetchTaskRelations();
});
</script>
