<template>
    <UiModal
        class="messenger-quiz__disabled"
        show
        hide-header
        relative
        :can-be-closed="false"
        title="Сегодня опрос уже пройден"
        :width="520"
    >
        <div class="d-flex align-items-center justify-content-center gap-4 p-4">
            <i class="fa-regular fa-clock icon" />
            <div>
                <p class="font-weight-semi fs-4">Сегодня опрос уже пройден</p>
                <p>Заполнить новый можно через {{ remainingTimeLabel }}</p>
            </div>
        </div>
        <template #actions>
            <UiButton
                @click="$emit('show')"
                icon="fa-solid fa-arrow-up-right-from-square"
                color="light"
            >
                Просмотреть опрос
            </UiButton>
            <!--            <UiButton @click="$emit('schedule-call')" icon="fa-solid fa-phone" color="light">-->
            <!--                Запланировать звонок-->
            <!--            </UiButton>-->
        </template>
    </UiModal>
</template>
<script setup>
import UiButton from '@/components/common/UI/UiButton.vue';
import { useSurveyEditing } from '@/components/Survey/useSurveyEditing.js';
import { toRef } from 'vue';
import UiModal from '@/components/common/UI/UiModal.vue';

defineEmits(['show', 'schedule-call']);

const props = defineProps({ lastSurvey: Object });

const { remainingTimeLabel } = useSurveyEditing(toRef(props, 'lastSurvey'), {
    adminCanEdit: false
});

// TODO: Запланировать звонок
</script>
