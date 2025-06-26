<template>
    <Modal
        @close="closeView"
        :show="viewIsVisible"
        :title="formattedTitle"
        :width="1800"
        class="survey-form"
    >
        <SurveyCard
            @edit="editSurvey"
            @hide="closeView"
            @change-title="title = $event"
            class="survey-preview"
            :survey-id="surveyId"
            :survey="survey"
        />
    </Modal>
    <UiModal
        v-model:visible="formIsVisible"
        title="Редактирование опроса"
        :width="1200"
        :min-height="300"
        :close-on-outside-click="false"
        :close-on-press-esc="false"
    >
        <Spinner v-if="isLoading" label="Загрузка опроса.." small class="absolute-center" />
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
import SurveyCard from '@/components/SurveyCard/SurveyCard.vue';
import UiModal from '@/components/common/UI/UiModal.vue';
import FormSurvey from '@/components/Forms/FormSurvey.vue';
import api from '@/api/api.js';
import Spinner from '@/components/common/Spinner.vue';
import EmptyData from '@/components/common/EmptyData.vue';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.ts';

const surveyId = ref(null);
const survey = ref(null);

const title = ref(null);

const formattedTitle = computed(() => {
    if (isNotNullish(title.value)) return title.value;

    if (isNotNullish(survey.value)) {
        if (survey.value.status === 'draft') {
            return `Черновик | Просмотр опроса #${survey.value?.id}`;
        }

        return `Просмотр опроса #${survey.value?.id} | ${survey.value?.chatMember?.model?.full_name}`;
    }

    if (isNotNullish(surveyId.value)) {
        return `Просмотр опроса #${surveyId.value}`;
    }

    return 'Просмотр опроса';
});

const {
    onPopupShowed,
    destroy: destroyPopup,
    cancel,
    props,
    submit
} = useAsyncPopup('surveyPreview');

onPopupShowed(() => {
    title.value = null;
    showOrEditSurvey(props.value);
});

onUnmounted(() => {
    destroyPopup();
});

function showOrEditSurvey(options) {
    if (options.survey) {
        survey.value = toRaw(options.survey);
        surveyId.value = null;
    } else {
        surveyId.value = options.surveyId ?? options.quizId;
        survey.value = null;
    }

    if (options.editMode) openSurveyEditing();
    else viewIsVisible.value = true;
}

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
