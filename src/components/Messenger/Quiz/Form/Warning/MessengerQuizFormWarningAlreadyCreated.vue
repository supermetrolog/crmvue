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
                Просмотреть
            </UiButton>
            <UiButton
                @click="onEditSurvey"
                icon="fa-solid fa-pen"
                color="light"
                :loading="editingSurveyIsLoading"
            >
                Редактировать
            </UiButton>
        </template>
    </UiModal>
</template>
<script setup>
import UiButton from '@/components/common/UI/UiButton.vue';
import { useSurveyEditing } from '@/components/Survey/useSurveyEditing.js';
import { ref, toRef } from 'vue';
import UiModal from '@/components/common/UI/UiModal.vue';
import api from '@/api/api.js';
import { useSurveyForm } from '@/composables/useSurveyForm.js';
import { captureException } from '@sentry/vue';

const emit = defineEmits(['show', 'edit']);

const props = defineProps({ lastSurvey: Object });

const { remainingTimeLabel } = useSurveyEditing(toRef(props, 'lastSurvey'), {
    adminCanEdit: false
});

const editingSurveyIsLoading = ref(false);

const { editSurvey } = useSurveyForm();

async function onEditSurvey() {
    editingSurveyIsLoading.value = true;

    try {
        const survey = await api.survey.get(props.lastSurvey.id);

        emit('edit');
        
        editSurvey(survey);
    } catch (e) {
        captureException(e, { data: { survey_id: props.lastSurvey.id } });
    } finally {
        editingSurveyIsLoading.value = false;
    }
}
</script>
