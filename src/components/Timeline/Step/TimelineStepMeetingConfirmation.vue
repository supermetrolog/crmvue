<template>
    <div class="timeline-step">
        <div class="row">
            <div class="col-12 mb-2">
                <TimelineInfo
                    @next="$emit('next-step')"
                    title="1. Знакомство с клиентом"
                    :success="step.done"
                    :disabled="step.additional !== 1 && step.status !== 1"
                    :paused="isPausedStep"
                    :step
                    :timeline
                >
                    <p>
                        1.2. Проверьте правильность заполнения запроса, отредактируйте при
                        необходимости и затем утвердите
                    </p>
                    <template #footer>
                        <div class="d-flex gap-2">
                            <TimelineButton
                                @click="setAsCompleted"
                                :active="isCompletedStep"
                                :disabled="
                                    disabled ||
                                    (step.additional !== 1 && step.status !== 1) ||
                                    isCompletedStep ||
                                    isPausedStep
                                "
                                color="success"
                            >
                                <span>Подтвердить</span>
                                <i class="fa-solid fa-thumbs-up icon"></i>
                            </TimelineButton>
                            <TimelineButton
                                @click="$emit('edit-request')"
                                :disabled="step.additional !== 1 && step.status !== 1"
                                color="danger"
                            >
                                <span>Редактировать</span>
                                <i class="fa-solid fa-pen icon"></i>
                            </TimelineButton>

                            <TimelineButton
                                v-if="isPausedStep"
                                @click="setAsProcessed"
                                :disabled="disabled || isCompletedStep"
                                color="success"
                            >
                                <span>Снять с паузы</span>
                                <i class="fa-regular fa-circle-play icon"></i>
                            </TimelineButton>
                            <TimelineButton
                                v-else
                                @click="pausedFormIsVisible = true"
                                :disabled="
                                    disabled ||
                                    (step.additional !== 1 && step.status !== 1) ||
                                    isCompletedStep
                                "
                                color="warning"
                            >
                                <span>Шаг на паузу</span>
                                <i class="fa-regular fa-circle-pause icon"></i>
                            </TimelineButton>
                        </div>
                    </template>
                </TimelineInfo>
            </div>
            <div class="col-12">
                <Loader v-if="isLoading" />
                <RequestPreview
                    v-else-if="request"
                    @edit="$emit('edit-request')"
                    :request="request"
                    read-only
                />
            </div>
        </div>
        <teleport to="body">
            <UiModal
                v-model:visible="pausedFormIsVisible"
                @closed="clearForm"
                title="Постановка шага на паузу"
                :width="500"
            >
                <UiForm>
                    <UiFormGroup>
                        <UiDateInput
                            v-model="pauseDate"
                            :min-date="new Date()"
                            presets-label="Пауза на"
                            :presets="pausePresets"
                            required
                            placeholder="Выберите дату.."
                            label="Дата продолжения шага"
                            class="col-12"
                        />
                        <UiTextarea
                            v-model="pauseComment"
                            label="Комментарий"
                            :min-height="50"
                            :max-height="150"
                            auto-height
                            class="col-12"
                        />
                    </UiFormGroup>
                </UiForm>
                <template #actions="{ close }">
                    <UiButton
                        @click="setAsPaused"
                        color="success-light"
                        icon="fa-regular fa-circle-pause"
                        :disabled="!Boolean(pauseDate)"
                    >
                        Поставить на паузу
                    </UiButton>
                    <UiButton @click="close" color="light" icon="fa-solid fa-ban">
                        Отмена
                    </UiButton>
                </template>
            </UiModal>
        </teleport>
    </div>
</template>

<script setup>
import TimelineInfo from '@/components/Timeline/TimelineInfo.vue';
import { useDelayedLoader } from '@/composables/useDelayedLoader.js';
import Loader from '@/components/common/Loader.vue';
import TimelineButton from '@/components/Timeline/TimelineButton.vue';
import { useTimelineContext } from '@/components/Timeline/useTimelineContext.js';
import RequestPreview from '@/components/Request/RequestPreview.vue';
import { computed, ref } from 'vue';
import dayjs from 'dayjs';
import UiModal from '@/components/common/UI/UiModal.vue';
import UiButton from '@/components/common/UI/UiButton.vue';
import UiForm from '@/components/common/Forms/UiForm.vue';
import UiFormGroup from '@/components/common/Forms/UiFormGroup.vue';
import UiDateInput from '@/components/common/Forms/UiDateInput.vue';
import UiTextarea from '@/components/common/Forms/UiTextarea.vue';

const emit = defineEmits(['update-step', 'updated-objects', 'next-step', 'edit-request']);
const props = defineProps({
    step: {
        type: Object,
        required: true
    },
    disabled: Boolean
});

const { request, timeline, generatePayload, isCompletedStep } = useTimelineContext(
    () => props.step
);

const { isLoading } = useDelayedLoader();
// events

function setAsCompleted() {
    emit('update-step', generatePayload({ done: 1, status: 1, additional: 0 }), true);
}

const pausedFormIsVisible = ref(false);
const pauseDate = ref(null);
const pauseComment = ref(null);

const pausePresets = [
    {
        value: dayjs().add(1, 'day').toDate(),
        label: '1 день'
    },
    {
        value: dayjs().add(2, 'day').toDate(),
        label: '2 дня'
    },
    {
        value: dayjs().add(3, 'day').toDate(),
        label: '3 дня'
    },
    {
        value: dayjs().add(5, 'day').toDate(),
        label: '5 дней'
    },
    {
        value: dayjs().add(7, 'day').toDate(),
        label: 'Неделю'
    },
    {
        value: dayjs().add(14, 'day').toDate(),
        label: '2 недели'
    }
];

function clearForm() {
    pauseDate.value = null;
    pauseComment.value = null;
}

function setAsPaused() {
    emit(
        'update-step',
        generatePayload({
            negative: 1,
            date: dayjs(pauseDate.value).toJSON(),
            comment: pauseComment.value
        })
    );

    pausedFormIsVisible.value = false;
    clearForm();
}

function setAsProcessed() {
    emit('update-step', generatePayload({ negative: 0, date: null, comment: null }));
}

const isPausedStep = computed(() => props.step.negative && props.step.additional === 1);
</script>
