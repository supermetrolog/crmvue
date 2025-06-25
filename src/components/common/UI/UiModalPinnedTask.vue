<template>
    <div class="ui-modal-pinned-task">
        <div class="mb-1 d-flex align-items-center justify-content-between">
            <p class="text-grey fs-2">Переход из задачи</p>
            <UiButtonIcon
                @click="$emit('hide')"
                icon="fa-solid fa-xmark"
                mini
                color="light"
                label="Скрыть задачу"
            />
        </div>
        <DashboardTableTasksItem
            :task
            :avatar-size="35"
            :observer-size="25"
            :show-diligence="false"
            :show-tags="false"
        />
        <div v-if="task.message" class="ui-modal-pinned-task__description mt-1">
            <p class="ui-modal-pinned-task__label">Описание</p>
            <div
                ref="messageElement"
                class="ui-modal-pinned-task__message"
                :class="{ expanded: isExpanded }"
            ></div>
            <UiDropdownActionsTrigger
                @click="isExpanded = !isExpanded"
                class="mx-auto w-auto fs-2 my-1"
                color="light"
            >
                <div class="d-flex align-items-center gap-1">
                    <span>{{ isExpanded ? 'Скрыть' : 'Показать больше' }}</span>
                    <i :class="isExpanded ? 'fa-solid fa-angle-up' : 'fa-solid fa-angle-down'" />
                </div>
            </UiDropdownActionsTrigger>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Task } from '@/types/task';
import DashboardTableTasksItem from '@/components/Dashboard/Table/TasksItem/DashboardTableTasksItem.vue';
import { ref, toRef, useTemplateRef } from 'vue';
import { useLinkify } from '@/composables/useLinkify';
import UiDropdownActionsTrigger from '@/components/common/UI/DropdownActions/UiDropdownActionsTrigger.vue';
import UiButtonIcon from '@/components/common/UI/UiButtonIcon.vue';

defineEmits<{ (e: 'hide'): void }>();
const props = defineProps<{ task: Task }>();

const messageElement = useTemplateRef('messageElement');

useLinkify(toRef(props.task, 'message'), messageElement);

const isExpanded = ref(false);
</script>
