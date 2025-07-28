<template>
    <p class="company-table-item-summary__suggest-row active">
        <UiClamped button-class="fs-2" :rows="2">
            <i class="fa-solid fa-angles-right mr-1" />
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
            <div
                v-if="task.message"
                ref="comment"
                class="company-table-item-summary__task-comment ml-1"
            >
                Комментарий:
                {{ task.message }}
            </div>
        </UiClamped>
    </p>
</template>

<script setup lang="ts">
import { computed, toRef, useTemplateRef } from 'vue';
import { dayjsFromServer } from '@/utils/formatters/date';
import { Tippy } from 'vue-tippy';
import { Task } from '@/types/task';
import UiClamped from '@/components/common/UiClamped.vue';
import { useLinkify } from '@/composables/useLinkify';

defineEmits<{ (e: 'show-task'): void }>();

const props = defineProps<{ task: Task }>();

const isToday = computed(() => {
    return dayjsFromServer(props.task.start).isToday();
});

const taskDateLabel = computed(() => {
    if (isToday.value) return 'сегодня';

    return dayjsFromServer(props.task.start).format('D.MM.YY в HH:mm');
});

useLinkify(toRef(props.task, 'message'), useTemplateRef('comment'));
</script>
