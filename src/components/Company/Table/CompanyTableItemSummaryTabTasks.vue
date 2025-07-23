<template>
    <Tippy>
        <template #default>
            <UiButton
                @click="modelValue = name"
                :color
                :class="{ 'op-5': tasks.length === 0 || currentUserTasksLength === 0 }"
                small
                class="fs-2 company-table-item-summary-survey__tab"
                :disabled="tasks.length === 0"
            >
                <span class="mr-1">Задачи</span>
                <span>(</span>
                <span class="text-success font-weight-bold">{{ notStartedTasksLength }}</span>
                <span>/</span>
                <span class="text-danger font-weight-bold">{{ startedTasksLength }}</span>
                <span>)</span>
            </UiButton>
        </template>
        <template #content>
            <p class="text-success_dark">{{ notStartedTasksLabel }}</p>
            <p class="dashboard-cl-danger">{{ startedTasksLabel }}</p>
            <hr />
            <p class="text-success_dark">{{ currentUserTasksLabel }}</p>
        </template>
    </Tippy>
</template>

<script setup>
import UiButton from '@/components/common/UI/UiButton.vue';
import { computed } from 'vue';
import { Tippy } from 'vue-tippy';
import dayjs from 'dayjs';
import { dayjsFromMoscow } from '@/utils/formatters/date.js';
import { useAuth } from '@/composables/useAuth.js';
import { plural, pluralTemplate } from '@/utils/plural.js';

const modelValue = defineModel();

const props = defineProps({
    tasks: {
        type: Array,
        required: true
    },
    name: {
        type: String,
        required: true
    }
});

const color = computed(() => {
    if (modelValue.value === props.name) return 'gray-light';
    return 'transparent';
});

const today = dayjs().add(3, 'h');

const startedTasksLength = computed(
    () => props.tasks.filter(task => dayjsFromMoscow(task.start).isBefore(today, 'day')).length
);

const notStartedTasksLength = computed(() => {
    return props.tasks.length - startedTasksLength.value;
});

const { currentUserId } = useAuth();

const currentUserTasksLength = computed(() => {
    return props.tasks.filter(task => task.user.id === currentUserId.value).length;
});

const currentUserTasksLabel = computed(() => {
    return pluralTemplate(
        '%s для вас',
        currentUserTasksLength.value,
        '%d задача',
        '%d задачи',
        '%d задач'
    );
});

const startedTasksLabel = computed(() => {
    return `${plural(
        startedTasksLength.value,
        '%d истекающая задач',
        '%d истекающие задачи',
        '%d истекающих задач'
    )}`;
});

const notStartedTasksLabel = computed(() => {
    return `${plural(
        notStartedTasksLength.value,
        '%d запланированная задача',
        '%d запланированные задачи',
        '%d запланированных задач'
    )}`;
});
</script>
