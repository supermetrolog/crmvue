<template>
    <DashboardCard>
        <template #header>
            <SettingsFormHeader
                @add="questionFormIsVisible = true"
                @load="loadQuestions"
                @refresh="fetchQuestions"
                title="Управление вопросами"
                :size="questions.length"
                :pagination="questionsPagination"
            />
        </template>
        <div class="row align-items-end mb-3">
            <Input
                v-model="filters.search"
                class="col-6"
                label="Поиск"
                placeholder="ID вопроса, заголовок вопроса, текста ответа.."
            />
            <UiCol cols="2">
                <Button
                    @click="clearFilters"
                    :disabled="!hasFilters || isLoading"
                    danger
                    сдфыы
                    icon
                >
                    <i class="fa-solid fa-trash" />
                    <span>Сбросить</span>
                </Button>
            </UiCol>
        </div>
        <div class="d-flex flex-wrap gap-2 mb-2">
            <Loader v-if="questionsIsLoading" small />
            <UiCol v-else-if="!filteredQuestions.length" cols="4" class="mx-auto my-2">
                <EmptyData>Список вопросов пуст..</EmptyData>
            </UiCol>
            <SettingsFormElement
                v-for="question in filteredQuestions"
                :key="question.id"
                @delete="deleteQuestion(question)"
                @edit="editQuestion(question)"
                :element="question"
                can-edit
                :is-deleted="question.deleted_at !== null"
                class="h-100"
            >
                <SettingsSurveyQuestionsElement :question />
            </SettingsFormElement>
        </div>
        <teleport to="body">
            <FormQuestion
                v-if="questionFormIsVisible"
                @close="closeQuestionForm"
                @updated="onQuestionUpdated"
                @created="onQuestionCreated"
                @deleted="onQuestionDeleted"
                :form-data="editingQuestion"
            />
        </teleport>
    </DashboardCard>
</template>
<script setup>
import SettingsFormHeader from '@/components/Settings/SettingsFormHeader.vue';
import DashboardCard from '@/components/Dashboard/Card/DashboardCard.vue';
import Loader from '@/components/common/Loader.vue';
import api from '@/api/api.js';
import { computed, onMounted, reactive, ref, shallowRef } from 'vue';
import { useDelayedLoader } from '@/composables/useDelayedLoader.js';
import FormQuestion from '@/components/Forms/FormQuestion.vue';
import { useNotify } from '@/utils/use/useNotify.js';
import { useConfirm } from '@/composables/useConfirm.js';
import SettingsFormElement from '@/components/Settings/SettingsFormElement.vue';
import SettingsSurveyQuestionsElement from '@/components/Settings/Survey/SettingsSurveyQuestionsElement.vue';
import Button from '@/components/common/Button.vue';
import Input from '@/components/common/Forms/Input.vue';
import UiCol from '@/components/common/UI/UiCol.vue';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.js';
import { isNotEmptyString } from '@/utils/helpers/string/isNotEmptyString.js';
import EmptyData from '@/components/common/EmptyData.vue';

const onQuestionUpdated = question => {
    const questionElement = questions.value.find(element => element.id === question.id);
    if (questionElement) Object.assign(questionElement, question);

    closeQuestionForm();
};

const onQuestionCreated = () => {
    fetchQuestions();
    closeQuestionForm();
};

const onQuestionDeleted = () => {
    fetchQuestions();
};

const notify = useNotify();
const { confirm } = useConfirm();

const deleteQuestion = async question => {
    const confirmed = await confirm(
        `Вы действительно хотите удалить Вопрос "#${question.id} ${question.text}"?`
    );
    if (!confirmed) return;

    const deleted = await api.question.delete(question.id);
    if (deleted) {
        notify.success('Question успешно удален.');
        await Promise.allSettled([fetchQuestions()]);
    }
};

const editQuestion = question => {
    editingQuestion.value = question;
    questionFormIsVisible.value = true;
};

const loadQuestions = async () => {
    const response = await api.question.list(questionsPagination.value.currentPage + 1);

    if (response) {
        questions.value.push(...response.data);
        questionsPagination.value = response.pagination;
    }
};

const fetchQuestions = async () => {
    questionsIsLoading.value = true;

    const response = await api.question.getWithAnswers();
    if (response) {
        questions.value = response.data;
        questionsPagination.value = response.pagination;
    }

    questionsIsLoading.value = false;
};

const closeQuestionForm = () => {
    questionFormIsVisible.value = false;
    editingQuestion.value = null;
};

const editingQuestion = shallowRef(false);
const questionFormIsVisible = shallowRef(false);

const questions = ref([]);
const { isLoading: questionsIsLoading } = useDelayedLoader();
const questionsPagination = ref(null);

onMounted(fetchQuestions);

// filters

const filters = reactive({
    search: null
});

function clearFilters() {
    filters.search = null;
}

const hasFilters = computed(() => {
    return Object.values(filters).some(isNotNullish);
});

const filteredQuestions = computed(() =>
    questions.value.filter(question => {
        if (isNotNullish(filters.search) && isNotEmptyString(filters.search)) {
            const search = filters.search.toLowerCase();

            return question.text.toLowerCase().includes(search) || question.group?.includes(search);
        }

        return questions.value;
    })
);
</script>
