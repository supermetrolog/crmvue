<template>
    <div class="messenger-quiz__disabled">
        <UiModal
            show
            custom-close
            :blackout-opacity="0.1"
            :width="520"
            hide-header
            body-class="messenger-quiz__disabled-body"
            title="Опрос заблокирован"
        >
            <div class="d-flex align-items-center justify-content-center gap-3">
                <i class="fa-solid fa-hand icon" />
                <div>
                    <p class="fs-3 mb-2 font-weight-semi">Сегодня опрос уже пройден!</p>
                    <p>
                        <i class="fa-regular fa-clock mr-1" />
                        Заполнить новый можно через {{ remainingTimeLabel }}
                    </p>
                </div>
            </div>
            <template #actions>
                <UiButton
                    @click="$emit('show')"
                    class="font-weight-bold flex-grow-1"
                    icon="fa-solid fa-arrow-up-right-from-square"
                    color="light"
                    uppercase
                    center
                >
                    Просмотреть опрос
                </UiButton>
                <UiButton
                    @click="$emit('schedule-call')"
                    class="font-weight-bold flex-grow-1"
                    icon="fa-solid fa-phone"
                    color="light"
                    uppercase
                    center
                >
                    Запланировать звонок
                </UiButton>
            </template>
        </UiModal>
    </div>
</template>
<script setup>
import { toRef } from 'vue';
import { useSurveyEditing } from '@/components/Survey/useSurveyEditing.js';
import UiModal from '@/components/common/UI/UiModal.vue';
import UiButton from '@/components/common/UI/UiButton.vue';

defineEmits(['show', 'schedule-call']);
const props = defineProps({ lastSurvey: Object });

const { remainingTimeLabel } = useSurveyEditing(toRef(props, 'lastSurvey'));
</script>
