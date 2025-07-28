<template>
    <p class="company-table-item-summary__suggest-row active">
        <i class="fa-solid fa-angles-right mr-1"></i>
        <span class="d-inline-flex">
            <span>Выполнить задачу</span>
            <Tippy :delay="200" content="Нажмите, чтобы открыть задачу" class="mx-1">
                <span @click="$emit('show-task')" class="company-table-item-summary__suggest-link">
                    #{{ task.id }}
                </span>
            </Tippy>
            <span>{{ taskDateLabel }}.</span>
        </span>
    </p>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { dayjsFromServer, nowInServer } from '@/utils/formatters/date';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish';
import { Tippy } from 'vue-tippy';
import { Task } from '@/types/task';

defineEmits<{ (e: 'show-task') }>();

const props = defineProps<{ task: Task }>();

const taskIsStarted = computed(() => {
    return (
        isNotNullish(props.task.start) &&
        dayjsFromServer(props.task.start).isSameOrBefore(nowInServer())
    );
});

const taskDateLabel = computed(() => {
    if (taskIsStarted.value) {
        return `до ${dayjsFromServer(props.task.end).format('D.MM.YY HH:mm')}`;
    }

    return `с ${dayjsFromServer(props.task.end).format('D.MM.YY HH:mm')}`;
});
</script>
