<template>
    <div class="dashboard-task-item-preview-status">
        <Loader v-if="loading" />
        <div class="dashboard-task-item-preview-status__header">
            <p class="dashboard-task-item-preview__label">Изменение статуса задачи</p>
            <i
                v-tippy="'Закрыть'"
                @click="$emit('close')"
                class="dashboard-task-item-preview__close fa-regular fa-xmark-circle"
            />
        </div>
        <div class="dashboard-task-item-preview-status__preview gap-2">
            <span class="dashboard-task-item-preview__label">Текущий статус:</span>
            <DashboardChip class="dashboard-task-item-preview-status__chip">
                {{ status }}
            </DashboardChip>
            <AnimationTransition :speed="0.4">
                <div v-if="taskIsChanged" class="d-flex align-items-center gap-2">
                    <i class="fa-solid fa-arrow-right" />
                    <DashboardChip class="dashboard-task-item-preview-status__chip">
                        {{ newStatus }}
                    </DashboardChip>
                </div>
            </AnimationTransition>
        </div>
        <p class="dashboard-task-item-preview__label">Выберите статус:</p>
        <div class="dashboard-task-item-preview-status__list">
            <HoverActionsButton
                @click="current = taskOptions.statusTypes.CANCELED"
                class="dashboard-task-item-preview-status__element"
                :disabled="isCanceled"
                :active="isCanceled"
                label="Отложена"
            >
                <i class="fa-solid fa-pause"></i>
            </HoverActionsButton>
            <i class="fa-solid fa-arrow-left dashboard-task-item-preview-status__arrow" />
            <HoverActionsButton
                @click="current = taskOptions.statusTypes.NEW"
                class="dashboard-task-item-preview-status__element"
                disabled
                :active="isNew"
                label="Новая"
            >
                <i class="fa-solid fa-plus"></i>
            </HoverActionsButton>
            <i class="fa-solid fa-arrow-right dashboard-task-item-preview-status__arrow" />
            <HoverActionsButton
                @click="current = taskOptions.statusTypes.IN_PROGRESS"
                class="dashboard-task-item-preview-status__element"
                :disabled="isInProgress"
                :active="isInProgress"
                label="В процессе"
            >
                <i class="fa-solid fa-hourglass-half"></i>
            </HoverActionsButton>
            <i class="fa-solid fa-arrow-right dashboard-task-item-preview-status__arrow" />
            <HoverActionsButton
                @click="current = taskOptions.statusTypes.COMPLETED"
                class="dashboard-task-item-preview-status__element"
                :disabled="isCompleted"
                :active="isCompleted"
                label="Выполнена"
            >
                <i class="fa-regular fa-circle-check"></i>
            </HoverActionsButton>
        </div>
        <Form class="dashboard-task-item-preview-status__form">
            <AnimationTransition :speed="0.3">
                <Input
                    v-if="isCanceled"
                    v-model="impossibleTo"
                    :v="v$.impossibleTo"
                    required
                    class="dashboard-task-item-preview-status__field mb-2"
                    type="date"
                    label="Отложено до"
                />
            </AnimationTransition>
            <Textarea
                v-model="comment"
                auto-height
                :disabled="!canBeSaved"
                class="dashboard-task-item-preview-status__field"
                label="Комментарий"
            />
            <div class="d-flex gap-2 mt-2">
                <button
                    @click.prevent="toggle"
                    :disabled="!canBeSaved || loading"
                    class="dashboard-task-item-preview__button"
                >
                    Сохранить
                </button>
                <button @click.prevent="$emit('close')" class="dashboard-task-item-preview__button">
                    Отмена
                </button>
            </div>
        </Form>
    </div>
</template>

<script setup>
import HoverActionsButton from '@/components/common/HoverActions/HoverActionsButton.vue';
import { taskOptions } from '@/const/options/task.options.js';
import { computed, shallowRef, watch } from 'vue';
import Textarea from '@/components/common/Forms/Textarea.vue';
import Input from '@/components/common/Forms/Input.vue';
import useVuelidate from '@vuelidate/core';
import { helpers, requiredIf } from '@vuelidate/validators';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import Loader from '@/components/common/Loader.vue';
import Form from '@/components/common/Forms/Form.vue';

const emit = defineEmits(['toggle', 'close']);
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
    },
    impossibleTo: {
        type: String,
        default: null
    },
    loading: {
        type: Boolean,
        default: false
    }
});

const current = shallowRef(props.status);
const comment = shallowRef(null);
const impossibleTo = shallowRef(props.impossibleTo);

const isNew = computed(() => current.value === taskOptions.statusTypes.NEW);
const isCompleted = computed(() => current.value === taskOptions.statusTypes.COMPLETED);
const isCanceled = computed(() => current.value === taskOptions.statusTypes.CANCELED);
const isInProgress = computed(() => current.value === taskOptions.statusTypes.IN_PROGRESS);
const canBeSaved = computed(() => {
    return (
        current.value !== props.status ||
        (isCanceled.value &&
            current.value === props.status &&
            impossibleTo.value !== props.impossibleTo)
    );
});
const status = computed(() => taskOptions.status[props.status]);
const newStatus = computed(() => taskOptions.status[current.value]);
const taskIsChanged = computed(() => current.value !== props.status);

const v$ = useVuelidate(
    {
        impossibleTo: {
            required: helpers.withMessage('Выберите дату', requiredIf(isCanceled))
        }
    },
    { impossibleTo }
);

watch(
    () => props.loading,
    value => {
        if (!value) comment.value = null;
    }
);

const createMessage = () => {
    if (comment.value == null || !comment.value.length) return null;
    if (current.value === props.status && isCanceled.value)
        return `[Дата возобновления изменена на ${impossibleTo.value}] ${comment.value}`;
    return `[${taskOptions.status[props.status]} => ${taskOptions.status[current.value]}] ${comment.value}`;
};

const formToPayload = () => {
    return {
        comment: createMessage(),
        status: current.value,
        impossible_to: impossibleTo.value
    };
};

const toggle = async () => {
    v$.value.$validate();
    if (v$.value.$error) return;
    emit('toggle', formToPayload());
};
</script>
