<template>
    <UiModal
        @close="$emit('close')"
        custom-close
        show
        relative
        :loading
        :width="550"
        small
        title="Изменение статуса задачи"
    >
        <UiForm>
            <UiFormGroup>
                <MultiSelect
                    v-model="current"
                    label="Выберите статус"
                    required
                    :options="statusOptions"
                    :v="v$.current"
                    class="col-12"
                >
                    <template #option="{ option }">
                        <div class="d-flex gap-1 align-items-center">
                            <span class="task-card-modal__status-icon">
                                <i :class="option.icon" />
                            </span>
                            |
                            <span>{{ option.label }}</span>
                        </div>
                    </template>
                    <template #singlelabel="{ value }">
                        <div class="d-flex gap-1 align-items-center">
                            <span class="task-card-modal__status-icon">
                                <i :class="value.icon" />
                            </span>
                            |
                            <span>{{ value.label }}</span>
                        </div>
                    </template>
                </MultiSelect>
                <AnimationTransition :speed="0.3">
                    <UiDateInput
                        v-if="isCanceled"
                        v-model="impossibleTo"
                        :v="v$.impossibleTo"
                        required
                        label="Отложено до"
                        placeholder="Выберите дату.."
                        class="task-card-modal__field col-12"
                    />
                </AnimationTransition>
                <UiTextarea
                    v-model="comment"
                    :disabled="!canBeSaved"
                    class="task-card-modal__field col-12"
                    label="Комментарий"
                    :min-height="70"
                    auto-height
                    :max-height="150"
                />
            </UiFormGroup>
        </UiForm>
        <template #actions>
            <UiButton
                @click.prevent="toggle"
                :disabled="!canBeSaved || loading"
                color="success-light"
                icon="fa-solid fa-check"
                small
            >
                Сохранить
            </UiButton>
            <UiButton @click.prevent="$emit('close')" color="light" icon="fa-solid fa-ban" small>
                Отмена
            </UiButton>
        </template>
    </UiModal>
</template>

<script setup>
import { taskOptions } from '@/const/options/task.options.js';
import { computed, shallowRef, watch } from 'vue';
import UiTextarea from '@/components/common/Forms/UiTextarea.vue';
import { helpers, required, requiredIf } from '@vuelidate/validators';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import UiForm from '@/components/common/Forms/UiForm.vue';
import MultiSelect from '@/components/common/Forms/MultiSelect.vue';
import UiDateInput from '@/components/common/Forms/UiDateInput.vue';
import UiButton from '@/components/common/UI/UiButton.vue';
import UiModal from '@/components/common/UI/UiModal.vue';
import UiFormGroup from '@/components/common/Forms/UiFormGroup.vue';
import { useValidation } from '@/composables/useValidation.js';

const statusOptions = [
    {
        value: taskOptions.statusTypes.NEW,
        label: 'Новая',
        icon: 'fa-solid fa-plus'
    },
    {
        value: taskOptions.statusTypes.IN_PROGRESS,
        label: 'В процессе',
        icon: 'fa-solid fa-hourglass-half'
    },
    {
        value: taskOptions.statusTypes.COMPLETED,
        label: 'Выполнена',
        icon: 'fa-regular fa-circle-check'
    },
    {
        value: taskOptions.statusTypes.CANCELED,
        label: 'Отложена',
        icon: 'fa-solid fa-pause'
    }
];

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

const isCanceled = computed(() => current.value === taskOptions.statusTypes.CANCELED);
const canBeSaved = computed(() => {
    return (
        current.value !== props.status ||
        (isCanceled.value &&
            current.value === props.status &&
            impossibleTo.value !== props.impossibleTo)
    );
});

const { v$, validate } = useValidation(
    {
        impossibleTo: {
            required: helpers.withMessage('Выберите дату', requiredIf(isCanceled))
        },
        current: {
            required: helpers.withMessage('Выберите статус', required)
        }
    },
    { impossibleTo, current }
);

watch(
    () => props.loading,
    value => {
        if (!value) comment.value = null;
    }
);

function createMessage() {
    if (comment.value == null || !comment.value.length) return null;
    if (current.value === props.status && isCanceled.value)
        return `[Дата возобновления изменена на ${impossibleTo.value}] ${comment.value}`;
    return `[${taskOptions.status[props.status]} => ${taskOptions.status[current.value]}] ${comment.value}`;
}

function formToPayload() {
    return {
        comment: createMessage(),
        status: current.value,
        impossible_to: impossibleTo.value
    };
}

async function toggle() {
    const isValid = await validate();
    if (!isValid) return;

    emit('toggle', formToPayload());
}
</script>
