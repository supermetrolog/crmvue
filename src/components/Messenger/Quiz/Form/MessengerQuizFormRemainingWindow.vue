<template>
    <div class="messenger-quiz__disabled">
        <Modal
            show
            :blackout-opacity="0.1"
            :width="520"
            hide-header
            body-class="messenger-quiz__disabled-body"
        >
            <div class="text-center">
                <i class="fa-solid fa-hand icon mb-2" />
                <p class="fs-3 mb-3">Сегодня опрос уже пройден!</p>
                <p>
                    <i class="fa-regular fa-clock mr-1" />
                    Заполнить новый можно через {{ remainingTimeLabel }}
                </p>
            </div>
            <template #footer>
                <UiButton
                    @click="$emit('show')"
                    rect
                    shadow
                    class="fs-2 font-weight-bold"
                    uppercase
                >
                    <i class="fa-solid fa-arrow-up-right-from-square mr-1"></i>
                    <span>Просмотреть опрос</span>
                </UiButton>
                <UiButton
                    @click="$emit('schedule-call')"
                    rect
                    shadow
                    class="fs-2 font-weight-bold"
                    uppercase
                >
                    <i class="fa-solid fa-phone mr-1"></i>
                    <span>Запланировать звонок</span>
                </UiButton>
            </template>
        </Modal>
    </div>
</template>
<script setup>
import { toRef } from 'vue';
import { useSurveyEditing } from '@/components/Survey/useSurveyEditing.js';
import Modal from '@/components/common/Modal.vue';
import UiButton from '@/components/common/UI/UiButton.vue';

defineEmits(['show', 'schedule-call']);
const props = defineProps({ lastSurvey: Object });

const { remainingTimeLabel } = useSurveyEditing(toRef(props, 'lastSurvey'));
</script>
