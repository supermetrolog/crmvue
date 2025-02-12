<template>
    <Modal @close="closeView" :show="viewIsVisible" title="Просмотр опросника" width="970">
        <div class="survey-preview">
            <MessengerQuizPreview
                @edit="editSurvey"
                @hide="cancel"
                :quiz-id="surveyId"
                :quiz="survey"
            />
        </div>
    </Modal>
    <UiModal
        v-model:visible="formIsVisible"
        title="Редактирование опросника"
        :width="800"
        :min-height="300"
        :close-on-outside-click="false"
        :close-on-press-esc="false"
    >
        <Spinner v-if="isLoading" label="Загрузка опросника.." small class="absolute-center" />
        <FormSurvey
            v-else-if="currentEditingSurvey"
            @close="closeEditing"
            @updated="onSurveyUpdated"
            :form-data="currentEditingSurvey"
        />
        <EmptyData v-else>Опрос не найден..</EmptyData>
    </UiModal>
</template>
<script setup>
import { computed, onUnmounted, ref, toRaw } from 'vue';
import { useAsyncPopup } from '@/composables/useAsyncPopup.js';
import Modal from '@/components/common/Modal.vue';
import MessengerQuizPreview from '@/components/Messenger/Quiz/Preview/MessengerQuizPreview.vue';
import UiModal from '@/components/common/UI/UiModal.vue';
import FormSurvey from '@/components/Forms/FormSurvey.vue';
import api from '@/api/api.js';
import Spinner from '@/components/common/Spinner.vue';
import EmptyData from '@/components/common/EmptyData.vue';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.js';

const surveyId = ref(null);
const survey = ref(null);

const {
    onPopupShowed,
    destroy: destroyPopup,
    cancel,
    props,
    submit
} = useAsyncPopup('surveyPreview');

onPopupShowed(() => {
    if (props.value.survey) {
        survey.value = toRaw(props.value.survey);
    } else {
        surveyId.value = props.value.surveyId ?? props.value.quizId;
    }

    if (props.value.editMode) openSurveyEditing();
    else viewIsVisible.value = true;
});

onUnmounted(() => {
    destroyPopup();
});

// view

const viewIsVisible = ref(false);

function closeView() {
    viewIsVisible.value = false;
    survey.value = null;
    surveyId.value = null;
}

// edit

const formIsVisible = ref(false);
const editingSurvey = ref(null);
const isLoading = ref(false);

async function openSurveyEditing() {
    if (!survey.value) {
        isLoading.value = true;

        formIsVisible.value = true;

        const response = await api.survey.get(surveyId.value);
        if (response) editingSurvey.value = response;

        isLoading.value = false;
    }

    formIsVisible.value = true;
}

function editSurvey(survey) {
    editingSurvey.value = survey;
    formIsVisible.value = true;
}

const currentEditingSurvey = computed(() => {
    if (isNotNullish(survey.value)) return survey.value;
    return editingSurvey.value;
});

function closeEditing() {
    formIsVisible.value = false;
    editingSurvey.value = null;
}

function onSurveyUpdated(value) {
    formIsVisible.value = false;
    survey.value = value;

    if (!viewIsVisible.value) submit(survey.value);
}
</script>
