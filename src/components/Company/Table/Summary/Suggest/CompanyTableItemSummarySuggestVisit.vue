<template>
    <p class="company-table-item-summary__suggest-row active">
        <i class="fa-solid fa-angles-right mr-1" />
        <span class="d-inline-flex">
            <span>Встретиться с </span>
            <Tippy
                :delay="200"
                content="Нажмите, чтобы просмотреть запланированный визит"
                class="mx-1"
            >
                <span @click="$emit('show-task')" class="company-table-item-summary__suggest-link">
                    клиентом
                </span>
            </Tippy>
            <span> {{ taskDateLabel }}.</span>
            <span v-if="task.message" class="company-table-item-summary__task-comment ml-1">
                Комментарий: {{ task.message }}
            </span>
        </span>
    </p>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { dayjsFromServer } from '@/utils/formatters/date';
import { Tippy } from 'vue-tippy';
import { Task } from '@/types/task';

defineEmits<{ (e: 'show-task') }>();

const props = defineProps<{ task: Task }>();

const isToday = computed(() => {
    return dayjsFromServer(props.task.start).isToday();
});

const taskDateLabel = computed(() => {
    if (isToday.value) return 'сегодня';

    return dayjsFromServer(props.task.start).format('D.MM.YY в HH:mm');
});
</script>
