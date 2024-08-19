<template>
    <div class="dashboard-card-task__moves-options hover-actions">
        <div class="hover-actions__content">
            <HoverActionsButton
                @click="$emit('toggle', taskOptions.statusTypes.NEW)"
                :disabled="isNew"
                label="Новая"
            >
                <i class="fa-solid fa-plus"></i>
            </HoverActionsButton>
            <HoverActionsButton
                @click="$emit('toggle', taskOptions.statusTypes.IN_PROGRESS)"
                :disabled="isInProgress"
                label="В процессе"
            >
                <i class="fa-solid fa-hourglass-half"></i>
            </HoverActionsButton>
            <HoverActionsButton
                @click="$emit('toggle', taskOptions.statusTypes.COMPLETED)"
                :disabled="isCompleted"
                label="Выполнена"
            >
                <i class="fa-regular fa-circle-check"></i>
            </HoverActionsButton>
            <HoverActionsButton
                @click="$emit('toggle', taskOptions.statusTypes.CANCELED)"
                :disabled="isCanceled"
                label="Отложена"
            >
                <i class="fa-solid fa-pause"></i>
            </HoverActionsButton>
        </div>
    </div>
</template>

<script setup>
import HoverActionsButton from '@/components/common/HoverActions/HoverActionsButton.vue';
import { taskOptions } from '@/const/options/task.options.js';
import { computed } from 'vue';

defineEmits(['toggle']);
const props = defineProps({
    status: {
        type: Number,
        required: true
    },
    editable: {
        type: Boolean,
        default: false
    },
    draggable: {
        type: Boolean,
        default: false
    }
});

const isNew = computed(() => props.status === taskOptions.statusTypes.NEW);
const isCompleted = computed(() => props.status === taskOptions.statusTypes.COMPLETED);
const isCanceled = computed(() => props.status === taskOptions.statusTypes.CANCELED);
const isInProgress = computed(() => props.status === taskOptions.statusTypes.IN_PROGRESS);
</script>
