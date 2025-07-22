<template>
    <UiButton
        @click="modelValue = name"
        :color
        class="fs-2 company-table-item-summary-survey__tab"
        :class="{ 'op-5': tasks.length === 0 }"
        small
    >
        <span class="mr-1">Задачи</span>
        <span>(</span>
        <span class="text-success font-weight-bold">{{ completedTasksLength }}</span>
        <span>/</span>
        <span class="text-danger font-weight-bold">{{ notCompletedTasksLength }}</span>
        <span>)</span>
    </UiButton>
</template>

<script setup>
import UiButton from '@/components/common/UI/UiButton.vue';
import { computed } from 'vue';
import { isCompletedTask } from '@/utils/helpers/models/task.js';

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

const completedTasksLength = computed(() => {
    return props.tasks.filter(isCompletedTask).length;
});

const notCompletedTasksLength = computed(() => {
    return props.tasks.length - completedTasksLength.value;
});
</script>
