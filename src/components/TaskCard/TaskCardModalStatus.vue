<template>
    <TaskCardModal @close="$emit('close')" :loading title="Изменение статуса задачи">
        <p class="task-card__label">Выберите статус:</p>
        <div class="task-card-modal__list">
            <HoverActionsButton
                @click="current = taskOptions.statusTypes.CANCELED"
                class="task-card-modal__element"
                :disabled="isCanceled"
                :active="isCanceled"
                label="Отложена"
            >
                <i class="fa-solid fa-pause"></i>
            </HoverActionsButton>
            <i class="fa-solid fa-arrow-left task-card-modal__arrow" />
            <HoverActionsButton
                @click="current = taskOptions.statusTypes.NEW"
                class="task-card-modal__element"
                disabled
                :active="isNew"
                label="Новая"
            >
                <i class="fa-solid fa-plus"></i>
            </HoverActionsButton>
            <i class="fa-solid fa-arrow-right task-card-modal__arrow" />
            <HoverActionsButton
                @click="current = taskOptions.statusTypes.IN_PROGRESS"
                class="task-card-modal__element"
                :disabled="isInProgress"
                :active="isInProgress"
                label="В процессе"
            >
                <i class="fa-solid fa-hourglass-half"></i>
            </HoverActionsButton>
            <i class="fa-solid fa-arrow-right task-card-modal__arrow" />
            <HoverActionsButton
                @click="current = taskOptions.statusTypes.COMPLETED"
                class="task-card-modal__element"
                :disabled="isCompleted"
                :active="isCompleted"
                label="Выполнена"
            >
                <i class="fa-regular fa-circle-check"></i>
            </HoverActionsButton>
        </div>
        <Form class="task-card-modal__form">
            <AnimationTransition :speed="0.3">
                <Input
                    v-if="isCanceled"
                    v-model="impossibleTo"
                    :v="v$.impossibleTo"
                    required
                    class="task-card-modal__field mb-2"
                    type="date"
                    label="Отложено до"
                />
            </AnimationTransition>
            <Textarea
                v-model="comment"
                auto-height
                :disabled="!canBeSaved"
                class="task-card-modal__field"
                label="Комментарий"
            />
            <div class="d-flex gap-2 mt-2">
                <TaskCardButton @click.prevent="toggle" :disabled="!canBeSaved || loading">
                    Сохранить
                </TaskCardButton>
                <TaskCardButton @click.prevent="$emit('close')"> Отмена </TaskCardButton>
            </div>
        </Form>
    </TaskCardModal>
</template>

<script setup>
import HoverActionsButton from '@/components/common/HoverActions/HoverActionsButton.vue';
import { taskOptions } from '@/const/options/task.options.js';
import { computed, shallowRef, watch } from 'vue';
import Textarea from '@/components/common/Forms/Textarea.vue';
import Input from '@/components/common/Forms/Input.vue';
import useVuelidate from '@vuelidate/core';
import { helpers, requiredIf } from '@vuelidate/validators';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import Form from '@/components/common/Forms/Form.vue';
import TaskCardButton from '@/components/TaskCard/TaskCardButton.vue';
import TaskCardModal from '@/components/TaskCard/TaskCardModal.vue';

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
