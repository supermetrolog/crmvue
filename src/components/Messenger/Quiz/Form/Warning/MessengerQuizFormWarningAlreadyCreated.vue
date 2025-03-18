<template>
    <MessengerQuizFormWarningModal
        title="Сегодня опрос уже пройден"
        icon="fa-solid fa-hand"
        :width="520"
    >
        <template #message>
            <i class="fa-regular fa-clock mr-1" />
            Заполнить новый можно через {{ remainingTimeLabel }}
        </template>
        <template #actions>
            <UiButton
                @click="$emit('show')"
                class="font-weight-bold flex-grow-1"
                icon="fa-solid fa-arrow-up-right-from-square"
                color="light"
                uppercase
                bolder
            >
                Просмотреть опрос
            </UiButton>
            <UiButton
                @click="$emit('schedule-call')"
                class="font-weight-bold flex-grow-1"
                icon="fa-solid fa-phone"
                color="light"
                uppercase
                bolder
            >
                Запланировать звонок
            </UiButton>
        </template>
    </MessengerQuizFormWarningModal>
</template>
<script setup>
import MessengerQuizFormWarningModal from '@/components/Messenger/Quiz/Form/MessengerQuizFormWarningModal.vue';
import UiButton from '@/components/common/UI/UiButton.vue';
import { useSurveyEditing } from '@/components/Survey/useSurveyEditing.js';
import { toRef } from 'vue';

defineEmits(['show', 'schedule-call']);

const props = defineProps({ lastSurvey: Object });

const { remainingTimeLabel } = useSurveyEditing(toRef(props, 'lastSurvey'));
</script>
